// order_cart_fn.js 

// function to add the order item into the session store 
// Parameters : catalogue category, product code, quantity, color
function add_to_order_cart(catalogue_category, shop_category, item_code, quantity, color) {
    let order_data = window.sessionStorage.getItem("order_cart");

    if (!order_data) order_data = { items: [] }
    else order_data = JSON.parse(order_data);

    // check if the item is added 
    let existing_item = order_data.items.filter((item) => item.item_code == item_code)

    if (existing_item.length > 0) {
        order_data.items.forEach((item) => {
            if (item.item_code == item_code)
                item.quantity = parseInt(existing_item[0].quantity) + parseInt(quantity)
        })
    }
    else {
        new_item = {
            "catalogue_category": catalogue_category,
            "shop_category": shop_category,
            "item_code": item_code,
            "quantity": parseInt(quantity),
            "color": color
        }

        order_data.items.push(new_item);
    }

    window.sessionStorage.setItem("order_cart", JSON.stringify(order_data));
}

// function to remove a order item from the session store 
// Parameters : item_code
function remove_from_order_cart(item_code) {
    let order_data = window.sessionStorage.getItem("order_cart");

    order_data = JSON.parse(order_data);

    order_data.items = order_data.items.filter((item) => item.item_code != item_code)

    window.sessionStorage.setItem("order_cart", JSON.stringify(order_data));
}

function update_item_quantity(item_code, color, new_quantity) {
    let order_data = window.sessionStorage.getItem("order_cart");

    order_data = JSON.parse(order_data);

    order_data.items.forEach((item) => {
        if (item.item_code == item_code && item.color == color)
            item.quantity = parseInt(new_quantity)
    })

    window.sessionStorage.setItem("order_cart", JSON.stringify(order_data));
}

// function to retreive all the order data from the session store 
function get_order_cart() {
    return JSON.parse(window.sessionStorage.getItem("order_cart"))
}