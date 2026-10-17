const projectsTab = document.getElementById("projectsTab");
const publicationsTab = document.getElementById("publicationsTab");

const projectsContent = document.getElementById("projectsContent");
const publicationsContent = document.getElementById("publicationsContent");


function showProjects() {

    projectsTab.classList.add("active");
    publicationsTab.classList.remove("active");

    projectsContent.classList.remove("hidden");
    publicationsContent.classList.add("hidden");
}


function showPublications() {

    publicationsTab.classList.add("active");
    projectsTab.classList.remove("active");

    publicationsContent.classList.remove("hidden");
    projectsContent.classList.add("hidden");
}


projectsTab.addEventListener("click", showProjects);

publicationsTab.addEventListener("click", showPublications);