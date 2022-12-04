// news_room.js

function NewsCard(props) {
    return (
        <span>
            <h3>{props.news_title}</h3>
            <p>{props.news_preview}</p>
            <button onClick={() => {}}>Read More</button>
        </span>
    );
}

function render(data) {
    let root = document.getElementById("news_items_pane");
    let container = ReactDOM.createRoot(root);
    container.render(
        <React.Fragment>
            <h1>News Room</h1>
            {
                data.news.map((news) => {
                    return <NewsCard news_title={news.title} news_preview={news.preview_text} />
                })
            }
        </React.Fragment>
    );
}

fetch("/info/news")
    .then(response => response.json())
    .then(render)