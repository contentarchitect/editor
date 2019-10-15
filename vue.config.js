module.exports = {
	configureWebpack (config) {
		if (process.env.BUILD_LIB === "blocks") {
			config.externals = {
				"@contentarchitect/editor": "ContentArchitect"
			}

			config.output.filename = 'ContentArchitect.Blocks.js'
		}
	},
	css: {
		extract: false
	},
	chainWebpack: config => {
		console.log(process)

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
	},
	// css: {
	// 	modules: true,
	// }
};