// product_catalogue_category.jsx

// React Component : Product Catalogue Category sub pane
function ProductCatalogueCategory(props) {
    let category = props.json_data.category;

    function updateStockStatus(product_code, status) {
        let body_data = {
            product_code: product_code,
        };

        status = status == "Available" ? "Out_Of_Stock" : "Available";

        fetch("/admin/portal/productItem/" + category + "/update_stock_status/" + status, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body_data)
        })
            .then(response => {
                check_redirect_request(response);
                return response.json();
            })
            .then(json => {
                if (json.acknowledged)
                    window.location.reload();
            })
    }

    return (
        <React.Fragment>
            <h1 class="left_margin">Product Catalogue - {category.charAt(0).toUpperCase() + category.slice(1)}</h1>
            <p class="content_attributes left_margin">
                Category : {category.charAt(0).toUpperCase() + category.slice(1)}
            </p>
            <div id="button_actions_bar" class="left_margin">
                <button type="button" onClick={() => accessResource("view=product_catalogue&sub_content_pane=" + category + "&operation=create")}>Create New Product Item</button>
                <button type="button" onClick={() => accessResource("view=product_catalogue&sub_content_pane=" + category + "&operation=color")}>Manage Colors</button>
                <button type="button" onClick={() => accessResource("view=product_catalogue&sub_content_pane=" + category + "&operation=shop_category")}>Manage Shop Categories</button>
            </div>
            <div id="search_filter" class="left_margin">
                <input id="search_bar" placeholder="Search ... " />
                <select id="filter_drop_down">
                    <option disabled selected>--- Filter ----</option>
                    <option>xxxx</option>
                    <option>xxxx</option>
                    <option>xxxx</option>
                    <option>xxxx</option>
                </select>
            </div>
            <div id="content_table">
                <div id="header_bar" class="content_table_row">
                    <span>Product Code</span>
                    <span>Product Name</span>
                    <span>Shop Category</span>
                    <span>Featured</span>
                    <span>Stock Status</span>
                    <span>Quick Actions</span>
                </div>
                {
                    props.json_data.product_items.map((item) => {
                        return (
                            <div class="content_table_row">
                                <a href={window.location.href + "&product=" + item.product_code}>{item.product_code}</a>
                                <span>{item.product_name}</span>
                                <span>{item.shop_category}</span>
                                <span>{item.featured ? "Yes" : "No"}</span>
                                <span>{item.stock_status}</span>
                                <span><button type="button" onClick={() => updateStockStatus(item.product_code, item.stock_status)}>{item.stock_status == "Available" ? "Out Of Stock" : "Available"}</button></span>
                            </div>
                        )
                    })
                }
            </div>
        </React.Fragment>
    );
}