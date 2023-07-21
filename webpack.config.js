const path = require( 'path' )
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' )
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' )
const CopyWebpackPlugin = require( 'copy-webpack-plugin' )

const config = ( env, argv ) => {
    const production = argv.mode === 'production'

    return {
        entry: './src/index.js',
        output: {
            publicPath: production ? './' : '/',
            filename: production
                ? 'js/[name].[contenthash].js'
                : 'js/[name].js',
            chunkFilename: production
                ? 'js/[name].[contenthash].js'
                : 'js/[name].js',
            path: path.resolve( __dirname, 'build' ),
        },
        devtool: production ? false : 'inline-source-map',
        devServer: {
            static: {
                directory: path.join( __dirname, 'build' ),
            },
            compress: true,
            port: 3000,
            historyApiFallback: true
        },
        plugins: [
            new HtmlWebpackPlugin( {
                template: path.join(
                    __dirname,
                    'public',
                    'index.html'
                ),
                favicon: path.join(
                    __dirname,
                    'public',
                    'favicon.png'
                ),
                minify: production,
            } ),
            production && new MiniCssExtractPlugin( {
                filename: 'css/[name].[contenthash].css'
            } ),
            new CopyWebpackPlugin( {
                patterns: [
                    {
                        from: './src/assets',
                        globOptions: {
                            ignore: [
                                '**/css/**',
                                '**/js/**',
                                '**/src/**',
                            ],
                        },
                        noErrorOnMissing: true,
                    },
                ],
            } ),
            production && new CleanWebpackPlugin(),
        ].filter( Boolean ),
        module: {
            rules: [
                {
                    test: /\.(js|ts)x?$/,
                    exclude: /node_modules/,
                    use: ['babel-loader'],
                },
                {
                    test: /\.css$/,
                    use: [
                        production
                            ? MiniCssExtractPlugin.loader
                            : 'style-loader',
                        'css-loader',
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        production
                            ? MiniCssExtractPlugin.loader
                            : 'style-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(svg|png|jpe?g|gif|ico)$/i,
                    exclude: /node_modules/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/images/[name][ext]',
                        publicPath: production ? './' : '/',
                    },
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    exclude: /node_modules/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/fonts/[name][ext]',
                        publicPath: production ? './' : '/',
                    },
                },
            ],
        },
        resolve: {
            extensions: ['*', '.js', '.jsx'],
        },
        performance: {
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        }
    }
}

module.exports = config