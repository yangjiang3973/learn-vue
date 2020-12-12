class VNode {
    constructor(tag, data, children, text, elm, ns, context) {
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;
        this.ns = ns; // ns = namespace, for svg

        this.context = context;
    }
}

module.exports.VNode = VNode;
