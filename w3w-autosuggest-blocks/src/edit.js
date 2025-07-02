import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';

const shipping = {
  ...metadata,
  name: 'what3words/shipping-address-block',
  parent: ['woocommerce/checkout-shipping-address-block'],
};
registerBlockType(shipping, {
  edit: () => <></>, // Best not to show the block on edit mode, as it will be shown in the frontend
});

const billing = {
  ...metadata,
  name: 'what3words/billing-address-block',
  parent: ['woocommerce/checkout-billing-address-block'],
};
registerBlockType(billing, {
  edit: () => <></>, // Best not to show the block on edit mode, as it will be shown in the frontend
});
