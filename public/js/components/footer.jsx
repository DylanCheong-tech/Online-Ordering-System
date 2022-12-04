// footer.jsx
// for page footer components

function Footer(props) {
    return (
        <React.Fragment>
            <a href="/">Home</a>
            <a href="/about_us.html">About Us</a>
            <a href="/news_room.html">News Room</a>
            <a href="">Feedbacks</a>
            <a href="">Contact Us</a>
            <a href="">Terms</a>
            <a href="" last="true">Privacy Policy</a>

            <p>&copy;Mr. Buy Marketing Copyrights</p>
        </React.Fragment>
    );
}

const container = document.getElementById("footer");
const root = ReactDOM.createRoot(container);
root.render(<Footer />);