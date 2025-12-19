import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

// Editor placeholder component
const Edit = () => {
  return (
    <div
      style={{
        padding: '12px',
        border: '1px dashed #ccc',
        borderRadius: '4px',
        backgroundColor: '#f8f9fa',
        color: '#666',
        fontSize: '12px',
      }}
    >
      <strong>
        {__('what3words Autosuggest', 'what3words-autosuggest-blocks')}
      </strong>
      <p style={{ margin: '4px 0 0 0', fontSize: '11px' }}>
        {__(
          'This field will appear on the checkout page',
          'what3words-autosuggest-blocks'
        )}
      </p>
    </div>
  );
};

// Register shipping address block
const shippingMetadata = {
  ...metadata,
  name: 'what3words/shipping-address-block',
  parent: ['woocommerce/checkout-shipping-address-block'],
};

registerBlockType(shippingMetadata, {
  edit: Edit,
});

// Register billing address block
const billingMetadata = {
  ...metadata,
  name: 'what3words/billing-address-block',
  parent: ['woocommerce/checkout-billing-address-block'],
};

registerBlockType(billingMetadata, {
  edit: Edit,
});
