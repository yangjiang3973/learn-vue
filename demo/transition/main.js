import Aue from '../../src/aue';

let vm = new Aue({
    el: '#app',
    data: {
        showModal: false,
    },
    render() {
        return (
            <div>
                <button
                    id="show-modal"
                    onClick={() => {
                        this.showModal = !this.showModal;
                    }}
                >
                    Show Modal
                </button>

                <transition name="fade">
                    {this.showModal ? <p id="test">hello</p> : null}
                </transition>
            </div>
        );
    },
});
