// header.js 
// for page header component

function Header_Logo() {
    return (
        <div id="header_logo" class="header_footer_template">
            Mr. Buy Marketing
        </div>

    );
}

function Header_Menu_Bar() {
    return (
        <div id="header_menu_bar" class="header_footer_template">
            <a href="/">Home</a> |
            <a href="">About Us</a> |
            <a href="">News Room</a> |
            <a href="">Feedbacks</a> |
            <a href="">Contact Us</a>
        </div>
    );
}

function Header() {
    return (
        <React.Fragment>
            <Header_Logo />
            <Header_Menu_Bar />
        </React.Fragment>
    );
}

const container = document.getElementById("header");
const root = ReactDOM.createRoot(container);
root.render(<Header />);