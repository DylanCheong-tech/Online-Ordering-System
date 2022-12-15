// product_catalogue_category_metadata_shop_category.jsx

// React Component : Edit Product Catalogue Category metadata - shop category
function ProductCatalogueCategoryMetadataShopCategory(props) {
    function addCategory() {
        let category_ele = document.getElementById("new_category");
        let new_category = category_ele.value;
        category_ele.value = "";
        set_category_arr(previous => [...previous, new_category]);
    }

    function removeCategory(category) {
        set_category_arr(previous => previous.filter((element) => element != category));
    }

    function changeCategory(index, category) {
        set_category_arr(previous => {
            previous[index] = category;
            return [...previous];
        });
    }

    async function update(arr) {
        fetch("/admin/portal/productCatalogue/" + props.json_data.category + "/metadata/shop_category", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(arr)
        })
            .then(response => {
                check_redirect_request(response);
                return response.json();
            })
            .then(json => {
                if (json.acknowledged)
                    alert("Update successfully.");
                else
                    alert("Something went wrong.. Please tray again later ... ");
            })
    }

    let [category_arr, set_category_arr] = React.useState(props.json_data.shop_category);
    let counter = category_arr.length;
    return (
        <React.Fragment>
            <h2 id="header_2_title" class="left_margin"><img onClick={() => accessResource("view=product_catalogue&sub_content_pane=" + props.json_data.category)} src="./img/icon_back.png" />{props.json_data.title} - Edit Shop Categories</h2>
            <div id="content_table" class="left_margin">
                <div id="header_bar" class="content_table_row">
                    <span>No.</span>
                    <span>Category</span>
                    <span>Actions</span>
                </div>

                {
                    category_arr.map((category, index) => {
                        return (
                            <div class="content_table_row">
                                <span>{index + 1}.</span>
                                <span><input name="categories" type="text" value={category} onChange={(event) => changeCategory(index, event.target.value)} /></span>
                                <span><button type="button" onClick={() => removeCategory(category)}>Remove</button></span>
                            </div>
                        );
                    })
                }

                <div class="content_table_row">
                    <span>{counter + 1}.</span>
                    <span><input id="new_category" name="categories" type="text" /></span>
                    <span><button type="button" onClick={addCategory}>Add</button></span>
                </div>

                <button type="button" onClick={() => update(category_arr)}>Confirm Changes</button>
            </div>
        </React.Fragment>
    );
}