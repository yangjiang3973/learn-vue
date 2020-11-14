module.exports.parse = function (text) {
    const tagRE = /\{?\{\{(.+?)\}\}\}?/g;
    // after test, need to reset lastIndex
    if (!tagRE.test(text)) return;
    tagRE.lastIndex = 0;
    const tokens = [];
    // let temp1 = tagRE.exec(text);
    // let temp2 = tagRE.exec(text);

    let match;
    let cursor = 0;
    while (1) {
        match = tagRE.exec(text);
        if (!match) break;
        // regular text
        if (cursor < match.index) {
            tokens.push({
                type: null,
                value: text.slice(cursor, match.index),
            });
        }
        tokens.push({
            type: 'text',
            value: match[1],
        });
        cursor = tagRE.lastIndex;
    }
    if (cursor < text.length - 1) {
        tokens.push({
            type: null,
            value: text.slice(cursor, text.length),
        });
    }
    return tokens;
};
