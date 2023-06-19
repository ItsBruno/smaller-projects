import { getCategories, getItems, addToCart, getCart} from "./api_connection.mjs";

let categories;
let cart_items;

let first_load = 1;

let products_div = document.getElementById('products');

export async function do_onload() {
    categories = await getCategories();
    await update_sidebar(categories);

    cart_items = await getCart();
    cart_items = new Map(Object.entries(cart_items));
    await update_displayed_category();
    
    update_total_counter(cart_items);
}

async function update_sidebar(categories) {
    let sidebar_div = document.getElementById('categories');

    for(let category of categories) {
        let select_category_btn = document.createElement('button');
        select_category_btn.addEventListener("click", update_displayed_category, false);
        select_category_btn.className= "category";
        select_category_btn.id = category.id;
        select_category_btn.title = category.name.replace(' ', '_');
        select_category_btn.innerHTML = category.name;
        sidebar_div.appendChild(select_category_btn);
    }
}

export async function add_item_to_cart(evt) {
    addToCart(evt.currentTarget.id);
    console.log(`Adding to cart: ${evt.currentTarget.id}`);
    cart_items = await getCart();
    cart_items = new Map(Object.entries(cart_items));
    update_amount_counter();
    update_total_counter(cart_items);
}

export function update_total_counter(cart_items) {
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
}

function update_amount_counter(){
    console.log(`Type: ${typeof cart_items}, Cart: ${cart_items}`);
    for(let product of cart_items) {
        if(document.getElementById(product[0]) != null) {
            if(document.getElementById(product[0]+'quantity') == null) {
                create_amount_counter(product[0]);
            }
            let prod_quantity_display = document.getElementById(product[0] + 'quantity');
            prod_quantity_display.innerHTML = product[1];
        }
    }
}

function create_amount_counter(prod_id) {
    let product_img_div = document.getElementById(prod_id).parentElement;
    let quantity = document.createElement('p');
    quantity.className='quantity';
    quantity.id = prod_id + 'quantity';
    quantity.innerHTML = '1';
    product_img_div.appendChild(quantity);
}


export async function update_displayed_category(evt) {
    let id;
    let category_name;
    if(first_load) {
      id = 1;  
      category_name = 'Automatic_rifles'
      first_load = 0;
    }
    else {
        id = evt.currentTarget.id;
        category_name = evt.currentTarget.title;
    }

    let current_category = document.getElementById('current-category');
    current_category.innerHTML = category_name.replace("_", " ");
    
    let products = await getItems(id);
    
    products_div.innerHTML = null
    for(let product of products) {
        let curr_product_div = createProductDiv(product.image, product.name, category_name);
        products_div.appendChild(curr_product_div);
    }
    update_amount_counter();
}

function createProductDiv(image, prod_name, categ_name) {
    
    let product_div = document.createElement('div');
    product_div.className = 'product'
    
    let prod_img_cont = document.createElement('div');
    prod_img_cont.className = 'prod-img-cont'
    let product_info = document.createElement('div');
    product_info.className = 'product-info'
    
    let product_img = document.createElement('img');
    product_img.src = image;
    product_img.className = 'product-img'
    
    let product_name = document.createElement('h1');
    product_name.innerHTML = prod_name.replace("_", " ");
    product_name.className = 'product-name';
    
    let product_category = document.createElement('h2');
    product_category.innerHTML = categ_name.replace("_", " ");
    product_category.className = 'category-name';
    
    let add_to_cart = document.createElement('img');
    add_to_cart.src = 'images/icons/shopping-cart.png'
    add_to_cart.className = 'shopping-cart-add';
    add_to_cart.id = prod_name;
    add_to_cart.addEventListener("click", add_item_to_cart, false)
    
    prod_img_cont.appendChild(product_img);
    prod_img_cont.appendChild(add_to_cart);
    product_info.appendChild(product_name);
    product_info.appendChild(product_category);
    
    product_div.appendChild(prod_img_cont);
    product_div.appendChild(product_info);

    return product_div;
}
 