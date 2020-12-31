import compile from '../compile/compile'; // BUG: circle require..
import Directive from '../directive';

export const bind = function () {
    this.start = document.createComment('v-if-start');
    this.end = document.createComment('v-if-end');
    // replace on dom tree
    this.elParent = this.el.parentNode;
    this.elParent.insertBefore(this.start, this.el);
    this.elParent.replaceChild(this.end, this.el);
    // compile sub tree
    // NOTE: is it necessary to use create fragment before compile?
    this.template = document.createDocumentFragment();
    // after append/insert, doc frag(this.template) will be cleared
    // so need to keep the ref here
    this.frag = this.el.cloneNode(true);
    this.template.appendChild(this.frag);
    this.links = compile(this.template, this.vm);
};

export const update = function (value) {
    if (value) {
        // insert frag instead of template
        // apply transition
        let transitionId = this.el.__v_trans;
        this.frag.classList.add(transitionId + '-enter');
        this.elParent.insertBefore(this.frag, this.end);
        setTimeout(() => {
            this.frag.classList.remove(transitionId + '-enter');
        });

        this.links.forEach((link) => {
            const { node, dirs } = link;
            if (!dirs) return;
            dirs.forEach((dir) => {
                const { name, def, descriptors } = dir;
                descriptors.forEach((desc) => {
                    this.vm._directives.push(
                        new Directive(name, node, this.vm, desc, def) //* `host` is not passed yet
                    );
                });
            });
        });
    } else {
        // should remove again, between v-if-start and v-if-end
        const blockToRemove = this.start.nextSibling;
        // apply transition
        let transitionId = this.el.__v_trans;
        blockToRemove.classList.add(transitionId + '-leave');
        setTimeout(() => {
            blockToRemove.classList.remove(transitionId + '-leave');
            blockToRemove.parentNode.removeChild(blockToRemove);
        }, 1001);
    }
};
