// footer.js 
// for page footer components

function Footer() {
    return (
        <footer class="header_footer_template">
            <a href="">Home</a> |
            <a href="">About Us</a> |
            <a href="">News Room</a> |
            <a href="">Feedbacks</a> |
            <a href="">Contact Us</a> |
            <a href="">Terms</a> |
            <a href="">Privacy Policy</a>

            <br />
            <span>&copy;Mr. Buy Marketing Copyrights</span>
        </footer>
    );
}

const container = document.getElementById("footer");
const root = ReactDOM.createRoot(container);
root.render(<Footer />);