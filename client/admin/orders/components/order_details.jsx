// order_details.jsx

// React Component : Order List Table 
function OrderContentTable(props) {
    if (props.order_list && props.order_list.length > 0)
        return (
            <React.Fragment>
                <div id="header_bar">
                    <span>Order ID</span>
                    <span>Email</span>
                    <span>Contact Number</span>
                    <span>Total Items</span>
                    <span>Status</span>
                    <span>Order Time</span>
                </div>
                {
                    props.order_list.map((order, index) => {
                        return (
                            <div key={"order-" + index} className="content_table_row">
                                <a href={window.location.origin + window.location.pathname + "?view=order_management&sub_content_pane=view_order_record&order_id=" + order.order_id}>{order.order_id}</a>
                                <span>{order.email}</span>
                                <span>{order.contact}</span>
                                <span>{order.total_items}</span>
                                <span>{order.order_status}</span>
                                <span>{(new Date(order.order_created_time)).toLocaleString()}</span>
                            </div>
                        )
                    })
                }
            </React.Fragment>
        );
    else
    return (
        <React.Fragment>
            <h2>No Orders for the system database ...</h2>
        </React.Fragment>
    )
}

// main component
function OrderDetails(props) {
    function changeStatusTab(event, status) {
        displayOrderDetailsWithStatus(status);

        for (let item of document.getElementsByClassName("selected"))
            item.classList.remove("selected");

        event.target.classList.add("selected");
    }

    return (
        <React.Fragment>
            <div id="order_details_title_banner" class="left_margin">
                <h1>Order Details</h1>
                <button type="button" onClick={() => accessResource("view=order_management&sub_content_pane=create_order_record")}>Create New Order</button>
            </div>

            <div id="order_tab_bar">
                <span className="selected" onClick={() => displayOrderDetails()}>All Orders</span>
                <span onClick={(event) => changeStatusTab(event, "CREATED")}>New Orders</span>
                <span onClick={(event) => changeStatusTab(event, "CONFIRMED")}>Confirmed Orders</span>
                <span onClick={(event) => changeStatusTab(event, "CANCELLED")}>Cancelled Orders</span>
                <span onClick={(event) => changeStatusTab(event, "COMPLETED")}>Completed Orders</span>
            </div>

            <div id="order_search_filter_bar">
                <input type="text" placeholder="Search ... " />
                <select>
                    <option disabled selected>Filter ...</option>
                </select>
                <button type="button">Export PDF</button>
            </div>

            <div id="order_content_pane">
                <OrderContentTable order_list={props.order_list} />
            </div>

        </React.Fragment>
    )
}