
document.addEventListener("DOMContentLoaded", function() {

  const wrappers = [
    document.querySelector("#stacking-wrapper-1"),
    document.querySelector("#stacking-wrapper-2"),
    document.querySelector("#stacking-wrapper-3")
  ];

  const trigger = document.querySelector("#hide-trigger");
  if (!trigger) return;

  function handleScroll() {
    const triggerTop = trigger.getBoundingClientRect().top;

    wrappers.forEach(wrapper => {
      if (!wrapper) return;

      if (triggerTop <= 0) {
        wrapper.classList.add("fade-out");
      } else {
        wrapper.classList.remove("fade-out");
      }
    });
  }

  window.addEventListener("scroll", handleScroll);
  handleScroll();

});
