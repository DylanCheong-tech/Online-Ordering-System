// about_us.js 

function render(data) {
    document.getElementById("about_us_info").innerHTML = data["About Us"];
    document.getElementById("location_info").innerHTML = data["Location"];
    document.getElementById("our_services_info").innerHTML = data["Our Services"];
}

fetch("/public/info/aboutus")
    .then(response => response.json())
    .then(render)