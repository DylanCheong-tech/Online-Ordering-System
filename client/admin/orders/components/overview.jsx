// overview.jsx

function OrderManagementDashboard(props) {
    return (
        <React.Fragment>
            <div class="left_margin">
                <h1>Order Management Dashboard</h1>
            </div>

            <div id="dashboard_content_pane">
                <div id="summary_tab">
                    <span>New Orders : xxx</span>
                    <span>Confirmed Orders : xxx</span>
                    <span>Cancelled Orders : xxx</span>
                    <span>Total Customers : xxx</span>
                </div>

                <div id="top_product_card">
                    <h3>Top Products</h3>
                    <p>5 most ordered items from you online store</p>

                    <div id="header_bar">
                        <span>Rank</span>
                        <span>Product Code</span>
                        <span>Catalogue Category</span>
                        <span>Quantity</span>
                    </div>

                    <div className="content_table_row">
                        <span>1</span>
                        <span>CP-1234</span>
                        <span>Plastic</span>
                        <span>14</span>
                    </div>
                    <div className="content_table_row">
                        <span>1</span>
                        <span>CP-1234</span>
                        <span>Plastic</span>
                        <span>14</span>
                    </div>
                    <div className="content_table_row">
                        <span>1</span>
                        <span>CP-1234</span>
                        <span>Plastic</span>
                        <span>14</span>
                    </div>
                </div>

                <div id="monthly_order_card">
                    <h3>Monthly Orders Analysis</h3>
                    <img src="../admin/orders/img/sample1.png" />
                </div>
            </div>

        </React.Fragment>
    )
}