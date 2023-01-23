// order_cart.js

// retreive the order cart data from the web bowser session data storage 

let submit_status = (new URLSearchParams(window.location.search)).get("submit_status")

if (submit_status == "success") {
    displayMessageBox("Order submitted, please check your mailbox. Thank You !");
    window.sessionStorage.clear()
}
else if (submit_status == "fail") {
    displayMessageBox("Something went wrong ...  Please contact our customer service for any assistance. Thank You !");
}

// Product Item Entry component 
function ProductItem(props) {
    let item = props.item;
    let [image_url, set_image_url] = React.useState("");

    async function get_item_image(catalogue_category, item_code, color) {
        switch (catalogue_category) {
            case "Plastic Pots":
                catalogue_category = "plastic";
                break;
            case "Iron Stands":
                catalogue_category = "iron";
                break;
            default:
                return
        }

        let response = await fetch("/public/product/" + catalogue_category + "/" + item_code + "/" + color + "/preview_image");
        let json = await response.json();
        set_image_url(json.image_url);
    }

    get_item_image(item.catalogue_category, item.item_code, item.color);

    return (
        <div className="item">
            <span>
                <img src={image_url} />
            </span>
            <span>
                <span>{item.shop_category} - {item.item_code}</span>
                <span>Color Variation : {item.color}</span>
                <span>Quantity : <input type="number" min="1" defaultValue={item.quantity} onChange={(event) => update_item_quantity(item.item_code, item.color, event.target.value)} /></span>
                <span><a href="" onClick={() => remove_from_order_cart(item.item_code)}><img src="./img/icon_delete.png" />Remove Item</a></span>
            </span>
        </div>
    )
}

function render_order_cart() {
    const root = document.getElementById("product_items");
    const container = ReactDOM.createRoot(root);

    let order_cart_data = get_order_cart();

    if (order_cart_data && order_cart_data.items.length > 0)
        container.render(
            <React.Fragment>
                {
                    order_cart_data.items.map((item) => {
                        return <ProductItem item={item} />
                    })
                }
            </React.Fragment>
        );
    else
        container.render(
            <div id="no_items">
                <h1>No items in your order cart. </h1>
                <h2>Shop with us now on our catalogues !</h2>
            </div>
        )
}

function submitOrderForm() {
    document.getElementById("items_input").value = JSON.stringify(get_order_cart().items);
}

render_order_cart()