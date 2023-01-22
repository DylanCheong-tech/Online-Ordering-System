// order_form.jsx

function OrderForm(props) {
    async function getShopCategory(index, catalogue_category) {
        let response = await fetch("/order/admin/order/info/" + catalogue_category + "/shop_category");
        check_redirect_request(response);
        let json = await response.json();

        set_shop_category_2D_list(prev => {
            prev[index] = json.shop_categories;
            return [...prev]
        });
    }

    async function getProductCodes(index, catalogue_category, shop_category) {
        let response = await fetch("/order/admin/order/info/" + catalogue_category + "/" + shop_category + "/product_codes");
        check_redirect_request(response);
        let json = await response.json();

        set_product_codes_2D_list(prev => {
            prev[index] = json.product_codes;
            return [...prev]
        });
    }

    async function getProductColors(index, catalogue_category, shop_category, product_code) {
        let response = await fetch("/order/admin/order/info/" + catalogue_category + "/" + shop_category + "/" + product_code + "/colors");
        check_redirect_request(response);
        let json = await response.json();

        set_product_color_2D_list(prev => {
            prev[index] = json.colors;
            return [...prev]
        });
    }

    function update_order_item_value(index, key, value) {
        set_order_item_list(prev => {
            prev[index][key] = key == "quantity" ? parseInt(value) : value;
            return [...prev];
        })
    }

    function submitForm(event) {
        document.getElementById("hidden_items_input").value = JSON.stringify(order_item_list);
    }

    let order_data = props.order;

    let new_order_item = {
        "catalogue_category": "",
        "shop_category": "",
        "item_code": "",
        "quantity": 1,
        "color": "",
    };

    let order_item = order_data ? order_data.order_items : [new_order_item];

    let [order_item_list, set_order_item_list] = React.useState([...order_item]);

    let array_2d_size = []
    for (let item of order_item_list) {
        array_2d_size.push([]);
    }

    let [shop_category_2D_list, set_shop_category_2D_list] = React.useState(array_2d_size);
    let [product_codes_2D_list, set_product_codes_2D_list] = React.useState(array_2d_size);
    let [product_color_2D_list, set_product_color_2D_list] = React.useState(array_2d_size);

    React.useEffect(() => {
        async function fetch_data() {
            if (order_data) {
                for (let i = 0; i < order_item_list.length; i++) {
                    let item = order_item_list[i];

                    await getShopCategory(i, item.catalogue_category);
                    await getProductCodes(i, item.catalogue_category, item.shop_category);
                    await getProductColors(i, item.catalogue_category, item.shop_category, item.item_code);

                }
            }
        }
        fetch_data()

    }, [order_data]);

    return (
        <div id="order_form_pane">
            <h1>{order_data ? "Edit Order" : "Create Order"}</h1>
            <hr />
            <form action={order_data ? "/order/admin/order/" + order_data.order_id + "/edit" : "/order/admin/order/create"} method="POST" onSubmit={(event) => submitForm(event)}>
                <label>Name : </label>
                <input type="text" name="name" placeholder="Name" defaultValue={order_data ? order_data.name : ""} required />
                <label>Email : </label>
                <input type="email" name="email" placeholder="Email" defaultValue={order_data ? order_data.email : ""} required />

                <label>Contact : </label>
                <input type="text" name="contact" placeholder="Phone Num / WhatsApp Num" defaultValue={order_data ? order_data.contact : ""} required />
                <label>Address : </label>
                <input type="text" name="address" placeholder="Address" defaultValue={order_data ? order_data.address : ""} required />

                <label>Order Message : </label>
                <textarea name="memo" placeholder="Order Message / Memo" defaultValue={order_data ? order_data.order_message : ""}></textarea>

                <label className="span4">Order Items :</label>
                <div className="span4 header">
                    <span>No.</span>
                    <span>Catalogue Category</span>
                    <span>Shop Category</span>
                    <span>Product Code</span>
                    <span>Color</span>
                    <span>Quantity</span>
                </div>
                {
                    order_item_list.map((item, index) => {
                        return (
                            <div key={"order_item-" + index} className="span4">
                                <span>{index + 1}</span>
                                <span>
                                    <select value={item.catalogue_category} onChange={(event) => { update_order_item_value(index, "catalogue_category", event.target.value); getShopCategory(index, event.target.value) }}>
                                        <option selected disabled value="">-- Catalogue Category --</option>
                                        {
                                            props.catalogue_categories.map((category, index) => {
                                                return (
                                                    <option key={"catalogue_" + index} value={category}>{category}</option>
                                                );
                                            })
                                        }
                                    </select>
                                </span>
                                <span>
                                    <select value={item.shop_category} onChange={(event) => { update_order_item_value(index, "shop_category", event.target.value); getProductCodes(index, order_item_list[index].catalogue_category, event.target.value) }}>
                                        <option selected disabled value="">-- Shop Category --</option>
                                        {
                                            shop_category_2D_list[index].map((category, index_1) => {
                                                return (
                                                    <option key={"shop_" + index + "_" + index_1} value={category}>{category}</option>
                                                );
                                            })
                                        }
                                    </select>
                                </span>
                                <span>
                                    <select value={item.item_code} onChange={(event) => { update_order_item_value(index, "item_code", event.target.value); getProductColors(index, order_item_list[index].catalogue_category, order_item_list[index].shop_category, event.target.value) }}>
                                        <option selected disabled value="">-- Product Code --</option>
                                        {
                                            product_codes_2D_list[index].map((product_code, index_2) => {
                                                return (
                                                    <option key={"product_" + index + "_" + index_2} value={product_code}>{product_code}</option>
                                                );
                                            })
                                        }
                                    </select>
                                </span>
                                <span>
                                    <select value={item.color} onChange={(event) => update_order_item_value(index, "color", event.target.value)}>
                                        <option selected disabled value="">-- Color --</option>
                                        {
                                            product_color_2D_list[index].map((color, index_3) => {
                                                return (
                                                    <option key={"color_" + index + "_" + index_3} value={color}>{color}</option>
                                                );
                                            })
                                        }
                                    </select>
                                </span>
                                <span>
                                    <input type="number" value={item.quantity} placeholder="Quantity" min="1" onChange={(event) => update_order_item_value(index, "quantity", event.target.value)} />
                                </span>
                            </div>
                        )
                    })
                }

                <input id="hidden_items_input" className="hidden" type="text" name="items" readOnly />

                <button type="button" onClick={() => {
                    set_order_item_list(prev => [...prev, new_order_item]);
                    set_shop_category_2D_list(prev => [...prev, []]);
                    set_product_codes_2D_list(prev => [...prev, []]);
                    set_product_color_2D_list(prev => [...prev, []]);
                }}>
                    Add Item ...
                </button>

                <div className="span4 button_row">
                    <button type="button" onClick={() => accessResource(order_data ? "view=order_management&sub_content_pane=view_order_record&order_id=" + order_data.order_id : "view=order_management&sub_content_pane=order_details")}>Cancel</button>
                    <button type="submit">{order_data ? "Update Order" :"Create Order"}</button>
                </div>

            </form>
        </div>
    );
}