export const priority = 1000;
export const isLiteral = true;

export const bind = function () {
    this.update(this.expression);
};

export const update = function (exp) {
    this.el.__v_trans = exp; // save transition id
};
