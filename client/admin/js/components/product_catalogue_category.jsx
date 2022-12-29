// product_catalogue_category.jsx

// React Component : Product Catalogue Category sub pane
function ProductCatalogueCategory(props) {
    let category = props.json_data.category;
    let [product_items, set_product_items] = React.useState(props.json_data.product_items);

    // parameter ==> search_key : String, product_item : Object(JSON)
    function search_items(search_key) {
        // if not searching key, return the original list 
        if (search_key.length == 0) {
            set_product_items([...props.json_data.product_items]);
            return;
        }

        // search by product code
        let products_code = props.json_data.product_items.filter(item => item.product_code.toLowerCase().match(search_key.toLowerCase()));

        // search by product name 
        let products_name = props.json_data.product_items.filter(item => item.product_name.toLowerCase().match(search_key.toLowerCase()));

        // merge the two search resutl and removing the repeating item
        let results = [... new Set(products_code.concat(products_name))];

        set_product_items([...results]);
    }

    // sort event handler 
    function sort_event_handler(sort_function, event) {
        sort_items(sort_function, event.target.classList.contains("reverse"));
        event.target.classList.toggle("reverse");
        Array.from(document.getElementsByClassName("sorted")).forEach(ele => ele.classList.remove("sorted"));
        event.target.classList.add("sorted");
    }

    // Sort function
    // Parameter ==> sort_function: Function, reverse: boolean
    function sort_items(sort_function, reverse) {
        set_product_items(previous => {
            if (!reverse)
                return [...previous.sort(sort_function)];
            else
                return [...previous.sort(sort_function).reverse()];
        });
    }

    function sort_by_product_code(item1, item2) {
        if (item1.product_code < item2.product_code)
            return -1;

        if (item1.product_code > item2.product_code)
            return 1;

        return 0;
    }

    function sort_by_product_name(item1, item2) {
        if (item1.product_name < item2.product_name)
            return -1;

        if (item1.product_name > item2.product_name)
            return 1;

        return 0;
    }

    function sort_by_shop_category(item1, item2) {
        if (item1.shop_category < item2.shop_category)
            return -1;

        if (item1.shop_category > item2.shop_category)
            return 1;

        return 0;
    }

    function sort_by_featured(item1, item2) {
        if (item1.featured)
            return -1;

        if (item2.featured)
            return 1;

        return 0;
    }

    function sort_by_stock_status(item1, item2) {
        if (item1.stock_status < item2.stock_status)
            return -1;

        if (item1.stock_status > item2.stock_status)
            return 1;

        return 0;
    }

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
                <input id="search_bar" type="text" placeholder="Search and Filter ... " onChange={(event) => { search_items(event.target.value) }} />
            </div>
            <div id="content_table">
                <div id="header_bar" class="content_table_row click_allowed_childs">
                    <span onClick={(event) => { sort_event_handler(sort_by_product_code, event) }}>Product Code <span><img class="up" src="./img/icon_up.png" /><img class="down" src="./img/icon_down.png" /></span></span>
                    <span onClick={(event) => { sort_event_handler(sort_by_product_name, event) }}>Product Name <span><img class="up" src="./img/icon_up.png" /><img class="down" src="./img/icon_down.png" /></span></span>
                    <span onClick={(event) => { sort_event_handler(sort_by_shop_category, event) }}>Shop Category <span><img class="up" src="./img/icon_up.png" /><img class="down" src="./img/icon_down.png" /></span></span>
                    <span onClick={(event) => { sort_event_handler(sort_by_featured, event) }}>Featured <span><img class="up" src="./img/icon_up.png" /><img class="down" src="./img/icon_down.png" /></span></span>
                    <span onClick={(event) => { sort_event_handler(sort_by_stock_status, event) }}>Stock Status <span><img class="up" src="./img/icon_up.png" /><img class="down" src="./img/icon_down.png" /></span></span>
                    <span>Quick Actions</span>
                </div>
                {
                    product_items.map((item) => {
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