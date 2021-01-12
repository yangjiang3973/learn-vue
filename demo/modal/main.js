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
                        scopedSlots={{
                            header: (props) => {
                                return <span>{props.title}</span>;
                                // return props.title;
                            },
                        }}
                    >
                        {/* <h3 slot="header">custom header1</h3> */}
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
