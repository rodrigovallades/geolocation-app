var path = require('path');

module.exports  = function(app) {

    // enable HTML5MODE
    app.all('/*', function(req, res) {
        res.sendFile(path.resolve('public/index.html'));
    });
};