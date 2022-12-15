// product_catalogue_category_metadata_color.jsx

// React Component : Edit Product Catalogue Category metadata - colors 
function ProductCatalogueCategoryMetadataColor(props) {
    function addColor() {
        let color_ele = document.getElementById("new_color");
        let hex_ele = document.getElementById("new_hex");
        let color = color_ele.value;
        let hex = hex_ele.value;
        color_ele.value = "";
        hex_ele.value = "";
        set_color_json(previous => Object.assign({ ...previous }, { [color]: hex }));
    }

    function removeColor(color_name) {
        set_color_json(previous => {
            delete previous[color_name];
            return { ...previous };
        });
    }

    function changeColor(previous_color, new_color, hex_value) {
        set_color_json(previous => {
            if (!new_color) {
                previous[previous_color] = hex_value;
            }

            if (!hex_value) {
                hex_value = previous[previous_color];
                delete previous[previous_color];
                previous[new_color] = hex_value;
            }

            return { ...previous };
        });
    }

    function updatePreviewColor() {
        let hex = document.getElementById("new_hex").value;
        let preview_ele = document.getElementById("new_preview");
        preview_ele.style.backgroundColor = hex;
    }

    async function update(body_data) {
        fetch("/admin/portal/productCatalogue/" + props.json_data.category + "/metadata/colors", {
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
                    alert("Update successfully.");
                else
                    alert("Something went wrong.. Please tray again later ... ");
            })
    }

    let [color_json, set_color_json] = React.useState(props.json_data.colors);
    let counter = Object.values(color_json).length;
    console.log(color_json)
    return (
        <React.Fragment>
            <h2 id="header_2_title" class="left_margin"><img onClick={() => accessResource("view=product_catalogue&sub_content_pane=" + props.json_data.category)} src="./img/icon_back.png" />{props.json_data.title} - Edit Colors</h2>
            <div id="content_table" class="left_margin">
                <div id="header_bar" class="content_table_row">
                    <span>No.</span>
                    <span>Color</span>
                    <span>HEX Code</span>
                    <span>Preview</span>
                    <span>Actions</span>
                </div>

                {
                    Object.entries(color_json).map(([key, value], index) => {
                        return (
                            <div class="content_table_row">
                                <span>{index + 1}.</span>
                                <span><input name={"color_" + (index + 1)} type="text" value={key} onChange={(event) => changeColor(key, event.target.value, "")} /></span>
                                <span><input name={"hex_" + (index + 1)} type="text" value={value} onChange={(event) => changeColor(key, "", event.target.value)} /></span>
                                <span style={{ backgroundColor: value }}></span>
                                <span><button type="button" onClick={() => removeColor(key)}>Remove</button></span>
                            </div>
                        );
                    })
                }

                <div class="content_table_row">
                    <span>{counter + 1}.</span>
                    <span><input id="new_color" name={"color_" + counter} type="text" /></span>
                    <span><input id="new_hex" name={"hex_" + counter} type="text" onChange={() => updatePreviewColor()} /></span>
                    <span id="new_preview"></span>
                    <span><button type="button" onClick={addColor}>Add</button></span>
                </div>

                <button type="button" onClick={() => update(color_json)}>Confirm Changes</button>
            </div>
        </React.Fragment>
    );
}