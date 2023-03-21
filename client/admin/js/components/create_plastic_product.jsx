// create_plastic_product.jsx

// React Component : Create Plastic Product sub pane
function CreatePlasticProduct(props) {
    const [color_img_json, set_color_img_json] = React.useState({});
    const [curr_img_color, set_curr_img_color] = React.useState();
    let image_upload_status = true;

    function updateColor(color, checked) {
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
        })
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
        let dataTransfer = new DataTransfer();
        let target_ele = document.querySelector("input[name=" + curr_img_color + "_img]");

        // merge the existing and the newly dropped images files together 
        Array.from(target_ele.files).forEach((file) => {
            dataTransfer.items.add(file);
        })
        Array.from(event.dataTransfer.files).forEach((file) => {
            dataTransfer.items.add(file);
        })
        target_ele.files = dataTransfer.files;

        // append the new dropped images to preview 
        uploadImages(event.dataTransfer, curr_img_color);
    }

    function uploadImages(target_ele, color) {
        let files = target_ele.files;

        for (let i = 0; i < files.length; i++) {
            const fileReader = new FileReader();
            fileReader.addEventListener("load", () => {
                const uploaded_image = fileReader.result;
                set_color_img_json(previous => {
                    previous[color].push(uploaded_image);
                    return { ...previous };
                })
            })
            fileReader.readAsDataURL(files[i]);
        }
    }

    function removeImage(image_index, color) {
        set_color_img_json(previous => {
            previous[color].splice(image_index, 1);
            return { ...previous }
        });

        let target_ele = document.querySelector("input[name=" + curr_img_color.replace(" ", "_") + "_img]");
        // the files array index will be the same with the color json state object 
        // since the color json array ar build based on the input control at first
        let dt = new DataTransfer();
        for (let x = 0; x < target_ele.files.length; x++) {
            if (x == image_index) continue;
            dt.items.add(target_ele.files[x])
        }

        target_ele.files = dt.files;
    }

    function submitForm() {
        let product_code = submitContent();
        Array.from(document.getElementsByClassName("img_form_product_code")).forEach((input) => input.value = product_code);
        let time = 0;
        Array.from(document.getElementsByClassName("image_upload_submit_btn")).forEach((form) => {
            setTimeout(() => {
                form.click();
            }, time);
            time = time + 5000;
        });

        setTimeout(() => {
            // pop up message
            if (image_upload_status)
            displayMessageBox("Product Created Successfully !", () => {
                window.location.href = "/admin/home_page.html?view=product_catalogue&sub_content_pane=plastic&product=" + product_code;
            })
            else 
            displayMessageBox("Operation Failed ! Please try again later ... ", () => {
                console.log("Upload Failed");
            })
        }, time + 2000);
    }

    function submitContent() {
        let form = document.getElementById("content_form");
        let form_data = new FormData(form);
        let body_data = {}
        body_data.colors = [];

        for (const [key, value] of form_data.entries()) {
            if (key == "colors") {
                body_data[key].push(value);
                continue;
            }
            if (key.match(/_img$/ig)) {
                if (!body_data[key]) body_data[key] = [];
                body_data[key].push(value);
                continue;
            }
            if (key == "withhold") {
                body_data[key] = (value == "true");
                continue;
            }

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
            .then(response => {
                check_redirect_request(response);
                return response.json();
            })
            .then(json => {
                console.log(json);
            })
            .catch(console.log);

        return body_data.product_code;
    }

    async function imageSubmit(event) {
        event.preventDefault();

        const form = event.target;

        let result = await fetch(form.action, {
            method: form.method,
            body: new FormData(form),
        })

        if (result.status == "200")
            image_upload_status = image_upload_status && true;
        else
            image_status = false;
    }

    return (
        <React.Fragment>
            <h2 id="header_2_title" class="left_margin"><img src="./img/icon_back.png" onClick={() => accessResource("view=product_catalogue&sub_content_pane=plastic")} />Create a Plastic Pot Item</h2>
            <div class="left_margin">
                <form class="left_margin" id="content_form" onSubmit={submitContent}>
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
                                {
                                    props.metadata.shop_category.map((category) => {
                                        return <option value={category}>{category}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div class="color_section">
                            <p>Color of Varaition</p>
                            {
                                Object.keys(props.metadata.colors).map((color) => {
                                    return <label><input type="checkbox" value={color} name="colors" onChange={(event) => updateColor(event.target.value, event.target.checked)} />{color}</label>
                                })
                            }
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
                            <label>
                                Length
                                <input type="number" name="length" placeholder="Length" />
                            </label>
                            <label>
                                Width
                                <input type="number" name="width" placeholder="Width" />
                            </label>
                            <label>
                                Height
                                <input type="number" name="height" placeholder="Height" />
                            </label>
                        </div>
                        <div class="three_inputs">
                            <p>Diameters (cm)</p>
                            <label>
                                Inside
                                <input type="number" name="inside" placeholder="Inside" />
                            </label>
                            <label>
                                Outside
                                <input type="number" name="outside" placeholder="Outside" />
                            </label>
                            <label>
                                Lower
                                <input type="number" name="lower" placeholder="Lower" />
                            </label>
                        </div>
                        <div>
                            <p>Descriptions</p>
                            <i>* As a list, delimited by "-" character</i>
                            <textarea name="descriptions">
                                - xxxx
                            </textarea>
                        </div>
                        <div>
                            <p>Withhold Status</p>
                            <label><input type="radio" name="withhold" value="true" />Yes</label>
                            <label><input type="radio" name="withhold" value="false" />No</label>
                        </div>
                    </div>
                </form>
                <div id="image_pane">
                    <p>Images Upload</p>
                    <div id="tab_bar">
                        {
                            Object.keys(color_img_json).map((color) => {
                                return <span class={color == curr_img_color ? "display" : ""} onClick={(event) => { changeColorTab(event.target, color) }}>{color}</span>
                            })
                        }
                    </div>
                    {
                        Object.keys(color_img_json).map((color) => {
                            return <form id="image_form" action="/admin/portal/productItem/plastic/create/image_upload" method="POST" encType="multipart/form-data" onSubmit={imageSubmit}>
                                <input class="hide img_form_product_code" name="product_code" readonly />
                                <div id={color + "_img"} class={(color_img_json[color].length > 0 ? "uploaded" : "await_upload") + " img_content_pane " + (color != curr_img_color ? "hide_upload_box" : "")} onDragOver={(event) => handleDragOver(event)} onDrop={(event) => handleDrop(event)}>
                                    <p class={color_img_json[color].length > 0 ? "content_after_img_upload" : ""}>Drag and Drop your Images here ... <br /> or ...  </p>
                                    <input class={color_img_json[color].length > 0 ? "content_after_img_upload" : ""} type="file" name={color.replace(" ", "_") + "_img"} accept="image/*" onChange={(event) => uploadImages(event.target, color)} multiple />
                                    {
                                        Object.values(color_img_json[color]).map((img, index) => {
                                            return (
                                                <span>
                                                    <img src={img} />
                                                    <button type="button" onClick={() => removeImage(index, color)}>Remove</button>
                                                </span>
                                            );
                                        })
                                    }
                                    <input class="hide image_upload_submit_btn" type="submit" />
                                </div>
                            </form>
                        })
                    }
                    <button type="button" onClick={submitForm}>Create Item</button>
                </div>
            </div>
        </React.Fragment>
    );
}