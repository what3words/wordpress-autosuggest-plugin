import metadata from './block.json';
import {
  ValidatedTextInput,
  registerCheckoutBlock,
} from '@woocommerce/blocks-checkout';
import { __ } from '@wordpress/i18n';
import {
  createPortal,
  useEffect,
  useState,
  useCallback,
} from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { CHECKOUT_STORE_KEY } from '@woocommerce/block-data';

import './frontend.scss';

// This is a workaround to get the useShippingAsBilling value
export const useCheckoutAddress = () => {
  const { useShippingAsBilling } = useSelect(select => ({
    useShippingAsBilling: select(CHECKOUT_STORE_KEY).getUseShippingAsBilling(),
  }));

  const { __internalSetUseShippingAsBilling } = useDispatch(CHECKOUT_STORE_KEY);

  return {
    useShippingAsBilling,
    setUseShippingAsBilling: __internalSetUseShippingAsBilling,
  };
};

const BlockComponent = ({ checkoutExtensionData, addressType }) => {
  const fieldId = `w3w-${addressType}`;
  const [what3words, setWhat3words] = useState('');
  const [inputFieldContainer, setInputFieldContainer] = useState(null);
  const { useShippingAsBilling } = useCheckoutAddress();
  const { setExtensionData } = checkoutExtensionData;

  useEffect(() => {
    const targetContainer = document.getElementById(addressType);
    if (targetContainer) {
      setInputFieldContainer(targetContainer);
    }
  }, [addressType]);

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

    inputFieldContainer?.addEventListener(
      'selected_suggestion',
      handleSelectedSuggestion
    );

    return () => {
      inputFieldContainer?.removeEventListener(
        'selected_suggestion',
        handleSelectedSuggestion
      );
    };
  }, [inputFieldContainer, setExtensionData, useShippingAsBilling, fieldId]);

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

  if (!inputFieldContainer) {
    return <></>;
  }
  return createPortal(
    <ValidatedTextInput
      id={fieldId}
      type="text"
      required={false}
      className={`w3w-${addressType}`}
      label={__('what3words Address', 'what3words-autosuggest-blocks')}
      value={what3words}
      onChange={onInputChange}
    />,
    inputFieldContainer
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

setTimeout(() => {
  document.body.dispatchEvent(new Event('init_checkout'));
}, 1000);
