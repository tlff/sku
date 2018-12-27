const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const PATH = require('path');
const dist = PATH.resolve(__dirname, './dist/');

module.exports = function (env, argv) {
    const DEVSERVER = argv.ishot ? {
        contentBase: PATH.join(__dirname, "src", 'view'),
        // hot: true,
        watchContentBase: true,
        openPage: "./view/index.html",
        publicPath: "http://localhost:8080/",
        compress: false,
        host: 'localhost',
        port: 8080,
        proxy: {
            '/api': {
                target: 'http://localhost/webpackconfig/',
                changeOrigin: true,
                secure: false,
                pathRewrite: { "^/api": "" }
            }
        }
    } : {};
    const PLUGINS = (function () {
        var plugins = [];
        plugins.push(new CleanWebpackPlugin(dist));
        plugins.push(new VueLoaderPlugin());
        plugins.push(new MiniCssExtractPlugin({ filename: 'css/[name].css' }));
        plugins.push(new webpack.ProvidePlugin({
            "_": 'lodash',
            "$":'jquery',
            "jQuery":'jquery',
            "window.jQuery":'jquery',
            "window.$":'jquery'
        }));
        plugins.push(new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env)
        }));

        if (argv.ishot) {
            plugins.push(new webpack.NamedModulesPlugin());
            plugins.push(new webpack.HotModuleReplacementPlugin());
        }
        plugins.push(
            new HtmlWebpackPlugin({
                filename: 'view/index.html',
                template: './src/view/index.html',
                chunks: ['app']
            })
        )
        var buildPlugins = [
            new UglifyJSPlugin({
                parallel: true,
                cache: true,
                extractComments: true
            }),
            new webpack.optimize.SplitChunksPlugin({
                chunks: "initial",
                "minSize": 20000,
                "minChunks": 2,
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendor",
                        enforce: true,
                        priority: 10
                    }
                }
            }),
            new webpack.optimize.RuntimeChunkPlugin({
                name: 'manifest'
            }),
            // new BundleAnalyzerPlugin()
        ]
        return env == 'production' ? plugins.concat(buildPlugins) : plugins;
    })()
    const DEVTOOL = (() => { return env == 'production' ? '' : 'eval-source-map' })();
    const MODE = (() => { return env; })();

    return {
        entry: {
            app: './src/js/index.js'
        },
        output: {
            filename: 'js/[name].js',
            path: dist
        },
        externals: {
            // jquery: 'jQuery'
        },
        resolve: {
            alias: {
                'vue': 'vue/dist/vue.esm.js'
            }
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',

                    options: {
                        presets: ['env']
                    }
                },
                {
                    test: /\.vue$/,
                    exclude: /node_modules/,
                    loader: 'vue-loader',
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'images/[name].[ext]',
                            // outputPath: "images/",
                            // publicPath: "themes/default/view/images"
                        }
                    }]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    loader: 'file-loader',
                    options: {
                        name: "font/[name].[ext]",
                        // outputPath: "font/"
                    }
                },
                {
                    test: /\.(scss|less|css)$/,

                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: 'css-loader',

                            options: {
                                sourceMap: true,
                            }
                        },
                        {
                            loader: 'less-loader',

                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                }
            ]
        },
        plugins: PLUGINS,
        devServer: DEVSERVER,
        devtool: DEVTOOL,
        mode: MODE,
        // stats: {
        //     colors: true,
        //     chunks: false,
        //     chunkOrigins: false,
        //     chunkModules: false,
        //     children: false,
        //     cachedAssets: false,
        //     assets: false,
        //     entrypoints: false
        // },
        stats: "minimal"
    }
}