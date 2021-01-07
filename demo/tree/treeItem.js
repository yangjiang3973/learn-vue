const treeItem = {
    props: ['item'],
    data: function () {
        return {
            isOpen: false,
        };
    },
    computed: {
        isFolder: function () {
            return this.item.children && this.item.children.length;
        },
    },
    methods: {
        toggle: function () {
            if (this.isFolder) {
                this.isOpen = !this.isOpen;
            }
        },
        makeFolder: function () {
            if (!this.isFolder) {
                this.$emit('makeFolder', this.item);
                this.isOpen = true;
            }
        },
    },
    render() {
        return (
            <li>
                <div
                    class={{ bold: this.isFolder }}
                    onClick={this.toggle}
                    onDblclick={this.makeFolder}
                >
                    {this.item.name}
                    {this.isFolder ? (
                        <span>[{this.isOpen ? '-' : '+'}]</span>
                    ) : (
                        ''
                    )}
                </div>
                {this.isFolder ? (
                    <ul v-show={this.isOpen}>
                        {this.item.children.map((child, index) => {
                            return (
                                <treeItem
                                    class="item"
                                    key={index}
                                    item={child}
                                    onMakeFolder={(item) =>
                                        this.$emit('makeFolder', item)
                                    }
                                    onAddItem={(item) =>
                                        this.$emit('addItem', item)
                                    }
                                ></treeItem>
                            );
                        })}
                        <div
                            class="add"
                            onClick={(e) => this.$emit('addItem', this.item)}
                        >
                            +
                        </div>
                    </ul>
                ) : (
                    ''
                )}
            </li>
        );
    },
};

export default treeItem;
