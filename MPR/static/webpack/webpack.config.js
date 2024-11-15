const path = require("path");
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
};