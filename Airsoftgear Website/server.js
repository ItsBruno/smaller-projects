const PORT = 3000;

const express = require('express');
const path = require('path');
const session = require('express-session');
const MemoryStore = require('memorystore')(session)

const home_router = require('./routes/home.routes');
const cart_router = require('./routes/cart.routes');

const app = express();

app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: '7eUxigP5QVOZaNQuEBL45XvkiYWgOOKF',
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
        maxAge: (1000 * 60 * 60 * 24),
        httpOnly: false,
        secure: false
    }
}));

app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res){
    res.redirect('/home');
});
app.use('/home', home_router);
app.use('/cart', cart_router);

app.listen(PORT, () => {
    console.log(`Server up and listening on port ${PORT}`);
});