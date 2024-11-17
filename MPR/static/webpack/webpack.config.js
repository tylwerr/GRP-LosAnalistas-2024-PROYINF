const path = require("path");
const basePath = __dirname;
const distPath = 'dist';

module.exports = {
    mode:'development',
    
    entry: {
        app: './src/index.js'
    },

    experiments: { 
        asyncWebAssembly: true
    },

    module: {
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.wasm$/,
                type: 'webassembly/async',
            },
        ],
    },

    output: {
        path: path.join(basePath, distPath),
        filename: 'bundle.js'
    },
    

    resolve: {
        alias: {
            "@cornerstonejs/tools": "@cornerstonejs/tools/dist/umd/index.js"
        },

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
