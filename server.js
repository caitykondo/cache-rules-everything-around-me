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


client.set('1', '1st');


app.use('/slow', slow);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  process.stdout.write(`server listening on port ${PORT}`);
});