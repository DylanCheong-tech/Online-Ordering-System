// product.js 
const { useState } = React

let category = (new URLSearchParams(window.location.search)).get("category");
let product_code = (new URLSearchParams(window.location.search)).get("product_code");

// React Component : Image Pane
function ImagePane(props) {
    let images_arr = Object.values(props.images);
    let [current_image_idx, set_current_image_idx] = useState(0);

    function prev() {
        if (current_image_idx > 0) {
            update_thumbnail_border(current_image_idx - 1);
            set_current_image_idx(current_image_idx - 1);
        }
    }

    function next() {
        if (current_image_idx < images_arr.length - 1) {
            update_thumbnail_border(current_image_idx + 1);
            set_current_image_idx(current_image_idx + 1);
        }
    }

    function update_thumbnail_border(index) {
        document.getElementsByClassName("on_display")[0].classList.remove("on_display");
        document.getElementById("thumbnail_" + index).classList.add("on_display");
    }

    return (
        <div id="image_pane">
            <div id="image_carousel">
                <img class="icon" src="../img/icon_previous.svg" onClick={prev} />
                <img src={images_arr[current_image_idx]} />
                <img class="icon" src="../img/icon_next.svg" onClick={next} />
            </div>

            <div id="image_thumbnails">
                {
                    images_arr.map((img, index) => {
                        return <img id={"thumbnail_" + index} src={img} className={index == 0 ? "on_display" : ""} onClick={() => {
                            set_current_image_idx(index);
                            update_thumbnail_border(index);
                        }} />
                    })
                }
            </div>

        </div>
    );
}

// React Component : Content Pane 
function ContentPane(props) {
    let info = props.info;
    let diameter_content = "";
    if (info.diameters) {
        diameter_content =
            <React.Fragment>
                Inside Diameter : {info.diameters.inside} cm <br />
                Outside Diameter : {info.diameters.outside} cm <br />
                Lower Diameter : {info.diameters.lower} cm <br />
            </React.Fragment>
    }
    return (
        <div id="description_pane">
            <h2>{info.product_code}</h2>
            <p>
                Stock Status : {info.stock_status} <br />
                Material : {info.material} <br />
                Color : {info.colors.join(", ")} <br />
                {diameter_content}
                Height : {info.dimensions.height} cm <br />
                Length : {info.dimensions.length} cm <br />
                Width : {info.dimensions.width} cm <br />
                Descriptions :
                <ol>
                    {info.descriptions.map((element) => {
                        return <li>{element}</li>
                    })}
                </ol>
            </p>
        </div>
    );
}

// React Component : Add to cart pane
function OrderPane(props) {
    return (
        <div id="product_order_pane">
            <div id="product_order_info">
                <h2>Add to your order !</h2>
            </div>
            <form action="">
                <fieldset>
                    <legend>Color Variations</legend>

                    <label><input type="radio" name="color" value="" />Black</label>
                    <label><input type="radio" name="color" value="" />Black</label>
                    <label><input type="radio" name="color" value="" />Black</label>
                    <label><input type="radio" name="color" value="" />Black</label>
                    <label><input type="radio" name="color" value="" />Black</label>
                    <label><input type="radio" name="color" value="" />Black</label>
                </fieldset>

                <label>Quantity : <input type="number" name="quantity" min="1" defaultValue="1" /></label>

                <span>Availability : <span className="green_color_text">In Stock</span></span>

                <button type="submit">Add to cart</button>
            </form>
        </div>
    );
}

function render(data) {
    console.log("The data is fetched and ready");
    console.log(data);

    const root = document.getElementById("content_pane");
    const container = ReactDOM.createRoot(root);
    container.render(
        <React.Fragment>
            <ImagePane images={data.images} />
            <ContentPane info={data} />
            <OrderPane />
        </React.Fragment>
    );

    // update the title banner 
    document.getElementById("order_cart_banner_title").innerHTML = data.product_name;
}

fetch("/public/product/" + category + "/" + product_code)
    .then((res) => res.json())
    .then((data) => render(data.response));