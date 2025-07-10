"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const headers = document.querySelectorAll(".collapsible-header");
    headers.forEach(header => {
        header.addEventListener("click", () => {
            const collapsible = header.closest(".collapsible");
            collapsible === null || collapsible === void 0 ? void 0 : collapsible.classList.toggle("open");
        });
    });
});
