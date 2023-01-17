// order_details.jsx

// main component
function OrderDetails(props) {
    return (
        <React.Fragment>
            <div id="order_details_title_banner" class="left_margin">
                <h1>Order Details</h1>
                <button type="button">Create New Order</button>
            </div>

            <div id="order_tab_bar">
                <span className="selected">All Orders</span>
                <span>New Orders</span>
                <span>Confrimed Orders</span>
                <span>Cancelled Orders</span>
                <span>Completed Orders</span>
            </div>

            <div id="order_search_filter_bar">
                <input type="text" placeholder="Search ... " />
                <select>
                    <option disabled selected>Filter ...</option>
                </select>
                <button type="button">Export PDF</button>
            </div>

            <div id="order_content_pane">
                <div id="header_bar">
                    <span>Order ID</span>
                    <span>Email</span>
                    <span>Contact Number</span>
                    <span>Total Items</span>
                    <span>Status</span>
                    <span>Order Time</span>
                </div>
                <div className="content_table_row">
                    <a href="">ABC12345</a>
                    <span>johnsmith@mail.com</span>
                    <span>016 - 1234 5678</span>
                    <span>14</span>
                    <span>New</span>
                    <span>12-01-2023 14:00</span>
                </div>
                <div className="content_table_row">
                    <a href="">ABC12345</a>
                    <span>johnsmith@mail.com</span>
                    <span>016 - 1234 5678</span>
                    <span>14</span>
                    <span>New</span>
                    <span>12-01-2023 14:00</span>
                </div>
                <div className="content_table_row">
                    <a href="">ABC12345</a>
                    <span>johnsmith@mail.com</span>
                    <span>016 - 1234 5678</span>
                    <span>14</span>
                    <span>New</span>
                    <span>12-01-2023 14:00</span>
                </div>
            </div>

        </React.Fragment>
    )
}