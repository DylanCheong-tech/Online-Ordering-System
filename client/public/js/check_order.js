// check_order.js

let search_status = (new URLSearchParams(window.location.search)).get("search_status")

if (search_status == "fail") {
    displayMessageBox("No Order Records found, please check against your order ID and email address.");
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
        </React.Fragment>
    )
}

function render_search_order_result(data) {
    const root = document.getElementById("check_order_result_pane");
    const container = ReactDOM.createRoot(root);
    container.render(<OrderResult data={data} />);

}

async function searchOrder(event) {
    event.preventDefault();
    document.getElementById("check_order_result_pane").style.display = "grid";

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