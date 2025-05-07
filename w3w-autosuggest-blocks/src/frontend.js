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
	const { useShippingAsBilling } = useSelect( ( select ) => ( {
		useShippingAsBilling:
			select( CHECKOUT_STORE_KEY ).getUseShippingAsBilling(),
	} ) );

	const { __internalSetUseShippingAsBilling } =
		useDispatch( CHECKOUT_STORE_KEY );

	return {
		useShippingAsBilling,
		setUseShippingAsBilling: __internalSetUseShippingAsBilling,
	};
};

const BlockComponent = ( { checkoutExtensionData, addressType } ) => {
	const fieldId = `w3w-${ addressType }`;
	const [ address, setAddress ] = useState( '' );
	const [ container, setContainer ] = useState( null );
	const { useShippingAsBilling } = useCheckoutAddress();
	const { setExtensionData } = checkoutExtensionData;

	useEffect( () => {
		const targetContainer = document.getElementById( addressType );
		if ( targetContainer ) {
			setContainer( targetContainer );
		}
	}, [ addressType ] );

	useEffect( () => {
		document.body.dispatchEvent( new Event( 'updated_checkout' ) );
	}, [ useShippingAsBilling ] );

	useEffect( () => {
		setExtensionData( 'what3words-autosuggest-blocks', fieldId, address );
		if ( useShippingAsBilling ) {
			setExtensionData(
				'what3words-autosuggest-blocks',
				'w3w-billing',
				address
			);
		}
	}, [ useShippingAsBilling, address, fieldId, setExtensionData ] );

	const onInputChange = useCallback(
		( value ) => {
			setAddress( value );
			setExtensionData( 'what3words-autosuggest-blocks', fieldId, value );
			if ( useShippingAsBilling ) {
				setExtensionData(
					'what3words-autosuggest-blocks',
					'w3w-billing',
					value
				);
			}
		},
		[ setAddress, setExtensionData, useShippingAsBilling, fieldId ]
	);

	if ( ! container ) {
		return <></>;
	}
	return createPortal(
		<ValidatedTextInput
			id={ fieldId }
			type="text"
			required={ false }
			className={ `w3w-${ addressType }` }
			label={ __(
				'what3words Address',
				'what3words-autosuggest-blocks'
			) }
			value={ address }
			onChange={ onInputChange }
		/>,
		container
	);
};

const Block =
	( addressType ) =>
	( { checkoutExtensionData } ) => {
		return (
			<BlockComponent
				addressType={ addressType }
				checkoutExtensionData={ checkoutExtensionData }
			/>
		);
	};

const shipping = {
	metadata: {
		...metadata,
		name: 'what3words/shipping-address-block',
		parent: [ 'woocommerce/checkout-shipping-address-block' ],
	},
	component: Block( 'shipping' ),
};

const billing = {
	metadata: {
		...metadata,
		name: 'what3words/billing-address-block',
		parent: [ 'woocommerce/checkout-billing-address-block' ],
	},
	component: Block( 'billing' ),
};

registerCheckoutBlock( shipping );
registerCheckoutBlock( billing );

setTimeout( () => {
	document.body.dispatchEvent( new Event( 'init_checkout' ) );
}, 1000 );
