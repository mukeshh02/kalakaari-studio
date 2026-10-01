
document.addEventListener("DOMContentLoaded", function() {

  const nav = document.querySelector(".addons-sticky-navigation");
  const footer = document.querySelector("footer");

  if (!nav || !footer) return;

  function handleScroll() {
    const footerTop = footer.getBoundingClientRect().top;
    const viewportHeight = window.innerHeight;

    if (footerTop <= viewportHeight) {
      nav.classList.add("hide-nav");
    } else {
      nav.classList.remove("hide-nav");
    }
  }

  window.addEventListener("scroll", handleScroll);
  handleScroll();

});
