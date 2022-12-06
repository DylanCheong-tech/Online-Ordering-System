// home_page.js

function logout() {
    fetch("/admin/logout", { method: "DELETE" });
}

// React Component (subcomponent) : Side Menu Item > Dropdown items
function DropdownItem(props) {
    if (props.items)
        return (
            <span class="dropdown">
                {
                    props.items.map((sub_item) => {
                        return (<span class="dropdown_item">{sub_item.name}</span>);
                    })
                }
            </span>
        );
}

// React Component : Side Menu Item 
function SideMenuItem(props) {
    return (
        <div id="side_menu">
            {
                props.side_menu_item_json_arr.map((item) => {
                    return (
                        <span class="side_menu_item">
                            <span class="menu_item_name">
                                <img src="./img/icon_next.svg" />
                                <h3>{item.title}</h3>
                                <img src="./img/icon_next.svg" />
                            </span>

                            <DropdownItem items={item.dropdown} />
                        </span>
                    );
                })
            }
        </div>
    );
}

// React Component : Sub-content pane for each side menu item
function SubcontentPane(props) {
    return (
        <div id="sub_content_pane">
            <h1>Dashboard</h1>
        </div>
    );
}

function renderSideMenu(data) {
    const root = document.getElementById("content_pane");
    const container = ReactDOM.createRoot(root);
    container.render(
        <React.Fragment>
            <SideMenuItem side_menu_item_json_arr={data.menu_item} />
            <SubcontentPane />
        </React.Fragment>
    );
}

fetch("/admin/portal/metadata")
    .then((response) => {
        if (response.redirected) {
            window.location.href = response.url;
        }
        return response.json();
    })
    .then(renderSideMenu)
    .catch(console.log);