// define global variables to be reached from outside functionsaa
let allData = "";
let pagetoShow = "";

window.addEventListener("DOMContentLoaded", fetchData);

function fetchData() {
    fetch("http://umarkx.com/WP/wp-json/wp/v2/chainge?_embed")
        .then(initial => initial.json())
        .then(handleData);
}

function handleData(data) {
    buildNav(data);
    allData = data;
    getURLparams();
}


function getURLparams() {
    const params = new URLSearchParams(window.location.search);
    console.log("URLSearchParams " + window.location);
    pagetoShow = params.get("chainge");
    // add id to body so different pages could be styled differently
    document.querySelector("body").id = pagetoShow;
    console.log(pagetoShow);
}

function buildNav(data) {
    data.forEach(showPages => {

        const template = document.querySelector("#navTemplate").content;
        const clone = template.cloneNode(true);

        clone.querySelector("li a").textContent = showPages._embedded["wp:term"][0][0].name;


        const a = clone.querySelector("a");
        a.href = "index.html?chainge=" + showPages._embedded["wp:term"][1][0].name;
        a.addEventListener("click", addContent);
        document.querySelector("nav ul").appendChild(clone);

    })
}

function addContent(e) {
    console.log(e);
    // prevent page reload when nav is clicked
    e.preventDefault();
    // modification from https://stackoverflow.com/questions/3338642/updating-address-bar-with-new-url-without-hash-or-reloading-the-page
    let newurl = e.target.href;
    console.log(newurl);
    window.history.pushState({
        path: newurl
    }, "", newurl);
    getURLparams();
    const dataToDisplay = allData.filter(elem => {
        return elem._embedded["wp:term"][1][0].name == pagetoShow;
    });

    // populate common content
    document.querySelector(".title").innerHTML = dataToDisplay[0].title.rendered;
    document.querySelector("#hero-image").setAttribute("src", dataToDisplay[0].heroimg.guid);
    document.querySelector("#text p").innerHTML = dataToDisplay[0].paragraph;


    //POPULATE PARTNERS
    if (pagetoShow === "partners") {
        document.querySelector("main #partners").classList.remove("hide");
    } else {
        document.querySelector("main #partners").classList.add("hide");
    }

    //POPULATE HOME
    if (pagetoShow === "index") {
        document.querySelector("main #quote-container").classList.remove("hide");
        document.querySelector("main #map-container").classList.remove("hide");
    } else {
        document.querySelector("main #quote-container").classList.add("hide");
        document.querySelector("main #map-container").classList.add("hide");
    }

    //POPULATE ABOUT
    if (pagetoShow === "about") {
        document.querySelector("main #pictures").classList.remove("hide");
    } else {
        document.querySelector("main #pictures").classList.add("hide");
    }

    //POPULATE COMMUNITY
    if (pagetoShow === "community") {
        document.querySelector("main #contact-us").classList.remove("hide");
    } else {
        document.querySelector("main #contact-us").classList.add("hide");
    }

    //POPULATE JOBS
    if (pagetoShow === "jobs") {
        document.querySelector("main #jobs").classList.remove("hide");
        document.querySelector("main #jobs #form").innerHTML = dataToDisplay[0].content.rendered;
    } else {
        document.querySelector("main #jobs").classList.add("hide");
        document.querySelector("main #jobs #form").innerHTML = null;
    }








}
