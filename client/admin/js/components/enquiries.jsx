// enquiries.jsx

// React Component : Enquiries sub pane
function Enquiries(props) {
    let enquiry_arr = props.data;

    async function deleteMessage(event, message_id) {
        let result = await fetch("/admin/portal/enquiry/" + message_id + "/delete", {
            method: "DELETE"
        });

        if (result.redirected) {
            window.location.href = "/admin/home_page.html?view=enquiries&sub_content_pane=all";
        }
    }

    return (
        <React.Fragment>
            <h1 class="left_margin">Enquiries</h1>
            <p class="content_attributes left_margin">
                Unresolve Message : xxx <br />
                Resolved Message : xxx <br />
            </p>
            <div id="search_filter" class="left_margin">
                <input id="search_bar" placeholder="Search ... " />
                <select id="filter_drop_down">
                    <option disabled selected>--- Filter ----</option>
                    <option>xxxx</option>
                    <option>xxxx</option>
                    <option>xxxx</option>
                    <option>xxxx</option>
                </select>
            </div>
            <div id="content_table">
                <div id="header_bar" class="content_table_row">
                    <span>ID</span>
                    <span>Message Subject</span>
                    <span>Date</span>
                    <span>Status</span>
                    <span>Quick Actions</span>
                </div>
                {
                    enquiry_arr.length ?
                        enquiry_arr.map((enquiry, index) => {
                            return (
                                <div key={"enquiry_" + index} class="content_table_row">
                                    <a href={window.location.href + "&enquiry=" + enquiry.message_id}>{enquiry.message_id}</a>
                                    <span>{enquiry.subject}</span>
                                    <span>{(new Date(enquiry.create_time)).toLocaleString()}</span>
                                    <span>{enquiry.status}</span>
                                    <span><button onClick={(event) => deleteMessage(event, enquiry.message_id)}>Delete</button></span>
                                </div>
                            );
                        })
                        :
                        <div id="no_queries_box">
                            No Enquiries ...
                        </div>
                }
            </div>
        </React.Fragment>
    );
}