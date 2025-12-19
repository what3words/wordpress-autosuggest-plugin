import metadata from './block.json';
import {
  ValidatedTextInput,
  registerCheckoutBlock,
} from '@woocommerce/blocks-checkout';
import { __ } from '@wordpress/i18n';
import { useEffect, useState, useCallback, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { CHECKOUT_STORE_KEY } from '@woocommerce/block-data';

import './frontend.scss';

// Get settings passed from PHP via wcSettings global
const getSettings = () => {
  const wcSettings = window.wcSettings?.['what3words-autosuggest_data'] || {};
  return wcSettings;
};

const settings = getSettings();

// Check if what3words library is already loaded (by public.js)
const isComponentLoaded = () => {
  return (
    window.customElements && window.customElements.get('what3words-autosuggest')
  );
};

const waitForComponent = () => {
  return new Promise((resolve, reject) => {
    if (isComponentLoaded()) {
      resolve();
      return;
    }
    // Wait for library to load (check every 100ms, timeout after 5s)
    let attempts = 0;
    const maxAttempts = 50;
    const checkInterval = setInterval(() => {
      attempts++;
      if (isComponentLoaded()) {
        clearInterval(checkInterval);
        resolve();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        reject(new Error('what3words component failed to load'));
      }
    }, 100);
  });
};

const BlockComponent = ({ checkoutExtensionData, addressType }) => {
  const fieldId = `w3w-${addressType}`;
  const [what3words, setWhat3words] = useState('');
  const inputRef = useRef(null);
  const componentRef = useRef(null);
  const { setExtensionData } = checkoutExtensionData;

  // Get useShippingAsBilling state from store
  const useShippingAsBilling = useSelect(select => {
    const store = select(CHECKOUT_STORE_KEY);
    return store.getUseShippingAsBilling
      ? store.getUseShippingAsBilling()
      : false;
  });

  // Track country values from DOM (more reliable than store methods)
  const [billingCountry, setBillingCountry] = useState('');
  const [shippingCountry, setShippingCountry] = useState('');

  // Get country from DOM elements
  useEffect(() => {
    const getCountryFromField = fieldSelector => {
      const field = document.querySelector(`#${fieldSelector}`);
      if (!field) return '';

      // Handle select dropdown
      if (field.tagName === 'SELECT') {
        return field.value || '';
      }

      // Handle hidden input (used by Blocks)
      if (field.type === 'hidden') {
        return field.value || '';
      }

      return '';
    };

    const updateCountries = () => {
      const billing = getCountryFromField('billing_country');
      const shipping = getCountryFromField('shipping_country');
      setBillingCountry(billing);
      setShippingCountry(shipping);
    };

    // Initial update
    updateCountries();

    // Listen for country changes
    const billingField = document.querySelector('#billing_country');
    const shippingField = document.querySelector('#shipping_country');

    if (billingField) {
      billingField.addEventListener('change', updateCountries);
    }
    if (shippingField) {
      shippingField.addEventListener('change', updateCountries);
    }

    // Also listen for WooCommerce Blocks checkout updates
    const handleCheckoutUpdate = () => {
      setTimeout(updateCountries, 100);
    };
    document.body.addEventListener('updated_checkout', handleCheckoutUpdate);

    return () => {
      if (billingField) {
        billingField.removeEventListener('change', updateCountries);
      }
      if (shippingField) {
        shippingField.removeEventListener('change', updateCountries);
      }
      document.body.removeEventListener(
        'updated_checkout',
        handleCheckoutUpdate
      );
    };
  }, []);

  // Initialize what3words component (similar to original attachComponentToTargets)
  useEffect(() => {
    if (!inputRef.current || componentRef.current) return;

    if (!settings.apiKey) {
      // eslint-disable-next-line no-console
      console.error('what3words API key not configured');
      return;
    }

    const initComponent = async () => {
      try {
        // Wait for library to be available (loaded by public.js)
        await waitForComponent();

        // Find the actual input element by ID (ValidatedTextInput wraps it)
        const input = document.getElementById(fieldId);
        if (!input) {
          // eslint-disable-next-line no-console
          console.warn(`Input element #${fieldId} not found`);
          return;
        }

        // Check if already wrapped (avoid double-wrapping)
        if (
          input.parentNode?.getAttribute('class') ===
            'what3words-autosuggest-input-wrapper' ||
          input.parentNode?.localName === 'what3words-autosuggest'
        ) {
          return;
        }

        // Create what3words component (same as original generateAutosuggestComponent)
        const w3wComponent = document.createElement('what3words-autosuggest');
        w3wComponent.setAttribute('api_key', settings.apiKey);
        w3wComponent.setAttribute('variant', 'inherit');

        // Set header for tracking
        const headerValue = `what3words-WordPress/${settings.version || '1.0.0'} (WooCommerce-Blocks)`;
        w3wComponent.setAttribute(
          'headers',
          JSON.stringify({
            'X-W3W-Plugin': headerValue,
          })
        );

        // Apply settings
        if (settings.returnCoordinates) {
          w3wComponent.setAttribute('return_coordinates', 'true');
        }

        if (settings.enableClipToCountry && settings.clipToCountry) {
          w3wComponent.setAttribute('clip_to_country', settings.clipToCountry);
        }

        if (settings.enableClipToBoundingBox) {
          const bbox = [
            settings.clipToBoundingBoxNeLat,
            settings.clipToBoundingBoxNeLng,
            settings.clipToBoundingBoxSwLat,
            settings.clipToBoundingBoxSwLng,
          ]
            .filter(Boolean)
            .join(',');
          if (bbox.split(',').length === 4) {
            w3wComponent.setAttribute('clip_to_bounding_box', bbox);
          }
        }

        if (settings.enableClipToCircle) {
          const circle = [
            settings.clipToCircleLat,
            settings.clipToCircleLng,
            settings.clipToCircleRadius,
          ]
            .filter(Boolean)
            .join(',');
          if (circle.split(',').length === 3) {
            w3wComponent.setAttribute('clip_to_circle', circle);
          }
        }

        // Wrap the input element (same pattern as original attachComponentToTargets)
        const originalParent = input.parentNode;
        w3wComponent.appendChild(input);
        originalParent.prepend(w3wComponent);

        componentRef.current = w3wComponent;

        // Listen for selection events
        const handleSelected = event => {
          const words = event.detail.suggestion.words;
          const value = `///${words}`;
          setWhat3words(value);

          // Update extension data
          setExtensionData('what3words-autosuggest-blocks', fieldId, value);

          // If using shipping as billing and this is shipping, also update billing
          if (useShippingAsBilling && addressType === 'shipping') {
            setExtensionData(
              'what3words-autosuggest-blocks',
              'w3w-billing',
              value
            );
          }
        };

        w3wComponent.addEventListener('selected_suggestion', handleSelected);

        // Cleanup
        return () => {
          if (w3wComponent && handleSelected) {
            w3wComponent.removeEventListener(
              'selected_suggestion',
              handleSelected
            );
          }
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize what3words component:', error);
      }
    };

    // Small delay to ensure input is fully rendered
    const timeoutId = setTimeout(() => {
      initComponent();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputRef, fieldId, setExtensionData, useShippingAsBilling, addressType]);

  // Update clip to country based on address
  useEffect(() => {
    if (!componentRef.current) return;

    const country =
      addressType === 'billing' ? billingCountry : shippingCountry;

    // If using shipping as billing, billing should follow shipping country
    const effectiveCountry =
      addressType === 'billing' && useShippingAsBilling
        ? shippingCountry
        : country;

    if (effectiveCountry) {
      componentRef.current.setAttribute('clip_to_country', effectiveCountry);
    }
  }, [billingCountry, shippingCountry, useShippingAsBilling, addressType]);

  // Update extension data when value changes
  useEffect(() => {
    setExtensionData('what3words-autosuggest-blocks', fieldId, what3words);

    // If using shipping as billing and this is shipping, also update billing
    if (useShippingAsBilling && addressType === 'shipping') {
      setExtensionData(
        'what3words-autosuggest-blocks',
        'w3w-billing',
        what3words
      );
    }
  }, [
    what3words,
    fieldId,
    setExtensionData,
    useShippingAsBilling,
    addressType,
  ]);

  const onInputChange = useCallback(
    value => {
      setWhat3words(value);
    },
    [setWhat3words]
  );

  const label = settings.enableLabel
    ? settings.label
    : __('what3words Address', 'what3words-autosuggest-blocks');

  const placeholder = settings.enablePlaceholder ? settings.placeholder : '';

  return (
    <div className={`what3words-checkout-block ${addressType}`}>
      <ValidatedTextInput
        id={fieldId}
        type="text"
        required={false}
        className={`w3w-${addressType}`}
        label={label}
        placeholder={placeholder}
        value={what3words}
        onChange={onInputChange}
        customValidation={() => true}
        ref={inputRef}
      />
    </div>
  );
};

const Block =
  addressType =>
  ({ checkoutExtensionData }) => {
    return (
      <BlockComponent
        addressType={addressType}
        checkoutExtensionData={checkoutExtensionData}
      />
    );
  };

const createCheckoutBlock = addressType => ({
  metadata: {
    ...metadata,
    name: `what3words/${addressType}-address-block`,
    parent: [`woocommerce/checkout-${addressType}-address-block`],
  },
  component: Block(addressType),
});

['shipping', 'billing'].forEach(addressType => {
  registerCheckoutBlock(createCheckoutBlock(addressType));
});
