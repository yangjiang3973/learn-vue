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
                        this.showModal = true;
                    }}
                >
                    Show Modal
                </button>

                <transition name="fade">
                    {this.showModal ? <p>hello</p> : null}
                </transition>
            </div>
        );
    },
});
