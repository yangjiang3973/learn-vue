export default {
    props: [],
    data() {
        return {
            title: 'hello!!!',
        };
    },
    render() {
        return (
            <transition name="modal">
                <div class="modal-mask">
                    <div class="modal-wrapper">
                        <div class="modal-container">
                            <div class="modal-header">
                                {this.$scopedSlots.header({
                                    title: this.title,
                                })}
                            </div>
                            <div class="modal-body">{this.$slots.default}</div>
                            <div class="modal-footer">
                                {this.$slots.footer}
                                <button
                                    class="modal-default-button"
                                    onClick={() => this.$emit('close')}
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        );
    },
};
