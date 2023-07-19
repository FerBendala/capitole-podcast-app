require( 'dotenv' ).config()
const path = require( 'path' )
const webpack = require( 'webpack' )
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' )
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' )
const CopyWebpackPlugin = require( 'copy-webpack-plugin' )

const config = ( env, argv ) => {
    const production = argv.mode === 'production'
    const backend_url = production
        ? process.env.BACKEND_URL_PROD
        : process.env.BACKEND_URL_DEV

    return {
        entry: {
            main: './src/index.js',
        },
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
            new webpack.DefinePlugin( {
                BACKEND_URL: JSON.stringify( backend_url ),
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
            production &&
            new MiniCssExtractPlugin( {
                filename: production
                    ? 'css/[name].[contenthash].css'
                    : 'css/[name].css',
            } )
        ].filter( Boolean ),
        devtool: production ? false : 'source-map',
        devServer: {
            static: {
                directory: path.join( __dirname, 'build' ),
            },
            compress: true,
            port: 3000,
            historyApiFallback: true
        },
        module: {
            rules: [
                {
                    test: /\.(js|ts)x?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                            },
                        },
                    ],
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
                        publicPath: '/',
                    },
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    exclude: /node_modules/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/fonts/[name][ext]',
                        publicPath: '/',
                    },
                },
            ],
        },
        resolve: {
            extensions: ['.js', '.jsx'],
        },
    }
}

module.exports = config