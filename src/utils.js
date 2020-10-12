/**
 * Check is a string starts with $ or _
 *
 * @param {String} str
 * @return {Boolean}
 */

module.exports.isReserverd = function (str) {
    return str.startsWith('$') || str.startsWith('_');
};
