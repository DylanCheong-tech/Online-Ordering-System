// contact_us.js

function AckMessage(props) {
    function redirect() {
        window.location.href = "/contact_us.html";
    }

    return (
        <React.Fragment>
            <h2 className='ack_msg'>
                Thank you for your message. We will review on it and get back to you within three working days.
                <br />
                Stay Tune !</h2>
            <button className="ack_msg_btn" type='button' onClick={redirect}>Got it !</button>
        </React.Fragment>
    )
}

function render_ack(status_json) {
    if (status_json.status == "success") {
        let root = document.getElementById("message_form");
        let container = ReactDOM.createRoot(root);
        container.render(<AckMessage />)
    }
}

function sumbit_message() {
    let form = document.getElementById("message_post_form");
    let form_data = new FormData(form);
    let body_data = {}

    for (const [key, value] of form_data.entries()) {
        body_data[key] = value;
    }

    let settings = {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body_data)
    }

    fetch("/public/messages/visitor/send", settings)
        .then(response => response.json())
        .then(render_ack)
}

document.getElementById("form_submit_button").onclick = sumbit_message;