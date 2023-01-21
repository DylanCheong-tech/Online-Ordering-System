// overview.jsx

function OrderManagementDashboard(props) {
    let data = props.data;

    return (
        <React.Fragment>
            <div class="left_margin">
                <h1>Order Management Dashboard</h1>
            </div>

            <div id="dashboard_content_pane">
                <div id="summary_tab">
                    <span>New Orders : {data.CREATED}</span>
                    <span>Confirmed Orders : {data.CONFIRMED}</span>
                    <span>Cancelled Orders : {data.CANCELLED}</span>
                    <span>Completed Orders : {data.COMPLETED}</span>
                    <span>Total Customers : {data.customer_count}</span>
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

                    {
                        data.top_products.map((product, index) => {
                            return (
                                <div key={"top_product-" + index} className="content_table_row">
                                    <span>{index + 1}</span>
                                    <span>{product._id.catalogue_category}</span>
                                    <span>{product._id.item_code}</span>
                                    <span>{product.order_count}</span>
                                </div>
                            )
                        })
                    }
                </div>

                <div id="monthly_order_card">
                    <h3>Monthly Orders Analysis</h3>
                    <img src="../admin/orders/img/sample1.png" />
                </div>
            </div>

        </React.Fragment>
    )
}