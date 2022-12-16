// product_catalogue_dashboard.jsx

function ProductCatalogue(props) {
    return (
        <React.Fragment>
            <div id="catalogue_title_banner" class="left_margin">
                <h1>Product Catalogue</h1>
                <button type="button">Add new category ...</button>
            </div>
            <div class="left_margin" id="product_category_card">
                {
                    props.json_data.map((category => {
                        return (
                            <span class="card">
                                <h2>{category.title}</h2>
                                <p>
                                    <span class="legends">
                                        Shop Category :
                                    </span>

                                    <span>
                                        {
                                            category.shop_category.map((shop) => <span class>{shop}</span>)
                                        }
                                    </span>
                                </p>
                                <p>
                                    <span class="legends">
                                        Colors :
                                    </span>
                                    <span>
                                        {
                                            Object.entries(category.colors).map(([key, value]) => <span>{key}</span>)
                                        }
                                    </span>
                                </p>
                                <button type="button" onClick={() => { accessResource('view=product_catalogue&sub_content_pane=' + category.category) }}>Manage</button>
                            </span>
                        );
                    }))
                }

            </div>

        </React.Fragment>
    );
}