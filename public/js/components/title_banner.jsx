// title_banner.jsx
// React component : title banner 

function enterKeyTriggered (event) {
    if (event.key == "Enter"){
        document.getElementById("search_button").click()
    }
}

function TitleBanner(props) {
    return (
        <React.Fragment>
            <h1 id="title_header">{props.title}</h1>
            <span>
                <input id="search_input" type="text" placeholder="Search Products" onKeyDown={enterKeyTriggered} />
                <button id="search_button" type="button" onClick={() => props.search()}>Search</button>
            </span>
        </React.Fragment>
    );
}

// search function 
async function search() {
    let search_key = document.getElementById("search_input").value;
    if (search_key) {
        fetch("/product_catalogue/" + category + "/search/" + search_key)
            .then(response => response.json())
            .then(data => render(data, "Search Results"));
    }
}

function render_title_banner(title) {
    const container = document.getElementById("title_banner");
    const root = ReactDOM.createRoot(container);
    root.render(<TitleBanner title={title} search={search}/>);
}

