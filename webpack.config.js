/*
module.exports = (process.env.NODE_ENV === 'production') ?
                 (require('./config/webpack.prod')) :
                 (require('./config/webpack.dev'));*/

module.exports = require('./config/webpack.prod');
