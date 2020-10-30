module.exports.uppercase = function (val) {
    if (!val) return;
    return val.toString().toUpperCase();
};

module.exports.capitalize = function (val) {
    if (!val) return '';
    val = val.toString();
    return val.charAt(0).toUpperCase() + val.slice(1);
};

module.exports.lowercase = function (val) {
    if (!val) return '';
    return val.toString().toLowerCase();
};
