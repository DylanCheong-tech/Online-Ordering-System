// check_order.js

let edit_status = (new URLSearchParams(window.location.search)).get("edit_status");

if (edit_status) {
    let message = "";
    if (edit_status == "success")
        message = "You order has been updated !";
    else if (edit_status == "prohibited")
        message = "Your order is confirmed and cannot be updated. Please contact our customer service. ";
    else if (edit_status == "fail")
        message = "Sorry something went wrong, please try again later... ";

    displayMessageBox(message);
}

// Search Order Result Component 
function OrderResult(props) {
    let data = props.data;

    return (
        <React.Fragment>
            <h2 className="span4">Search Result</h2>
            <span className="label_name">Order ID : </span>
            <span className="value span3">{data.order_id}</span>

            <span className="label_name">Contact : </span>
            <span className="value">{data.contact}</span>
            <span className="label_name">Email : </span>
            <span className="value">{data.email}</span>

            <span className="label_name">Delivery Address : </span>
            <span className="value">{data.address}</span>
            <span className="label_name">Status : </span>
            <span className="value">{data.order_status}</span>

            <span className="label_name">Order Created Time : </span>
            <span className="value">{(new Date(data.order_created_time)).toLocaleString()}</span>
            <span className="label_name">Order Confirmed Time : </span>
            <span className="value">{data.order_confirmed_time != "N/A" ? (new Date(data.order_confirmed_time)).toLocaleString() : "N/A"}</span>
            <span className="label_name">Order Cancelled Time : </span>
            <span className="value">{data.order_cancelled_time != "N/A" ? (new Date(data.order_cancelled_time)).toLocaleString() : "N/A"}</span>
            <span className="label_name">OrderCompleted Time : </span>
            <span className="value">{data.order_completed_time != "N/A" ? (new Date(data.order_completed_time)).toLocaleString() : "N/A"}</span>

            <span className="label_name">Order Message : </span>
            <span className="value span3">{data.order_message ? data.order_message : "No message from the customer ..."}</span>

            <span className="label_name span4 order_items_label">Order Item(s) :</span>
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
                        <div id={"order_item_" + index} className="span4">
                            <span>{index + 1} .</span>
                            <span>{item.catalogue_category}</span>
                            <span>{item.item_code}</span>
                            <span>{item.color}</span>
                            <span>{item.quantity}</span>
                        </div>
                    );
                })
            }
            {
                data.order_status == "CREATED" ? <button className="span4" type="button" onClick={() => render_edit_order(data)}>Edit Order</button> : ""
            }
        </React.Fragment>
    )
}

// Edit Order Componenet 
function EditOrder(props) {
    let data = props.data;

    return (
        <React.Fragment>
            <h2>Edit Your Order</h2>
            <p>You can only edit your persinal particulars. If you need to amend the order items, kindly contact the customer service.</p>
            <form action="/order/visitor/edit" method="POST">

                <label>
                    Contact :
                    <input type="text" name="contact" placeholder="Contact" defaultValue={data.contact} />
                </label>
                <label>
                    Email :
                    <input type="email" name="email" placeholder="Email" defaultValue={data.email} />
                </label>
                <label>
                    Delivery Address :
                    <input type="text" name="address" placeholder="Delivery Address" defaultValue={data.address} />
                </label>

                <label>
                    Order Message :
                    <textarea name="memo" placeholder="Order Message" defaultValue={data.order_message}></textarea>
                </label>

                <input className="hidden" type="text" name="orderID" value={data.order_id} readonly />
                <input className="hidden" type="email" name="origin_email" value={data.email} readonly />

                <button className="span2" type="submit">Confirm Edit</button>
            </form>
        </React.Fragment>
    );
}

function render_search_order_result(data) {
    // hide the edit pane and show the result pane
    document.getElementById("edit_order_pane").style.display = "none";
    document.getElementById("check_order_result_pane").style.display = "grid";
    const root = document.getElementById("check_order_result_pane");
    const container = ReactDOM.createRoot(root);
    container.render(<OrderResult data={data} />);

}

function render_edit_order(data) {
    // hide the result pane and show the edit pane
    document.getElementById("check_order_result_pane").style.display = "none";
    document.getElementById("edit_order_pane").style.display = "flex";

    const root = document.getElementById("edit_order_pane");
    const container = ReactDOM.createRoot(root);
    container.render(<EditOrder data={data} />);
}

async function searchOrder(event) {
    event.preventDefault();

    let orderID = document.querySelector("form input[name=orderID]").value.trim();
    let email = document.querySelector("form input[name=email]").value.trim();

    let response = await fetch(event.target.action + "/" + orderID + "/" + email);
    let json = await response.json();

    if (json.search_status && json.search_status == "fail") {
        displayMessageBox("No Order Records found, please check against your order ID and email address.");
        return;
    }

    render_search_order_result(json);
}