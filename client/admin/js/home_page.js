// home_page.js

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