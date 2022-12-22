// edit_iron_product.jsx

// React Component : Create Ifon Product sub pane
// props : metadata, product_data
function EditIronProduct(props) {

    let color_json = {}

    props.product_data.colors.forEach((color) => {
        color_json[color] = [];
    })
    const [color_img_json, set_color_img_json] = React.useState(color_json);
    const [color_img_files, set_color_img_files] = React.useState({});
    const [read_all_img, set_read_all_img] = React.useState(false)

    if (!read_all_img) {
        props.product_data.colors.forEach((color) => {
            Object.entries(props.product_data.images).forEach(async ([name, url]) => {
                if (name.match("/" + color.toUpperCase() + "/")) {
                    const fileReader = new FileReader();

                    fileReader.addEventListener("load", () => {
                        const image = fileReader.result;
                        set_color_img_json(previous => {
                            if (!previous[color]) previous[color] = [];
                            previous[color].push({ name: name, dataURL: image });
                            return { ...previous };
                        })
                    })
                    let img_response = await fetch(url);
                    let img_blob = await img_response.blob();

                    // load and preview the image blob 
                    fileReader.readAsDataURL(img_blob);
                    // add the image blob file into the input[type=file] control
                    set_color_img_files(previous => {
                        if (!previous[color]) previous[color] = new DataTransfer();
                        previous[color].items.add(new File([img_blob], name, { type: img_blob.type }));
                        return { ...previous }
                    })
                }
            })
        })
        set_read_all_img(true);
    }

    React.useEffect(() => {
        if (read_all_img) {
            Object.keys(color_img_json).forEach((key) => {
                let img_color_input_ele = document.querySelector("input[name=" + key.replace(" ", "_") + "_img]");
                if (color_img_files[key]) {
                    img_color_input_ele.files = color_img_files[key].files;
                }
                console.log(img_color_input_ele.files)
            })
        }
    }, [color_img_files, color_img_json])

    const [curr_img_color, set_curr_img_color] = React.useState(props.product_data.colors[0]);
    let original_product_code = props.product_data.product_code;
    const [product_data, set_product_data] = React.useState(props.product_data);

    function updateData(property, value, parent_property) {
        set_product_data(previous => {
            if (parent_property)
                previous[parent_property][property] = parseInt(value);
            else
                previous[property] = value;

            if (property == "descriptions") {
                previous[property] = value.split("\n").filter((ele) => ele)
            }
            return { ...previous };
        });
    }

    function updateColor(color, checked) {
        set_product_data(previous => {
            if (checked) {
                previous.colors.push(color);
            }
            else {
                previous.colors = previous.colors.filter((arr_color) => arr_color != color);
            }

            return { ...previous };
        });

        set_color_img_json(previous => {
            if (Object.keys(previous).length == 0)
                set_curr_img_color(color);

            if (!checked) {
                delete previous[color];
                if (curr_img_color) {
                    set_curr_img_color(Object.keys(color_img_json).length > 0 ? Object.keys(color_img_json)[0] : "");
                }
                return { ...previous };
            }

            if (!previous[color])
                previous[color] = [];
            return { ...previous };
        });

        //  delete the files DataTransfer from the json as well
        set_color_img_files(previous => {
            if (!checked)
                delete previous[color];
            else
                previous[color] = new DataTransfer();
            return { ...previous };
        });
    }

    function changeColorTab(ele, color) {
        // upload box display 
        document.getElementById(curr_img_color + "_img").classList.toggle("hide_upload_box");
        document.getElementById(color + "_img").classList.remove("hide_upload_box");

        set_curr_img_color(color);
    }

    function handleDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    function handleDrop(event) {
        event.stopPropagation();
        event.preventDefault();

        uploadImages(event.dataTransfer, curr_img_color);
    }

    function uploadImages(target_ele, color) {
        let files = target_ele.files;

        for (let i = 0; i < files.length; i++) {
            const fileReader = new FileReader();
            fileReader.addEventListener("load", () => {
                const uploaded_image = fileReader.result;
                set_color_img_json(previous => {
                    previous[color].push({ name: files[i].name, dataURL: uploaded_image });
                    return { ...previous };
                })
            })
            fileReader.readAsDataURL(files[i]);
        }

        // add the new files into the color_img_json state 
        // it will be rerender and update the input[type=file] by the useEffect hook
        Array.from(target_ele.files).forEach((file) => {
            set_color_img_files(previous => {
                previous[color].items.add(file);
                return { ...previous };
            });
        })
    }

    function removeImage(image_index, color, file_name) {
        set_color_img_json(previous => {
            previous[color] = previous[color].filter((item) => item.name != file_name);
            return { ...previous }
        });

        let target_ele = document.querySelector("input[name=" + curr_img_color.replace(" ", "_") + "_img]");

        // remove the image from the json 
        let dataTransfer = new DataTransfer();
        for (let x = 0; x < target_ele.files.length; x++) {
            if (x == image_index) continue;
            dataTransfer.items.add(target_ele.files[x]);
        }

        set_color_img_files(previous => {
            previous[curr_img_color] = dataTransfer;
            return { ...previous };
        });
    }

    function submitForm(event) {
        event.preventDefault();

        fetch("/admin/portal/productItem/iron/update", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product_data)
        })
            .then(response => {
                check_redirect_request(response);
                return response.json();
            })
            .then(json => {
                console.log(json);
            })

        document.getElementById("img_form_product_code").value = product_data.product_code;
        document.getElementById("image_form").submit();
    }

    return (
        <React.Fragment>
            <h2 id="header_2_title" class="left_margin"><img src="./img/icon_back.png" onClick={() => accessResource("view=product_catalogue&sub_content_pane=iron&product=" + original_product_code)} />Edit Iron Stand Item</h2>
            <div class="left_margin">
                <form class="left_margin" id="content_form" onSubmit={submitForm}>
                    <div id="left_column">
                        <div>
                            <p>Product Name</p>
                            <input type="text" name="product_name" value={product_data.product_name} onChange={(event) => updateData(event.target.name, event.target.value)} />
                        </div>
                        <div>
                            <p>Product Code</p>
                            <input type="text" name="product_code" value={product_data.product_code} onChange={(event) => updateData(event.target.name, event.target.value)} />
                        </div>
                        <div>
                            <p>Shop Category</p>
                            <select name="shop_category" onChange={(event) => updateData(event.target.name, event.target.value)}>
                                <option selected disabled>---  Shop Category ---</option>
                                {
                                    props.metadata.shop_category.map((category) => {
                                        return <option value={category} selected={product_data.shop_category == category ? true : false}>{category}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div>
                            <p>Color of Varaition</p>
                            {
                                Object.keys(props.metadata.colors).map((color) => {
                                    return <label><input type="checkbox" value={color} name="colors" checked={product_data.colors.includes(color) ? true : false} onChange={(event) => updateColor(event.target.value, event.target.checked)} />{color}</label>
                                })
                            }
                        </div>
                        <div>
                            <p>Stock Status</p>
                            <label><input type="radio" name="stock_status" value="Available" checked={product_data.stock_status == "Available" ? true : false} onChange={(event) => updateData(event.target.name, event.target.value)} />Available</label>
                            <label><input type="radio" name="stock_status" value="Out Of Stock" checked={product_data.stock_status == "Out Of Stock" ? true : false} onChange={(event) => updateData(event.target.name, event.target.value)} />Out Of Stock</label>
                        </div>
                        <div>
                            <p>Featuring Product ?</p>
                            <label><input type="radio" name="featured" value="true" checked={product_data.featured} onChange={(event) => updateData(event.target.name, true)} />Yes</label>
                            <label><input type="radio" name="featured" value="false" checked={!product_data.featured} onChange={(event) => updateData(event.target.name, false)} />No</label>
                        </div>
                    </div>
                    <div id="right_column">
                        <div class="three_inputs">
                            <p>Dimensions (cm)</p>
                            <label>
                                Length
                                <input type="number" name="length" placeholder="Length" value={product_data.dimensions.length} onChange={(event) => updateData(event.target.name, event.target.value, "dimensions")} />

                            </label>
                            <label>
                                Width
                                <input type="number" name="width" placeholder="Width" value={product_data.dimensions.width} onChange={(event) => updateData(event.target.name, event.target.value, "dimensions")} />

                            </label>
                            <label>
                                Height
                                <input type="number" name="height" placeholder="Height" value={product_data.dimensions.height} onChange={(event) => updateData(event.target.name, event.target.value, "dimensions")} />

                            </label>
                        </div>
                        <div>
                            <p>Descriptions</p>
                            <i>* As a list, delimited by "-" character</i>
                            <textarea name="descriptions" onChange={(event) => updateData(event.target.name, event.target.value)}>
                                {product_data.descriptions.join("\n")}
                            </textarea>
                        </div>
                        <div>
                            <p>Withhold Status</p>
                            <label><input type="radio" name="withhold" value="true" checked={product_data.withhold} onChange={(event) => updateData(event.target.name, true)} />Yes</label>
                            <label><input type="radio" name="withhold" value="false" checked={!product_data.withhold} onChange={(event) => updateData(event.target.name, false)} />No</label>
                        </div>
                    </div>
                    <div id="image_pane">
                        <p>Images Upload</p>
                        <div id="tab_bar">
                            {
                                Object.keys(color_img_json).map((color) => {
                                    return <span class={color == curr_img_color ? "display" : ""} onClick={(event) => { changeColorTab(event.target, color) }}>{color}</span>
                                })
                            }
                        </div>
                        <form id="image_form" action="/admin/portal/productItem/iron/update/image_upload" method="POST" encType="multipart/form-data">
                            <input class="hide" id="img_form_product_code" name="product_code" readonly />
                            {
                                Object.keys(color_img_json).map((color) => {
                                    return <div id={color + "_img"} class={(color_img_json[color].length > 0 ? "uploaded" : "await_upload") + " img_content_pane " + (color != curr_img_color ? "hide_upload_box" : "")} onDragOver={(event) => handleDragOver(event)} onDrop={(event) => handleDrop(event)}>
                                        <p class={color_img_json[color].length > 0 ? "content_after_img_upload" : ""}>Drag and Drop your Images here ... <br /> or ...  </p>
                                        <input class={color_img_json[color].length > 0 ? "content_after_img_upload" : ""} type="file" name={color.replace(" ", "_") + "_img"} accept="image/*" onChange={(event) => uploadImages(event.target, color)} multiple />
                                        {
                                            Object.values(color_img_json[color]).map((img, index) => {
                                                return (
                                                    <span>
                                                        <img src={img.dataURL} />
                                                        <button type="button" onClick={() => removeImage(index, color, img.name)}>Remove</button>
                                                    </span>
                                                );
                                            })
                                        }
                                    </div>
                                })
                            }
                        </form>
                    </div>
                    <button type="submit">Update Item</button>
                </form>
            </div>
        </React.Fragment>
    );
}