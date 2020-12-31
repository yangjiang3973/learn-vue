export const bind = function () {
    const eventType = this.name.split(':')[1];
    const fn = this.vm[this.expression];
    if (eventType && fn) {
        this.el.addEventListener(eventType, fn.bind(this.vm), false);
    }
};

export const update = function (value) {
    return;
};
