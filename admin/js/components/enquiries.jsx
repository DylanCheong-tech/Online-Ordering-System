// enquiries.jsx

// React Component : Enquiries sub pane
function Enquiries(props) {
    return (
        <React.Fragment>
            <h1 class="left_margin">Enquiries</h1>
            <p class="content_attributes left_margin">
                Unread Message : xxx <br />
                Unresolved Message : xxx <br />
            </p>
            <div id="search_filter" class="left_margin">
                <input id="search_bar" placeholder="Search ... " />
                <select id="filter_drop_down">
                    <option disabled selected>--- Filter ----</option>
                    <option>xxxx</option>
                    <option>xxxx</option>
                    <option>xxxx</option>
                    <option>xxxx</option>
                </select>
            </div>
            <div id="content_table">
                <div id="header_bar" class="content_table_row">
                    <span>Message ID</span>
                    <span>Message Subject</span>
                    <span>Date</span>
                    <span>Status</span>
                    <span>Quick Actions</span>
                </div>
                <div class="content_table_row">
                    <a href="">0001</a>
                    <span>XXX XXXXX</span>
                    <span>XX-XX-XXXX</span>
                    <span>XXXXXXX</span>
                    <span><button>Quick Action</button></span>
                </div>
                <div class="content_table_row">
                    <a href="">0002</a>
                    <span>XXX XXXXX</span>
                    <span>XX-XX-XXXX</span>
                    <span>XXXXXXX</span>
                    <span><button>Quick Action</button></span>
                </div>
                <div class="content_table_row">
                    <a href="">0003</a>
                    <span>XXX XXXXX</span>
                    <span>XX-XX-XXXX</span>
                    <span>XXXXXXX</span>
                    <span><button>Quick Action</button></span>
                </div>
            </div>
        </React.Fragment>
    );
}