export default {
    props: ['addTodo', 'todos'],
    data() {
        return {
            title: 'Todo App',
        };
    },
    methods: {
        inputTodo: function (e) {
            if (e.code === 'Enter' && e.target.value) {
                this.addTodo(e.target.value);
                e.target.value = '';
            }
        },
    },
    render() {
        return (
            <header class="header">
                <h1>{this.title}</h1>
                <input
                    class="new-todo"
                    autofocus
                    autocomplete="off"
                    type="text"
                    placeholder="What needs to be done?"
                    onKeyup={this.inputTodo}
                />
            </header>
        );
    },
};
