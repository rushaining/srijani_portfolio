const educationTab = document.getElementById("educationTab");
const industryTab = document.getElementById("industryTab");

const educationContent =
    document.getElementById("educationContent");

const workContent =
    document.getElementById("workContent");


function showEducation() {

    educationTab.classList.add("active");
    industryTab.classList.remove("active");

    educationContent.classList.remove("hidden");
    workContent.classList.add("hidden");
}


function showWork() {

    industryTab.classList.add("active");
    educationTab.classList.remove("active");

    workContent.classList.remove("hidden");
    educationContent.classList.add("hidden");
}


educationTab.addEventListener(
    "click",
    showEducation
);

industryTab.addEventListener(
    "click",
    showWork
);