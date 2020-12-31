export const parse = function (template) {
    const frag = document.createDocumentFragment();
    const container = document.createElement('div');
    container.innerHTML = template.trim();

    container.childNodes.forEach((node) => {
        frag.appendChild(node);
    });
    return frag;
};
