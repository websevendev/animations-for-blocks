/**
 * @see https://github.com/WordPress/gutenberg/blob/master/packages/scripts/config/webpack.config.js
 */
const config = require('@wordpress/scripts/config/webpack.config')

module.exports = {
	...config,
	entry: {
		index: './src/index.js',
		init: './src/init.js',
		editor: './src/editor.js',
	},
	optimization: {
		...config.optimization,
		splitChunks: {
			...config.optimization.splitChunks,
			minSize: 0,
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
}
