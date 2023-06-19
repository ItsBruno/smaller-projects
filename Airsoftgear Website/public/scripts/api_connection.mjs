export async function getCategories() {
    return await fetch_from('http://localhost:3000/home/getCategories', 'GET');
}

export async function getItems(id) {
    return await fetch_from(`http://localhost:3000/home/getProducts/:${id}`, 'GET');
}

async function fetch_from(uri, method) {
    console.log(`Fetching from ${uri}`);
    let response;
    try {
        response = await fetch(uri, {
            method : method,
            credentials: "same-origin"
        });
    }
    catch(err) {
        console.log(`Error: ${err}`);
    }

    if(!response.ok) {
        console.log(response.status);
    }
    else {
        const jsonData = await response.json();
        return jsonData;
    }
}

export async function addToCart(id) {
    fetch_from(`http://localhost:3000/cart/add/:${id}`, 'POST');
}

export async function removeFromCart(id) {
    fetch_from(`http://localhost:3000/cart/remove/:${id}`, 'POST')
}

export async function getCart() {
    return await fetch_from('http://localhost:3000/cart/getAll', 'GET');
}