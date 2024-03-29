express = require('express');
path = require('path');

let app = express();
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'html');

require('./app/routes')(app)

let port = process.env.PORT || 5000;
app.listen(port);
console.log('App is running on port ' + port);
module.exports = app;
