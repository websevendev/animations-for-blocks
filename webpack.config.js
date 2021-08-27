/**
 * @see https://github.com/WordPress/gutenberg/blob/master/packages/scripts/config/webpack.config.js
 */
const config = require('@wordpress/scripts/config/webpack.config');

module.exports = {
	...config,
	output: {
		...config.output,
		jsonpFunction: 'anfbJsonp',
	},
	optimization: {
		...config.optimization,
		splitChunks: {
			...config.optimization.splitChunks,
			cacheGroups: {
				...config.optimization.splitChunks.cacheGroups,
				aos: {
					test: /[\\/]node_modules[\\/]aos[\\/]/,
					name: 'aos',
					chunks: 'all',
				},
			},
		},
	},
};
