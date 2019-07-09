module.exports = {
    configureWebpack: {
        // output: {
        //     libraryExport: 'default'
        // },
        resolve: {
            symlinks: false
        }
    },
    chainWebpack: config => {
        const svgRule = config.module.rule("svg");
        svgRule.uses.clear();

        svgRule
            .test(/\.svg$/)
            .use("html-loader")
                .loader("html-loader")
                .options({ minimize: true });
    }
};