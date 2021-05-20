const express = require('express');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;
const routes = require('./routes/routes');
const newLine = require('./helpers/newLine');

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 600000 }
}));

app.set('view engine', 'ejs');
app.locals.newLine = newLine;
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);

app.listen(PORT, () => console.log('listening to', PORT));