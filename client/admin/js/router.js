// router.js

let params = new URLSearchParams(window.location.search);

let view = params.get("view");
let sub_content_pane = params.get("sub_content_pane");
let operation = params.get("operation");
let product_code = params.get("product");

if (view == "product_catalogue") {
    display_dropdown('product_catalogue_dropdown');
    if (!sub_content_pane)
        displayProductCatalogue();
    else if (["plastic", "iron"].includes(sub_content_pane)) {
        if (operation == "create")
            displayCreateProduct(sub_content_pane);
        else if (operation == "edit")
            displayEditProduct(sub_content_pane, product_code);
        else if (operation == "color")
            displayProductCatalogueCategoryMetadataColor(sub_content_pane)
        else if (operation == "shop_category")
            displayProductCatalogueCategoryMetadataShopCategory(sub_content_pane)
        else if (!operation && product_code)
            displayProductItemInfo(sub_content_pane, product_code);
        else
            displayProductCatalogueCategoryInfo(sub_content_pane);
    }
}
// else {
//     // Error message 
// }