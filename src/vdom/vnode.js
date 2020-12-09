class VNode {
    constructor(tag, data, children, text, elm, ns) {
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;
        this.ns = ns; // ns = namespace, for svg
    }
}

module.exports.VNode = VNode;
