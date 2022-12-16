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