var express = require('express');
var router = express.Router();
var data = require('../data/data');

router.get('/', function(req, res) {
    res.render('home')
});

router.get('/getCategories', function(req, res){
    res.json(getCategories());
})

router.get('/getProducts/:id', function(req, res, next) {
    let id = req.params.id.replace(':', '');

    if(data.categories.map(category => category.id).includes(id)) {
        let products = getProducts(id);
        res.json(products);
    }

    else next('route');

});

function getCategories() {

    let categories = data.categories.map(category => ({
        name: category.name.replace('_', ' '),
        id : category.id
    }))
    return categories;
};

function getProducts(id) {
    let products;

    data.categories.forEach(category => {
        if(category.id === id){
            products = category.products;
        } 
    });
    return (products);
};

module.exports = router;