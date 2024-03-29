// home_page.js

// show up the pop up message box 
function displayMessageBox(message, close_fn) {
    document.getElementById("popup_message").innerHTML = message;
    document.getElementById("popup_message_box").style.display = "flex";

    document.getElementById("popup_message_box_close_btn").addEventListener("click", function (event) { closeMesssageBox(event, close_fn) }, event, close_fn)
}

// close the pop up message box 
function closeMesssageBox(event, close_fn) {
    event.target.parentElement.style.display = "none";
    close_fn()
}

// append the URL parameters to redirect to other resources 
function accessResource(params) {
    window.location.href = "/admin/home_page.html?" + params;
}

// check if needed redirected
function check_redirect_request(response) {
    if (response.redirected) {
        window.location.href = response.url;
    }
}

// logout
function logout() {
    fetch("/admin/logout", { method: "DELETE" })
        .then(response => {
            check_redirect_request(response);
        });
}

// toogle for side menu dropdown display 
function display_dropdown(dropdown_id) {
    document.getElementById(dropdown_id).classList.toggle("show_dropdown");
}

// main subcontent pane render function
function renderSubcontent(component) {
    const root = document.getElementById("sub_content_pane");
    const container = ReactDOM.createRoot(root);
    container.render(
        component
    );
}

// helper function to fetch the metadata for all the cetegory and render 
async function displayProductCatalogue() {
    let response = await fetch("/admin/portal/productCatalogue/metadata");
    check_redirect_request(response);
    let json = await response.json();
    console.log(json)

    let component = <ProductCatalogue json_data={json} />;
    renderSubcontent(component);
}

// helper function to fetch and pass the data to the render function
async function displayProductCatalogueCategoryInfo(category) {
    let response = await fetch("/admin/portal/productCatalogue/" + category);
    check_redirect_request(response);
    let json = await response.json();

    let component = <ProductCatalogueCategory json_data={json} />;
    renderSubcontent(component);
}

// helper function to get the metadata of the plastic or iron - colors and shop category and render the form 
async function displayCreateProduct(category) {
    let response = await fetch("/admin/portal/productCatalogue/" + category + "/metadata");
    check_redirect_request(response);
    let json = await response.json();
    json = json[0];

    console.log(json)

    let component = category == "plastic" ? <CreatePlasticProduct metadata={json} /> : <CreateIronProduct metadata={json} />;
    renderSubcontent(component);
}

// helper function to get the metadata of the plastic or iron - colors and shop category and render the form 
async function displayEditProduct(category, product_code) {
    let metadata_response = await fetch("/admin/portal/productCatalogue/" + category + "/metadata");
    let product_response = await fetch("/admin/portal/productItem/" + category + "/get/" + product_code);
    check_redirect_request(product_response);
    let metadata_json = (await metadata_response.json())[0];
    let product_json = await product_response.json();

    console.log(metadata_json)
    console.log(product_json)

    let component = category == "plastic" ? <EditPlasticProduct metadata={metadata_json} product_data={product_json} /> : <EditIronProduct metadata={metadata_json} product_data={product_json} />;
    renderSubcontent(component);
}

// helper function to fetch the product catalogue metadata info and render
async function displayProductCatalogueCategoryMetadataColor(category) {
    let response = await fetch("/admin/portal/productCatalogue/" + category + "/metadata/colors");
    check_redirect_request(response);
    let json = await response.json();
    json = json[0];

    console.log(json)

    let component = <ProductCatalogueCategoryMetadataColor json_data={json} />;
    renderSubcontent(component);
}

// helper function to fetch the product catalogue metadata info and render
async function displayProductCatalogueCategoryMetadataShopCategory(category) {
    let response = await fetch("/admin/portal/productCatalogue/" + category + "/metadata/shop_category");
    check_redirect_request(response);
    let json = await response.json();
    json = json[0];

    console.log(json)

    let component = <ProductCatalogueCategoryMetadataShopCategory json_data={json} />;
    renderSubcontent(component);
}

// hepler function to display the product information 
async function displayProductItemInfo(category, product_code) {
    let response = await fetch("/admin/portal/productItem/" + category + "/get/" + product_code);
    check_redirect_request(response);
    let json = await response.json();
    renderSubcontent(<ViewProduct json_data={json} category={category} />);
}

// hepler function to display the enquiries page
async function displayEnquiries(mode) {
    let response = await fetch("/admin/portal/enquiries/" + mode);
    check_redirect_request(response);
    let json = await response.json();

    renderSubcontent(<Enquiries data={json} />);
}

// hepler function to display the enquiries details page
async function displayEnquiryDetails(enquiry_id) {
    let response = await fetch("/admin/portal/enquiry/" + enquiry_id);
    check_redirect_request(response);
    let json = await response.json();

    renderSubcontent(<EnquiryDetails data={json} />);

}

// helper function to diaplay the customer orders dashboard 
async function displayOrderManagementDashboard() {
    let response = await fetch("/order/admin/order/overview");
    check_redirect_request(response);
    let json = await response.json();

    let component = <OrderManagementDashboard data={json} />;
    renderSubcontent(component);
}

async function displayOrderDetails() {
    let response = await fetch("/order/admin/order_list");
    check_redirect_request(response);
    let json = await response.json();
    let component = <OrderDetails order_list={json} />
    renderSubcontent(component)
}

async function displayOrderDetailsWithStatus(status) {
    let response = await fetch("/order/admin/order_list/" + status);
    check_redirect_request(response);
    let json = await response.json();
    let component = <OrderContentTable order_list={json} />

    // dependency : OrderDetail page is rendered 
    const root = document.getElementById("order_content_pane");
    const container = ReactDOM.createRoot(root);
    container.render(
        component
    );
}

async function displayCreateOrder() {
    let response = await fetch("/order/admin/order/info/catalogue_category");
    check_redirect_request(response);
    let json = await response.json();

    let submit_status = (new URLSearchParams(window.location.search)).get("submit_status")
    if (submit_status) {
        let message = submit_status == "success" ? "Order has been created successfully !" : "Something went wrong. Please Try again later ... ";
        displayMessageBox(message, () => { accessResource("view=order_management&sub_content_pane=order_details") })
    }

    let component = <OrderForm catalogue_categories={json.catalogue_category} />
    renderSubcontent(component)
}

async function displayEditOrder(order_id) {
    let response = await fetch("/order/admin/order/info/catalogue_category");
    check_redirect_request(response);
    let json = await response.json();

    let order_response = await fetch("/order/admin/order/" + order_id);
    check_redirect_request(order_response);
    let order_json = await order_response.json();

    let update_status = (new URLSearchParams(window.location.search)).get("update_status")
    if (update_status) {
        let message = update_status == "success" ? "Order has been updated successfully !" : "Something went wrong. Please Try again later ... ";
        displayMessageBox(message, () => { accessResource("view=order_management&sub_content_pane=view_order_record&order_id=" + order_id) })
    }

    let component = <OrderForm catalogue_categories={json.catalogue_category} order={order_json} />
    renderSubcontent(component)
}

async function displayOrderRecordDetails(order_id) {
    let response = await fetch("/order/admin/order/" + order_id);
    check_redirect_request(response);
    let json = await response.json();

    // if there is no order record, redirect the user back to the order list page
    if (json.status == "fail") window.location.href = "/admin/home_page.html?view=order_management&sub_content_pane=order_details";

    let component = <OrderRecordDetail order={json} />
    renderSubcontent(component)

}