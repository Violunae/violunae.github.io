document.addEventListener("DOMContentLoaded", () => {
  const headers = document.querySelectorAll<HTMLElement>(".collapsible-header");

  headers.forEach(header => {
    header.addEventListener("click", () => {
      const collapsible = header.parentElement as HTMLElement | null;
      collapsible?.classList.toggle("open");

      const content = header.nextElementSibling as HTMLElement | null;
      if (content) {
        if (content.style.maxHeight) {
          content.style.maxHeight = "";
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        }
      }
    });
  });
});
