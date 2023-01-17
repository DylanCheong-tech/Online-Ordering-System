// order_record_detail.jsx

function OrderRecordDetail(props) {
    return (
        <React.Fragment>
            <div class="left_margin">
                <h1>Order - ABC 1234</h1>
            </div>

            <div id="order_action_btn_bar">
                <button type="button">Confirm</button>
                <button type="button">Cancel</button>
                <button type="button">Completed</button>
                <button type="button">Edit</button>
                <button type="button">Delete</button>
            </div>

            <div id="order_details_pane">
                <span className="label_name">Order ID : </span>
                <span className="value">xxxxxxxxxx</span>
                <span className="label_name">Status : </span>
                <span className="value">xxxxxxxxxx</span>

                <span className="label_name">Created Time : </span>
                <span className="value">xxxxxxxxxx</span>
                <span className="label_name">Confirmed Time : </span>
                <span className="value">xxxxxxxxxx</span>
                <span className="label_name">Cancelled Time : </span>
                <span className="value">xxxxxxxxxx</span>
                <span className="label_name">Completed Time : </span>
                <span className="value">xxxxxxxxxx</span>

                <span className="label_name">Email : </span>
                <span className="value">xxxxxxxxxx</span>
                <span className="label_name">Contact : </span>
                <span className="value">xxxxxxxxxx</span>

                <span className="label_name">Order Message : </span>
                <span className="value span3">xxxxxxxxxx</span>

                <span className="label_name span4">Order Item(s) :</span>
                <div className="span4">
                    <span>1.</span>
                    <span>Catalogue Category</span>
                    <span>Product Code</span>
                    <span>Color</span>
                    <span>Quantity</span>
                </div>
                <div className="span4">
                    <span>1.</span>
                    <span>Catalogue Category</span>
                    <span>Product Code</span>
                    <span>Color</span>
                    <span>Quantity</span>
                </div>
                <div className="span4">
                    <span>1.</span>
                    <span>Catalogue Category</span>
                    <span>Product Code</span>
                    <span>Color</span>
                    <span>Quantity</span>
                </div>
                <div className="span4">
                    <span>1.</span>
                    <span>Catalogue Category</span>
                    <span>Product Code</span>
                    <span>Color</span>
                    <span>Quantity</span>
                </div>
            </div>
        </React.Fragment>
    );
}