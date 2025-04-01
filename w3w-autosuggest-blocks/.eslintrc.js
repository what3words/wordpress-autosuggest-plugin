module.exports = {
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
	settings: {
		'import/resolver': {
			node: {
				extensions: [ '.js', '.jsx' ],
			},
		},
	},
	rules: {
		'import/no-unresolved': [
			'error',
			{
				ignore: [
					'^@woocommerce/blocks-checkout$',
					'^@woocommerce/block-data$',
					'^@wordpress/',
				],
			},
		],
	},
};
