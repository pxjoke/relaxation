module.exports = {
    context: __dirname + "/app/src",
    entry: "./app",
    output: {
        path: __dirname + "/app/dist",
        filename: "bundle.js"
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    }
};
