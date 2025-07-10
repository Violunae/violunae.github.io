document.addEventListener("DOMContentLoaded", () => {
  const headers = document.querySelectorAll<HTMLElement>(".collapsible-header");

  headers.forEach(header => {
    header.addEventListener("click", () => {
      const collapsible = header.closest(".collapsible");
      collapsible?.classList.toggle("open");
    });
  });
});
