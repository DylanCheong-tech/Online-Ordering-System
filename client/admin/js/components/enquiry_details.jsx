// enquiry_details.jsx


// React Component sub pane
function EnquiryDetails(props) {

    let enquiry = props.data;

    function submitResolveMessage(event) {
        document.querySelector("div#enquiry_details form").submit();
    }

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
            <h2 id="enquiry_details_title">Enquiry - {enquiry.message_id}</h2>
            <div id="enquiry_details">
                <span>
                    <p className="legend">Name</p>
                    <p>{enquiry.name}</p>
                </span>
                <span>
                    <p className="legend">Status</p>
                    <p>{enquiry.status}</p>
                </span>
                <span>
                    <p className="legend">Contact</p>
                    <p>{enquiry.contact ? enquiry.contact : "N/A"}</p>
                </span>
                <span>
                    <p className="legend">Email</p>
                    <p>{enquiry.email ? enquiry.email : "N/A"}</p>
                </span>
                <span>
                    <p className="legend">Subject</p>
                    <p>{enquiry.subject}</p>
                </span>
                <span>
                    <p className="legend">Created Date</p>
                    <p>{enquiry.create_time}</p>
                </span>
                <span className="span2">
                    <p className="legend">Content</p>
                    <p>{enquiry.message}</p>
                </span>

                <form action="/admin/portal/enquiry/resolve" method="POST" className="span2 margin_top_gap">
                    <p className="legend">Resolve Message</p>
                    {
                        enquiry.status == "Unresolve" ?
                            <React.Fragment>
                                <textarea name="resolve_message" placeholder="Reply your customer by typing your message here ...."></textarea>
                                <input type="hidden" name="message_id" value={enquiry.message_id} />
                            </React.Fragment>
                            : <p>{enquiry.resolve_message}</p>
                    }
                </form>

                <button type="button" disabled={enquiry.status == "Unresolve" ? false : true} onClick={(event) => submitResolveMessage(event)}>Resolve Enquiry</button>
                <button type="button" disabled={enquiry.status == "Unresolve" ? true : false} onClick={(event) => deleteMessage(event, enquiry.message_id)}>Delete Enquiry</button>
            </div>
        </React.Fragment>
    );
}