// home_page.js

function logout() {
    fetch("/admin/logout", { method: "DELETE" })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        });
}

// React Component (subcomponent) : Side Menu Item > Dropdown items
function DropdownItem(props) {
    if (props.items)
        return (
            <span class="dropdown">
                {
                    props.items.map((sub_item) => {
                        return (<span class="dropdown_item">{sub_item.name}</span>);
                    })
                }
            </span>
        );
}

// React Component : Side Menu Item 
function SideMenuItem(props) {
    return (
        <div id="side_menu">
            {
                props.side_menu_item_json_arr.map((item) => {
                    return (
                        <span class="side_menu_item">
                            <span class="menu_item_name">
                                <img src="./img/icon_next.svg" />
                                <h3>{item.title}</h3>
                                <img src="./img/icon_next.svg" />
                            </span>

                            <DropdownItem items={item.dropdown} />
                        </span>
                    );
                })
            }
        </div>
    );
}

async function renderProductCatalogueInfo(category) {
    let response = await fetch("/admin/portal/productCatalogue/" + category);
    let json = await response.json();

    console.log(json)

    // renderPage("", json);
}

// React Component : Sub-content pane for each side menu item
async function SubcontentPane(props) {
    return (
        <div id="sub_content_pane">
            <ProductCatalogue json_data={props.json_data} />
            {/* <Enquiries /> */}
            {/* <CreateProduct />
            <ViewProduct /> */}
        </div>
    );
}

// React Component : Product Catalogue sub pane
function ProductCatalogue(props) {
    return (
        <React.Fragment>
            <h1 class="left_margin">Product Catalogue</h1>
            <p class="content_attributes left_margin">
                Category : Plastic Pot
            </p>
            <div class="left_margin">
                <button>Create New Product Item</button>
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
                    <span>Last Modified</span>
                    <span>Quick Actions</span>
                </div>
                {
                    props.json_data.product_items.map((item) => {
                        return (
                            <div class="content_table_row">
                                <a href="">{item.product_code}</a>
                                <span>{item.product_name}</span>
                                <span>{item.shop_category}</span>
                                <span>{item.featured ? "Yes" : "No"}</span>
                                <span>XXXXXXX</span>
                                <span><button>Out Of Stock</button></span>
                            </div>
                        )
                    })
                }
            </div>
        </React.Fragment>
    );
}

// React Component : Enquiries sub pane
function Enquiries(props) {
    return (
        <React.Fragment>
            <h1 class="left_margin">Enquiries</h1>
            <p class="content_attributes left_margin">
                Unread Message : xxx <br />
                Unresolved Message : xxx <br />
            </p>
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
                    <span>Message ID</span>
                    <span>Message Subject</span>
                    <span>Date</span>
                    <span>Status</span>
                    <span>Quick Actions</span>
                </div>
                <div class="content_table_row">
                    <a href="">0001</a>
                    <span>XXX XXXXX</span>
                    <span>XX-XX-XXXX</span>
                    <span>XXXXXXX</span>
                    <span><button>Quick Action</button></span>
                </div>
                <div class="content_table_row">
                    <a href="">0002</a>
                    <span>XXX XXXXX</span>
                    <span>XX-XX-XXXX</span>
                    <span>XXXXXXX</span>
                    <span><button>Quick Action</button></span>
                </div>
                <div class="content_table_row">
                    <a href="">0003</a>
                    <span>XXX XXXXX</span>
                    <span>XX-XX-XXXX</span>
                    <span>XXXXXXX</span>
                    <span><button>Quick Action</button></span>
                </div>
            </div>
        </React.Fragment>
    );
}

