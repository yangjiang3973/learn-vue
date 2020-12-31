export const uppercase = function (val) {
    if (!val) return;
    return val.toString().toUpperCase();
};

export const capitalize = function (val) {
    if (!val) return '';
    val = val.toString();
    return val.charAt(0).toUpperCase() + val.slice(1);
};

export const lowercase = function (val) {
    if (!val) return '';
    return val.toString().toLowerCase();
};
