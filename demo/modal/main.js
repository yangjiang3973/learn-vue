import Vue from '../../src/entries/web-runtime';
import Modal from './modalComponent';

let vm = new Vue({
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

                {this.showModal ? (
                    <Modal
                        onClose={() => {
                            this.showModal = false;
                        }}
                    >
                        <h3 slot="header">custom header</h3>
                        <div slot="body">this is the main body</div>
                        <div slot="footer">this is the footer</div>
                    </Modal>
                ) : (
                    ''
                )}
            </div>
        );
    },
});
