class VNode {
    constructor(tag, data, children, text, elm, ns, context, componentOptions) {
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;
        this.ns = ns; // ns = namespace, for svg
        this.context = context;
        this.componentOptions = componentOptions;

        this.key = data && data.key;
    }
}

export default VNode;
