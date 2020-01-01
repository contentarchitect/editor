const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	configureWebpack (config) {
		config.externals = config.externals || [];

		if (process.env.NODE_ENV === 'production') {
			config.externals.push({
				"@contentarchitect/core": "CaCore"
			})
		}
	},
	css: {
		extract: false
	},
	chainWebpack: config => {
		const svgRule = config.module.rule("svg");
		svgRule.uses.clear();

		svgRule
			.use('vue-svg-loader')
			.loader('vue-svg-loader');
		
		if (process.env.NODE_ENV === "production") {
			process.env.VUE_CLI_CSS_SHADOW_MODE = true
		}

		config.module
			.rule('vue')
			.use('vue-loader')
				.loader('vue-loader')
				.tap(options => {
					options.shadowMode = true
					return options
				})

		if (process.env.NODE_ENV === "development") {
			config.module
				.rule('css')
				.oneOf('vue')
				.use('vue-style-loader')
					.tap(options => {
						options.shadowMode = true
						return options
					})
	
			config.module
				.rule('scss')
				.oneOf('vue')
				.use('vue-style-loader')
					.tap(options => {
						options.shadowMode = true
						return options
					})
		}

		if (process.env.NODE_ENV === "production") {
			config.module
				.rule('css')
				.exclude
				.add(/\.extract\.css$/)

			config.module
				.rule('extract-css')
				.test(/\.extract\.css$/)
				.use("mini-css-extract-plugin")
					.loader(MiniCssExtractPlugin.loader)
					.end()
				.use("css-loader")
					.loader("css-loader")
					.end()
				.use("postcss-loader")
					.loader("postcss-loader")
					.end()

			config.plugin('extract-css')
				.use(MiniCssExtractPlugin, [{
					allChunks: true
				}])
		}
	},
	// css: {
	// 	modules: true,
	// }
};