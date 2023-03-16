// footer.jsx
// for page footer components

function Footer(props) {
    return (
        <React.Fragment>
            <a href="/">Home</a>
            <a href="/about_us.html">About Us</a>
            <a href="/news_room.html">News Room</a>
            <a href="/contact_us.html">Contact Us</a>
            <a href="/terms_provacy_policy.html" last="true">Terms & Privacy Policy</a>

            <p>&copy;Mr. Buy Marketing Copyrights</p>
        </React.Fragment>
    );
}

const container = document.getElementById("footer");
const root = ReactDOM.createRoot(container);
root.render(<Footer />);