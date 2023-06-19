import { update_total_counter } from "./update_home_contents.js";
import { getCart, addToCart, removeFromCart } from "./api_connection.mjs";

let cart_items;

export async function display_cart_dynamic() {
    document.getElementById('current-category').innerHTML = 'Košarica';
    cart_items = await getCart();
    cart_items = new Map(Object.entries(cart_items));
    update_cart_display();
    update_total_counter(cart_items);
}

async function add_to_cart(evt) {
    //post to server
    await addToCart(evt.currentTarget.id);
    //get cart from server
    cart_items = await getCart();
    cart_items = new Map(Object.entries(cart_items));
    update_cart_display()
}

async function remove_from_cart(evt) {
    await removeFromCart(evt.currentTarget.id);
    cart_items = await getCart();
    cart_items = new Map(Object.entries(cart_items));
    update_cart_display()
}

function update_cart_display() {
    update_total_counter(cart_items);
    let cart_products = document.getElementById('items');
    cart_products.innerHTML = null;
    for(let product of cart_items) {
        let item_name = product[0];
        let amount = product[1];
        let item_control_div = create_item_control_div(item_name, amount);
        cart_products.appendChild(item_control_div);
    }
}

function create_item_control_div(prod_name, prod_amount) {
    let item_control_div = document.createElement('div');
    item_control_div.className = 'product-amount-control';
    item_control_div.id = prod_name;
    
    let item_name = document.createElement('p');
    item_name.innerHTML = prod_name;
    item_name.className = 'product-name'
    
    let increment_button = document.createElement('button');
    increment_button.className = 'increment';
    increment_button.innerHTML = '+';
    increment_button.id = prod_name;
    //increment_button.setAttribute('productName', prod_name);
    increment_button.addEventListener('click', add_to_cart, false);

    let amount_counter = document.createElement('p');
    amount_counter.className = 'amount';
    amount_counter.innerHTML = prod_amount;
    
    let decrement_button = document.createElement('button');
    decrement_button.className = 'decrement';
    decrement_button.innerHTML = '-';
    decrement_button.id = prod_name;
    //decrement_button.setAttribute('productName', prod_name);
    decrement_button.addEventListener('click', remove_from_cart, false);
    
    item_control_div.appendChild(item_name);
    item_control_div.appendChild(increment_button);
    item_control_div.appendChild(amount_counter);
    item_control_div.appendChild(decrement_button);
    
    return item_control_div;
}

/* function update_total_counter() {
    let total = 0;
    cart_items.forEach(product => total += product);
    let total_quantity_display = document.getElementById('total_quantity');
    if(total_quantity_display == null) {
        total_quantity_display = document.createElement('p');
        total_quantity_display.id = 'total_quantity';
        document.getElementById('cart-search').appendChild(total_quantity_display);
    }
    if(total > 0) total_quantity_display.innerHTML = total;
    else {
        document.getElementById('cart-search').removeChild(total_quantity_display);
    }
} */