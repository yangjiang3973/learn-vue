export const bind = function () {
    this.el.addEventListener(
        'input',
        (e) => {
            this.vm[this.expression] = e.target.value;
        },
        false
    );
};

export const update = function (value) {
    this.el.value = typeof value === 'undefined' ? '' : value;
};
