// order_cart.js

// retreive the order cart data from the web bowser session data storage 

// Product Item Entry component 
function ProductItem(props) {
    return (
        <div className="item">
            <span>
                <img src="./img/sample3.png" />
            </span>
            <span>
                <span>Product Code - Product Name</span>
                <span>Color Variation : BLACK</span>
                <span>Quantity : <input type="number" min="1" defaultValue="1" /></span>
                <span><a href=""><img src="./img/icon_delete.png" />Remove Item</a></span>
            </span>
        </div>
    )
}


function render_order_cart(data) {
    const root = document.getElementById("product_items");
    const container = ReactDOM.createRoot(root);
    container.render(
        <React.Fragment>
            <ProductItem />
            <ProductItem />
            <ProductItem />
            <ProductItem />
            <ProductItem />
            <ProductItem />
        </React.Fragment>
    );
}

render_order_cart()