/**
 * @see https://github.com/WordPress/gutenberg/blob/master/packages/scripts/config/webpack.config.js
 */
const config = require('@wordpress/scripts/config/webpack.config')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
	...config,
	entry: {
		index: './src/index.js',
		init: './src/init.js',
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
	...(!isProduction ? {
		devServer: {
			...config.devServer,
			/** Fix `[webpack-dev-server] Invalid Host/Origin header` error with `wp-scripts start --hot` */
			allowedHosts: 'all',
		},
	} : {}),
}
