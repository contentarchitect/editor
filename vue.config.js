module.exports = {
	// configureWebpack: {
	//     resolve: {
	//         symlinks: false
	//     },
	// },
	chainWebpack: config => {
		const svgRule = config.module.rule("svg");
		svgRule.uses.clear();

		svgRule
			.use('vue-svg-loader')
			.loader('vue-svg-loader');


		config.module
			.rule('vue')
			.use('vue-loader')
				.loader('vue-loader')
				.tap(options => {
					options.shadowMode = true
					return options
				})

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
	},
	// css: {
	// 	modules: true,
	// }
};