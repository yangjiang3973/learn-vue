export const bind = function () {
    this.attrToBind = this.el.style;
};

export const update = function (value) {
    if (value) {
        this.attrToBind.display = '';
    } else {
        this.attrToBind.display = 'none';
    }
};
