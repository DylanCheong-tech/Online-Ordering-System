// order_record_detail.jsx

function OrderRecordDetail(props) {
    let data = props.order;

    function reloadPage() {
        window.location.reload()
    }

    // delete order handler
    async function deleteOrder(order_id) {
        let response = await fetch("/order/admin/order/" + order_id + "/delete", {
            method: "POST"
        });

        check_redirect_request(response);

        if (response.status == "200") {
            displayMessageBox("Order: " + order_id + " is deleted !", () => { window.location.href = "/admin/home_page.html?view=order_management&sub_content_pane=order_details" });
        }
        else
            console.log("Implement the error pop up here ")
    }

    // confirm order handler
    async function confirmOrder(order_id) {
        let response = await fetch("/order/admin/order/" + order_id + "/confirm", {
            method: "POST"
        });

        check_redirect_request(response);

        if (response.status == "200") {
            displayMessageBox("Order: " + order_id + " is confirmed !", reloadPage);
        }
        else
            displayMessageBox("Something went wrong, please try again");
    }

    // cancel order handler
    async function cancelOrder(order_id) {
        let response = await fetch("/order/admin/order/" + order_id + "/cancel", {
            method: "POST"
        });

        check_redirect_request(response);

        if (response.status == "200") {
            displayMessageBox("Order: " + order_id + " is cancelled !", reloadPage);
        }
        else
            displayMessageBox("Something went wrong, please try again");

    }

    // complete order handler
    async function completeOrder(order_id) {
        let response = await fetch("/order/admin/order/" + order_id + "/complete", {
            method: "POST"
        });

        check_redirect_request(response);

        if (response.status == "200") {
            displayMessageBox("Order: " + order_id + " is completed !", reloadPage);
        }
        else
            displayMessageBox("Something went wrong, please try again");

    }

    return (
        <React.Fragment>
            <div id="order_title_banner" class="left_margin">
                <img src="./img/icon_back.png" onClick={() => accessResource("view=order_management&sub_content_pane=order_details")} />
                <h1>Order -- {data.order_id}</h1>
            </div>

            <div id="order_action_btn_bar">
                <button type="button" onClick={() => confirmOrder(data.order_id)} disabled={data.order_status != "CREATED" ? true : false} >Confirm</button>
                <button type="button" onClick={() => cancelOrder(data.order_id)} disabled={["CANCELLED", "COMPLETED"].includes(data.order_status) ? true : false}>Cancel</button>
                <button type="button" onClick={() => completeOrder(data.order_id)} disabled={data.order_status != "CONFIRMED" ? true : false}>Completed</button>
                <button type="button" onClick={() => accessResource("view=order_management&sub_content_pane=edit_order_record&order_id=" + data.order_id)}>Edit</button>
                <button type="button" onClick={() => deleteOrder(data.order_id)}>Delete</button>
            </div>

            <div id="order_details_pane">
                <span className="label_name">Order ID : </span>
                <span className="value">{data.order_id}</span>
                <span className="label_name">Status : </span>
                <span className="value">{data.order_status}</span>

                <span className="label_name">Created Time : </span>
                <span className="value">{(new Date(data.order_created_time)).toLocaleString()}</span>
                <span className="label_name">Confirmed Time : </span>
                <span className="value">{data.order_confirmed_time != "N/A" ? (new Date(data.order_confirmed_time)).toLocaleString() : "N/A"}</span>
                <span className="label_name">Cancelled Time : </span>
                <span className="value">{data.order_cancelled_time != "N/A" ? (new Date(data.order_cancelled_time)).toLocaleString() : "N/A"}</span>
                <span className="label_name">Completed Time : </span>
                <span className="value">{data.order_completed_time != "N/A" ? (new Date(data.order_completed_time)).toLocaleString() : "N/A"}</span>
                <span className="label_name">Customer Last Modified : </span>
                <span className="value span3">{data.customer_last_modified ? (new Date(data.customer_last_modified)).toLocaleString() : "N/A"}</span>

                <span className="label_name">Name : </span>
                <span className="value">{data.name}</span>
                <span className="label_name">Contact : </span>
                <span className="value">{data.contact}</span>

                <span className="label_name">Email : </span>
                <span className="value">{data.email}</span>
                <span className="label_name">Address : </span>
                <span className="value">{data.address}</span>

                <span className="label_name">Order Message : </span>
                <span className="value span3">{data.order_message ? data.order_message : "No message from the customer ..."}</span>

                <span className="label_name span4">Order Item(s) :</span>
                <div className="span4 item_header">
                    <span>No.</span>
                    <span>Catalogue Category</span>
                    <span>Product Code</span>
                    <span>Product Color</span>
                    <span>Quantity</span>
                </div>
                {
                    data.order_items.map((item, index) => {
                        return (
                            <div key={"item-" + index} className="span4">
                                <span>{index + 1} .</span>
                                <span>{item.catalogue_category}</span>
                                <span>{item.item_code}</span>
                                <span>{item.color}</span>
                                <span>{item.quantity}</span>
                            </div>
                        )
                    })
                }
            </div>
        </React.Fragment>
    );
}