module.exports.bind = () => {
    this.el.nodeType === 'ELEMENT_NODE'
        ? (this.attrToBind = 'textContent')
        : (this.attrToBind = 'data');
};

module.exports.update = (value) => {
    this.el[this.attrToBind] = value;
};
