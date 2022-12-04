// contact_us.js

let params = new URLSearchParams(window.location.search);
let message_sent = params.get("message_sent");

function AckMessage(props) {
    function redirect(){
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

if (message_sent == "success"){
    let root = document.getElementById("message_form");
    let container = ReactDOM.createRoot(root);
    container.render(<AckMessage />)
}