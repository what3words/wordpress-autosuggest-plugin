import './order-confirmed.scss';

const scriptTag = document.currentScript;
const scriptUrl = new URL( scriptTag.src );
const urlParams = new URLSearchParams( scriptUrl.search );

function append3WA( addressType ) {
	const address = urlParams.get( `what3words_${ addressType }_address` );
	if ( ! address ) {
		return;
	}
	const addressBlock = document.querySelector(
		`.wc-block-order-confirmation-${ addressType }-address`
	);
	if ( addressBlock ) {
		const addressElement = addressBlock.querySelector( 'address' );
		addressElement.innerHTML += `<br><span class="what3words-prefix">///</span>${ address }`;
	}
}

append3WA( 'billing' );
append3WA( 'shipping' );
