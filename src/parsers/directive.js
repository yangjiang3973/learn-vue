// str is attr.value, returns [descriptor obj]
module.exports.parse = function (str) {
    const dirs = [];
    let expression = str;
    let raw = str;
    const dir = { raw, expression };
    dirs.push(dir);
    return dirs;
};
