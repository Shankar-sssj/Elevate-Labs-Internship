document.getElementById("year").textContent = new Date().getFullYear();

const fadeElements = document.querySelectorAll(".fade-in");

function checkVisibility() {
    const triggerBottom = window.innerHeight * 0.8;
    fadeElements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < triggerBottom) {
            el.classList.add("visible");
        }
    });
}

window.addEventListener("scroll", checkVisibility);
checkVisibility();

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
        backToTop.style.display = "block";
    } else {
        backToTop.style.display = "none";
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
