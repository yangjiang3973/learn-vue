const templateParser = require('../parsers/template');

module.exports.transclude = function (el, template) {
    if (template) {
        const frag = templateParser.parse(template);
        // clear all el children
        while (el.firstChild) {
            el.firstChild.remove();
        }
        el.appendChild(frag);
    }
};
