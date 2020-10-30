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
    const filterTokenRE = /[^\s'"]+|'[^']+'|"[^"]+"/g; // TODO: learn RegExp further

    // NOTE: now split by `|`, this is hacky

    // split expression and filters
    const tokens = str.split('|').map((i) => i.trim());
    let expression;
    let raw;
    let filters = [];
    expression = tokens.shift();
    raw = expression;
    if (tokens.length !== 0) {
        tokens.forEach((token) => {
            filters.push({ name: token, args: null });
        });
    }
    const dir = { expression, raw, filters };
    dirs.push(dir);
    return dirs;
};