// React Component : Create Product sub pane
function CreateProduct(props) {
    const [create_status, set_create_status] = React.useState(false);

    function submitForm(event) {
        event.preventDefault();
        let form = document.getElementById("content_form");
        let form_data = new FormData(form);
        let body_data = {}

        for (const [key, value] of form_data.entries()) {
            body_data[key] = value;
        }

        fetch("/admin/portal/productItem/plastic/create", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body_data)
        })
            .then(response => response.json())
            .then(json => {
                set_create_status(json.acknowledged);
                console.log(json);
            })
    }

    let render_ui = "";
    if (create_status) {
        render_ui = <ViewProduct />
    }
    else {
        render_ui =
            <React.Fragment>
                <h2 id="header_2_title" class="left_margin"><img src="../img/icon_next.svg" />Create a Product Item</h2>
                <div class="left_margin">
                    <form class="left_margin" id="content_form" onSubmit={submitForm}>
                        <div id="left_column">
                            <div>
                                <p>Product Name</p>
                                <input type="text" name="product_name" />
                            </div>
                            <div>
                                <p>Product Code</p>
                                <input type="text" name="product_code" />
                            </div>
                            <div>
                                <p>Shop Category</p>
                                <select name="shop_category">
                                    <option selected disabled>---  Shop Category ---</option>
                                    <option value="xxx">xxx</option>
                                </select>
                            </div>
                            <div>
                                <p>Color of Varaition</p>
                                <select name="colors">
                                    <option selected disabled>---  Shop Category ---</option>
                                    <option value="xxx">xxx</option>
                                </select>
                            </div>
                            <div>
                                <p>Material</p>
                                <input type="text" name="material" />
                            </div>
                            <div>
                                <p>Stock Status</p>
                                <label><input type="radio" name="stock_status" value="Available" />Available</label>
                                <label><input type="radio" name="stock_status" value="Out Of Stock" />Out Of Stock</label>
                            </div>
                            <div>
                                <p>Featuring Product ?</p>
                                <label><input type="radio" name="featured" value="true" />Yes</label>
                                <label><input type="radio" name="featured" value="false" />No</label>
                            </div>
                        </div>
                        <div id="right_column">
                            <div class="three_inputs">
                                <p>Dimensions (cm)</p>
                                <input type="number" name="length" placeholder="Length" />
                                <input type="number" name="width" placeholder="Width" />
                                <input type="number" name="height" placeholder="Height" />
                            </div>
                            <div class="three_inputs">
                                <p>Diameters (cm)</p>
                                <input type="number" name="inside" placeholder="Inside" />
                                <input type="number" name="outside" placeholder="Outside" />
                                <input type="number" name="lower" placeholder="Lower" />
                            </div>
                            <div>
                                <p>Descriptions</p>
                                <i>* As a list, delimited by "-" character</i>
                                <textarea name="descriptions">
                                    - xxxx
                                </textarea>
                            </div>
                        </div>
                        <div id="image_pane">
                            <div id="tab_bar">
                                <span class="display">Color 1</span>
                                <span>Color 2</span>
                                <span>Color 3</span>
                                <span>Color 4</span>
                                <span>Color 5</span>
                            </div>
                            <div class="uploaded" id="img_content_pane">
                                {/* <p>Drag and Drop your Images here ... <br /> or ...  </p>
                                <button type="button">Select Files ... </button> */}
                                <span>
                                    <img src="../img/sample3.png" />
                                    <button type="button">Remove</button>
                                </span>
                                <span>
                                    <img src="../img/sample3.png" />
                                    <button type="button">Remove</button>
                                </span>
                                <span>
                                    <img src="../img/sample3.png" />
                                    <button type="button">Remove</button>
                                </span>
                                <span>
                                    <img src="../img/sample3.png" />
                                    <button type="button">Remove</button>
                                </span>
                                <span>
                                    <img src="../img/sample3.png" />
                                    <button type="button">Remove</button>
                                </span>
                                <span>
                                    <img src="../img/sample3.png" />
                                    <button type="button">Remove</button>
                                </span>
                                <span>
                                    <img src="../img/sample3.png" />
                                    <button type="button">Remove</button>
                                </span>
                                <span>
                                    <img src="../img/sample3.png" />
                                    <button type="button">Remove</button>
                                </span>
                                <span>
                                    <img src="../img/sample3.png" />
                                    <button type="button">Remove</button>
                                </span>
                            </div>
                        </div>
                        <button type="submit">Create Item</button>
                    </form>
                </div>
            </React.Fragment>
    }

    return render_ui;
}

// React Component : View Product sub pane
function ViewProduct(props) {
    return (
        <React.Fragment>
            <h2 id="header_2_title" class="left_margin"><img src="../img/icon_next.svg" />CP-0001</h2>
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
                    <p class="detial_value">XXXXXX</p>
                </span>
                <span class="details_row">
                    <p class="detail_property">Product Code</p>
                    <p class="detial_value">XXXXXX</p>
                </span>
                <span class="details_row">
                    <p class="detail_property">Shop Category</p>
                    <p class="detial_value">XXXXXX</p>
                </span>
                <span class="details_row">
                    <p class="detail_property">Color Variations</p>
                    <p class="detial_value">XXXXXX</p>
                </span>
                <span class="details_row">
                    <p class="detail_property">Material</p>
                    <p class="detial_value">XXXXXX</p>
                </span>
                <span class="details_row">
                    <p class="detail_property">Stock Status</p>
                    <p class="detial_value">XXXXXX</p>
                </span>
                <span class="details_row">
                    <p class="detail_property">Featuring Product ?</p>
                    <p class="detial_value">XXXXXX</p>
                </span>
                <span class="details_row">
                    <p class="detail_property">Dimensions (cm)</p>
                    <p class="detial_value">XXXXXX</p>
                </span>
                <span class="details_row">
                    <p class="detail_property">Diameters (cm)</p>
                    <p class="detial_value">XXXXXX</p>
                </span>
                <span class="details_row">
                    <p class="detail_property">Descriptions</p>
                    <p class="detial_value">XXXXXX</p>
                </span>
            </div>
        </React.Fragment>
    );
}

function renderSubcontent(data) {
    const root = document.getElementById("sub_content_pane");
    const container = ReactDOM.createRoot(root);
    container.render(
        <React.Fragment>

        </React.Fragment>
    );
}

// fetch("/admin/portal/metadata")
//     .then((response) => {
//         if (response.redirected) {
//             window.location.href = response.url;
//         }
//         return response.json();
//     })
//     .then(renderPage)
//     .catch(console.log);

fetch("/admin/portal/productItem/plastic/get/CP-470")
    .then(response => response.json())
    .then(console.log)