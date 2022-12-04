// header.jsx
// for page header component

function Header_Logo(props) {
    return (
        <div id="header_logo" class="header_footer_template">
            Mr. Buy Marketing
        </div>

    );
}

function Header_Menu_Bar(props) {
    return (
        <div id="header_menu_bar" class="header_footer_template">
            <a href="/">Home</a>
            <a href="/about_us.html">About Us</a>
            <a href="/catalogue.html?category=plastic">Plastic Products</a>
            <a href="/catalogue.html?category=iron">Iron Products</a>
            <a href="/news_room.html" last="true">News Room</a>
        </div>
    );
}

function Header(props) {
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