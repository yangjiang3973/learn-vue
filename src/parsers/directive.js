// str is attr.value, returns [descriptor obj]
// parse str and split dir exp and filters
// {
//     expression,
//     raw,
//     filters: [{
//         name,
//         args,
//     }, {}...]
// }
module.exports.parse = function (str) {
    const dirs = [];
    const filterTokenRE = /[^\s'"]+|'[^']+'|"[^"]+"/g;

    let expression = str;
    let raw = str;
    // TODO: parse filters and add to dir
    const dir = { raw, expression };
    dirs.push(dir);
    return dirs; // dirs is actually an array of descriptor
};
