const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const { slow } = require('./routes');
const app = express();
const PORT = 8080;
const redis = require('redis');

const client = redis.createClient();

client.on('connect', ()=>{
  console.log('\nconnected client to redis');
});


app.engine('.hbs', handlebars({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

app.use(bodyParser.json());
// server.use(creamCache.init()); /* student implements this */

function checkCache(req, res, next) {
  console.log('checking cache');
  let path = req.route.path;
  client.get(req.route.path, (err, reply) =>{
    if(reply !== null){
      console.log('found in cache');
      res.send(reply);
    }else{
      next();
      // render the page and store in cache
    }

  });
}

app.use('/slow', slow);

app.get('/', checkCache, (req, res) => {
  res.render('index', (err, html) => {
    console.log('setting to cache');
    client.set(req.route.path, html);
  });
});

app.listen(PORT, () => {
  process.stdout.write(`server listening on port ${PORT}`);
});