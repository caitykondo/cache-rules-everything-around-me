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

function checkCache(req, res,next) {
  client.get(req.originalUrl, (err, reply) =>{
    if(reply !== null){
      console.log('found in cache');
      res.send(reply);
    }else{
      next();
    }
  });
}

function countViews(req, res, next) {
  client.get(`${req.originalUrl}_counter`, (err, reply) => {
    if(`${req.originalUrl}_counter` !== null){
      client.incr(`${req.originalUrl}_counter`);
    }else{
      client.set(`${req.originalUrl}_counter`, 1);
    }
  });
  next();
}

app.use(countViews);
app.use(checkCache);

app.use('/slow', slow);

app.get('/', (req, res) => {
  res.render('index', (err, html) => {
    console.log('setting to cache');
    client.set(req.originalUrl, html);
  });
});

app.listen(PORT, () => {
  process.stdout.write(`server listening on port ${PORT}`);
});