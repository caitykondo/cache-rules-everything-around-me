const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');

const { slow } = require('./routes');

const app = express();
const PORT = 8080;

const redis = require('redis');
client = redis.createClient();

const cache = require('express-redis-cache')({client: client, expire: 60});

app.engine('.hbs', handlebars({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

app.use(bodyParser.json());

// server.use(creamCache.init()); /* student implements this */

app.use('/slow', cache.route(), slow);
app.use('/api', cache.route(), slow);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/:key', cache.route(), (req, res) => {
  res.send(req.params.key);
});


if(!module.parent){
  app.listen(PORT, () => {
    process.stdout.write(`server listening on port ${PORT}`);
  });
}

module.exports = app;