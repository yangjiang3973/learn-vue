module.exports.$add = function (key, val) {
    this._data.$add(key, val);
};

module.exports.$delete = function (key) {
    this._data.$delete(key);
};

module.exports.$set = function (key) {
    this._data.$set(key);
};
