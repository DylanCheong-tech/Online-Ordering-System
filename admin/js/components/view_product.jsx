// view_product.jsx

// React Component : View Product sub pane
function ViewProduct(props) {
    let item = props.json_data;
    function back_to_catalogue() {
        displayProductCatalogueCategoryInfo(props.category);
    }
    return (
        <React.Fragment>
            <h2 id="header_2_title" class="left_margin">
                <img id="back_icon" src="./img/icon_back.png" onClick={back_to_catalogue} />
                {item.product_code}
            </h2>
            <div id="action_button_bar" class="left_margin">
                <button type="button">Edit</button>
                <button type="button">Withhold</button>
                <button type="button">No Stock</button>
                <button type="button">Stock Available</button>
                <button type="button">Delete Item</button>
            </div>
            <div id="product_details" class="left_margin">
                <span class="details_row">
                    <p class="detail_property">Product Name</p>
                    <p class="detial_value">{item.product_name}</p>
                </span>
                <span class="details_row">
                    <p class="detail_property">Product Code</p>
                    <p class="detial_value">{item.product_code}</p>
                </span>
                <span class="details_row">
                    <p class="detail_property">Shop Category</p>
                    <p class="detial_value">{item.shop_category}</p>
                </span>
                <span class="details_row">
                    <p class="detail_property">Color Variations</p>
                    <p class="detial_value">{item.colors.join(", ")}</p>
                </span>
                {
                    item.material ?
                        <span class="details_row">
                            <p class="detail_property">Material</p>
                            <p class="detial_value">{item.material}</p>
                        </span>
                        : ""
                }
                <span class="details_row">
                    <p class="detail_property">Stock Status</p>
                    <p class="detial_value">{item.stock_status}</p>
                </span>
                <span class="details_row">
                    <p class="detail_property">Featuring Product ?</p>
                    <p class="detial_value">{item.featured ? "Yes" : "No"}</p>
                </span>
                <span class="details_row">
                    <p class="detail_property">Dimensions (cm)</p>
                    <p class="detial_value">
                        {Object.entries(item.dimensions).map(([key, value]) => {
                            return <span>{key.charAt(0).toUpperCase() + key.slice(1)} : {value} cm</span>
                        })}
                    </p>
                </span>
                {
                    item.diameters ?
                        <span class="details_row">
                            <p class="detail_property">Diameters (cm)</p>
                            <p class="detial_value">
                                {Object.entries(item.diameters).map(([key, value]) => {
                                    return <span>{key.charAt(0).toUpperCase() + key.slice(1)} : {value} cm</span>
                                })}
                            </p>
                        </span>
                        : ""
                }
                <span class="details_row">
                    <p class="detail_property">Descriptions</p>
                    <p class="detial_value">
                        {item.descriptions.map((desc, index) => <span>{index + 1}. {desc}</span>)}
                    </p>
                </span>
                <span class="details_row">
                    <p class="detail_property">Images</p>
                    <div class="product_images_frame detial_value">
                        {
                            item.colors.map((color) => {
                                return (
                                    <span class="product_color_images">
                                        <p class="color_label">{color}</p>
                                        {
                                            Object.entries(item.images).map(([key, value]) => {
                                                if (key.match("/" + color.toUpperCase() + "/"))
                                                    return <img src={value} />
                                            })
                                        }
                                    </span>
                                )
                            })
                        }
                    </div>
                </span>
            </div>
        </React.Fragment>
    );
}