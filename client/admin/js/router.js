// router.js

let params = new URLSearchParams(window.location.search);

let view = params.get("view");
let sub_content_pane = params.get("sub_content_pane");
let operation = params.get("operation");
let product_code = params.get("product");
let enquiry_id = params.get("enquiry");
let order_id = params.get("order_id");

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
else if (view == "enquiries") {
    display_dropdown('enquiries_dropdown');

    if (enquiry_id) {
        displayEnquiryDetails(enquiry_id);
    }
    else {
        displayEnquiries(sub_content_pane);
    }
}
else if (view == "order_management") {
    display_dropdown("order_management_dropdown");
    if (!sub_content_pane)
        displayOrderManagementDashboard()
    else if (sub_content_pane == "order_details")
        displayOrderDetails()
    else if (sub_content_pane == "create_order_record")
        displayCreateOrder()
    else if (sub_content_pane == "view_order_record" && order_id)
        displayOrderRecordDetails(order_id)
    else if (sub_content_pane == "edit_order_record" && order_id)
        displayEditOrder(order_id)
}
// else {
//     // Error message 
// }