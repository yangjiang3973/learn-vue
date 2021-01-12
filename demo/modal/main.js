import Aue from '../../src/aue';
import Modal from './modalComponent';

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

                {this.showModal ? (
                    <Modal
                        onClose={() => {
                            this.showModal = false;
                        }}
                    >
                        <h3 slot="header">custom header1</h3>
                        <h3 slot="header">custom header2</h3>
                        <h3 slot="header">custom header3</h3>
                        <div>this is the main body</div>
                        <div slot="footer">this is the footer</div> {}
                    </Modal>
                ) : (
                    ''
                )}
            </div>
        );
    },
});
