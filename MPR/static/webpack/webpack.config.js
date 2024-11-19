const path = require("path");
const { experiments } = require("webpack");
const basePath = __dirname;
const distPath = 'dist';

module.exports = {
    mode:'development',
    
    entry: {
        app: './src/index.js'
    },

    module: {
        rules:[
            {
                test: /\.js/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            }
        ]
    },

    output: {
        path: path.join(basePath, distPath),
        filename: 'bundle.js'
    },

    resolve: {
        fallback: {
            fs: require.resolve('browserify-fs'),
            path: require.resolve('path-browserify'),
            buffer: require.resolve('buffer/'),
            stream: require.resolve('stream-browserify'),
            util: require.resolve('util/'),
        },
    },

    stats: {
        errorDetails: true,
    },
};