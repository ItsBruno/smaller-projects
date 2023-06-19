let data = require('../data/data');
let express = require('express');
let router = express.Router()

router.get('/', function(req, res) {
    res.render('cart', {
        current_category: 'Cart'
    });
});

router.post('/add/:id', function(req, res) {

    if(req.session.cart === undefined) {
        req.session.cart = {};
    };
    product = req.params.id.replace(':', '');

    let inStorage = false;
    if(req.session.cart[product] === undefined){

        //check if the item is valid
        for(category of data.categories){
            for(present_product of category.products) {
                if(product === present_product.name) {
                    inStorage = true;
                    break;
                }
            }
            if(inStorage) break;
        } 
        if(inStorage) {
            req.session.cart[product] = 1;
        }
        else {
            res.status(405);
            res.send({});
        }
    }
    else {
        req.session.cart[product] = req.session.cart[product] + 1
    }
    console.log(`${product}: ${req.session.cart[product]}`);
    res.send({});
});

router.post('/remove/:id', function(req, res) {
    if(req.session.cart === undefined) {
        res.status(405);
    }
    else {
        product = req.params.id.replace(':', '');
        if(req.session.cart[product] === undefined){
            res.status(405);
        }
        else{
            req.session.cart[product] = req.session.cart[product] - 1
            if(req.session.cart[product] === 0) delete req.session.cart[product];
            console.log(`${product}: ${req.session.cart[product]}`);
            res.send({});
        }
    }
});

router.get('/getAll', function(req, res) {
    if(req.session.cart) res.json(req.session.cart);
    else res.json({});
});

module.exports = router;