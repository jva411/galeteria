const withLess = require('next-with-less');

module.exports = withLess({
    cssModules: true,
    lessLoaderOptions: {
        lessOptions: {
            javascriptEnabled: true,
            importLoaders: 0
        }
    }
})