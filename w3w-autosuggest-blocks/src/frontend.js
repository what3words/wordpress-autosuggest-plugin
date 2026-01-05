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

// Generic polling function that waits for a condition to be met
const waitFor = (checkFn, options = {}) => {
  const {
    maxAttempts = 50,
    interval = 100,
    rejectOnTimeout = false,
    errorMessage = 'Condition not met within timeout',
  } = options;

  return new Promise((resolve, reject) => {
    // Check immediately first
    const initialResult = checkFn();
    if (initialResult) {
      resolve(initialResult);
      return;
    }

    // Poll until condition is met or max attempts reached
    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      const pollResult = checkFn();
      if (pollResult) {
        clearInterval(checkInterval);
        resolve(pollResult);
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        if (rejectOnTimeout) {
          reject(new Error(errorMessage));
        } else {
          resolve(null);
        }
      }
    }, interval);
  });
};

const waitForComponentLoad = () => {
  return waitFor(isComponentLoaded, {
    maxAttempts: 50,
    rejectOnTimeout: true,
    errorMessage: 'what3words component failed to load',
  });
};

const BlockComponent = ({ checkoutExtensionData, addressType }) => {
  const fieldId = `w3w-${addressType}`;
  const [what3words, setWhat3words] = useState('');
  const inputRef = useRef(null);
  const [component, setComponent] = useState(null);
  const { setExtensionData } = checkoutExtensionData;

  const useShippingAsBilling = useSelect(select => {
    const store = select(CHECKOUT_STORE_KEY);
    return store.getUseShippingAsBilling
      ? store.getUseShippingAsBilling()
      : false;
  });

  // Track country values from DOM (more reliable than store methods)
  const [billingCountry, setBillingCountry] = useState('');
  const [shippingCountry, setShippingCountry] = useState('');

  const getW3WComponent = useCallback(() => {
    const input = inputRef.current;
    if (!input?.inputRef?.current) return null;
    const inputElement = input.inputRef.current;
    const w3wComponent = inputElement.closest('what3words-autosuggest');
    if (w3wComponent) {
      return w3wComponent;
    }
    const fieldElement = document.getElementById(fieldId);
    if (fieldElement) {
      const fallbackComponent = fieldElement.closest('what3words-autosuggest');
      if (fallbackComponent) {
        return fallbackComponent;
      }
    }
    return null;
  }, [fieldId]);

  // Helper to wait for component creation
  const waitForComponentCreation = useCallback(() => {
    return waitFor(getW3WComponent, {
      maxAttempts: 30,
      rejectOnTimeout: false,
    });
  }, [getW3WComponent]);

  useEffect(() => {
    const findCountryField = type => {
      const escapedType = type.replaceAll(
        /[.*+?^${}()|[\]\\]/g,
        String.raw`\$&`
      );
      const pattern = new RegExp(
        String.raw`(${escapedType}[\-_]?country|country[\-_]?${escapedType})`,
        'i'
      );

      const allFields = document.querySelectorAll('[id]');
      for (const field of allFields) {
        if (pattern.test(field.id)) {
          return field;
        }
      }

      const allNamedFields = document.querySelectorAll('[name]');
      for (const field of allNamedFields) {
        if (pattern.test(field.name)) {
          return field;
        }
      }

      return null;
    };

    const getCountryFromField = field => {
      if (!field) return '';
      if (field.tagName === 'SELECT') {
        return field.value || '';
      }
      if (field.type === 'hidden') {
        return field.value || '';
      }
      return '';
    };

    const updateCountries = () => {
      const billingField = findCountryField('billing');
      const shippingField = findCountryField('shipping');

      const billing = getCountryFromField(billingField);
      const shipping = getCountryFromField(shippingField);

      setBillingCountry(billing);
      setShippingCountry(shipping);
    };

    // Initial update
    updateCountries();

    // Listen for country changes
    const billingField = findCountryField('billing');
    const shippingField = findCountryField('shipping');

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

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const initComponent = async () => {
      await waitForComponentLoad();
      setComponent(await waitForComponentCreation());

      const handleSelectedSuggestion = event => {
        const suggestion = event.detail.suggestion.words;
        setWhat3words(`///${suggestion}`);
        setExtensionData(
          'what3words-autosuggest-blocks',
          fieldId,
          `///${suggestion}`
        );
        if (useShippingAsBilling) {
          setExtensionData(
            'what3words-autosuggest-blocks',
            'w3w-billing',
            `///${suggestion}`
          );
        }
      };

      input.inputRef.current.addEventListener(
        'selected_suggestion',
        handleSelectedSuggestion
      );

      return () => {
        input.inputRef.current.removeEventListener(
          'selected_suggestion',
          handleSelectedSuggestion
        );
      };
    };

    if (!settings.api_key) {
      // eslint-disable-next-line no-console
      console.error('what3words API key not configured');
      return;
    }
    initComponent();
    const timeoutId = setTimeout(() => {
      document.body.dispatchEvent(new Event('init_checkout'));
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [
    addressType,
    fieldId,
    inputRef,
    setExtensionData,
    useShippingAsBilling,
    getW3WComponent,
    waitForComponentCreation,
  ]);

  useEffect(() => {
    document.body.dispatchEvent(new Event('updated_checkout'));
  }, [useShippingAsBilling]);

  useEffect(() => {
    setExtensionData('what3words-autosuggest-blocks', fieldId, what3words);
    if (useShippingAsBilling) {
      setExtensionData(
        'what3words-autosuggest-blocks',
        'w3w-billing',
        what3words
      );
    }
  }, [useShippingAsBilling, what3words, fieldId, setExtensionData]);

  useEffect(() => {
    if (!component) return;

    const country =
      addressType === 'billing' ? billingCountry : shippingCountry;

    // If using shipping as billing, billing should follow shipping country
    const effectiveCountry =
      addressType === 'billing' && useShippingAsBilling
        ? shippingCountry
        : country;

    if (!effectiveCountry) return;

    if (settings.enable_clip_to_country) return;

    // Set the attribute if component is found
    component.setAttribute('clip_to_country', effectiveCountry);
  }, [
    billingCountry,
    shippingCountry,
    useShippingAsBilling,
    addressType,
    component,
  ]);

  const onInputChange = useCallback(
    value => {
      setWhat3words(value);
      setExtensionData('what3words-autosuggest-blocks', fieldId, value);
      if (useShippingAsBilling) {
        setExtensionData('what3words-autosuggest-blocks', 'w3w-billing', value);
      }
    },
    [setWhat3words, setExtensionData, useShippingAsBilling, fieldId]
  );

  const label = settings.enable_label
    ? settings.label
    : __('what3words Address', 'what3words-autosuggest-blocks');

  const placeholder = settings.enable_placeholder ? settings.placeholder : '';

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
