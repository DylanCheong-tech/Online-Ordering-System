// router.js

let params = new URLSearchParams(window.location.search);

let view = params.get("view");
let sub_content_pane = params.get("sub_content_pane");
let operation = params.get("operation");

if (view == "product_catalogue") {
    display_dropdown('product_catalogue_dropdown');
    if (!sub_content_pane)
        displayProductCatalogue();
    else if (["plastic", "iron"].includes(sub_content_pane)) {
            if (operation == "create")
                displayCreateProduct(sub_content_pane);
            else if (operation == "color")
                displayProductCatalogueCategoryMetadataColor(sub_content_pane)
            else if (operation == "shop_category")
                displayProductCatalogueCategoryMetadataShopCategory(sub_content_pane)
            else
                displayProductCatalogueCategoryInfo(sub_content_pane);
    }
}
// else {
//     // Error message 
// }