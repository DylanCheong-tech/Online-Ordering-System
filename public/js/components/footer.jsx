// footer.js 
// for page footer components

function Footer() {
    return (
        <React.Fragment>
            <a href="/">Home</a>
            <a href="">About Us</a>
            <a href="">News Room</a>
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