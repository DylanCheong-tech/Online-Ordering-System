// ack_message_box.jsx

function MessageBox(props){
    return (
        <React.Fragment>
            <p>{props.message}</p>
            <button type="button" onClick={(event) => event.target.parentElement.remove()}>OK</button>
        </React.Fragment>
    )
}

function displayMessageBox(message){
    let new_ele = document.createElement("span");
    new_ele.id = "ack_msg_box"
    document.body.appendChild(new_ele)

    const container = document.getElementById("ack_msg_box");
    const root = ReactDOM.createRoot(container);
    root.render(<MessageBox message={message} />);
}