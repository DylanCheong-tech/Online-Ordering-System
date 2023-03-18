// customer_list.jsx

// React Componenet 
function CustomerList(props) {
    let customer_list = props.data;


    return (
        <React.Fragment>
            <div class="left_margin">
                <h1>Customer List</h1>
            </div>

            <div id="customer_list_table">
                <div id="header_bar">
                    <span>No.</span>
                    <span>Customer Name</span>
                    <span>Email</span>
                    <span>Contact Number</span>
                    <span>Address</span>
                </div>
                {
                    customer_list.length != 0 ?
                        customer_list.map((customer, index) => {
                            return (
                                <div key={"customer-" + index} className={`content_table_row ${(index + 1) % 2 == 0 ? "even_table_row" : ""}`}>
                                    <span>{index + 1}</span>
                                    <span>{customer.name}</span>
                                    <span>{customer.email}</span>
                                    <span>{customer.contact}</span>
                                    <span>{customer.address}</span>
                                </div>
                            )
                        })
                        :
                        <div id="no_existing_customer">
                            No Existing Customer ... 
                        </div>
                }
            </div>
        </React.Fragment>
    );
}