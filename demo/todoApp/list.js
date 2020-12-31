export default {
    props: ['todos', 'filter'],
    data() {
        return {
            editedTodo: null,
        };
    },
    computed: {
        filteredTodos: function () {
            return this.todos.filter((todo) => {
                if (this.filter === 'active' && todo.done === false)
                    return true;
                else if (this.filter === 'completed' && todo.done === true)
                    return true;
                else if (this.filter === 'all') return true;
            });
        },
    },
    methods: {
        changeState: function (e, todo) {
            todo.done = e.target.checked;
        },
        removeTodo: function (todo) {
            this.todos.splice(this.todos.indexOf(todo), 1);
        },
        editTodo: function (todo) {
            this.editedTodo = todo;
            this.$refs[`inputEdit-${todo.id}`];
            setTimeout(() => this.$refs[`inputEdit-${todo.id}`].focus(), 0);
            // this.$refs.inputEdit.focus();
        },
        completeEdit: function (e, todo, save) {
            if (!this.editedTodo) return;

            if (!e.target.value && save) {
                this.removeTodo(todo);
            } else if (save) {
                todo.text = e.target.value;
            }

            this.editedTodo = null;
            this.$refs[`inputEdit-${todo.id}`].blur();
        },
        editControl: function (e, todo) {
            if (e.code === 'Enter') {
                this.completeEdit(e, todo, true);
            } else if (e.code === 'Escape') {
                this.completeEdit(e, todo, false);
            }
        },
    },
    render() {
        return (
            <section class="main">
                <ul class="todo-list">
                    {this.filteredTodos.map((todo) => {
                        return (
                            <li
                                class={{
                                    todo: true,
                                    completed: todo.done,
                                    editing: todo === this.editedTodo,
                                }}
                                key={todo.id}
                            >
                                <div class="view">
                                    <input
                                        type="checkbox"
                                        class="toggle"
                                        vModel={todo.done}
                                    />
                                    <label
                                        onDblclick={() => this.editTodo(todo)}
                                    >
                                        {todo.text}
                                    </label>
                                    <button
                                        class="destroy"
                                        onClick={() => this.removeTodo(todo)}
                                    ></button>
                                </div>
                                <input
                                    type="text"
                                    class="edit"
                                    ref={`inputEdit-${todo.id}`}
                                    value={todo.text}
                                    onBlur={(e) =>
                                        this.completeEdit(e, todo, true)
                                    }
                                    onKeyup={(e) => this.editControl(e, todo)}
                                />
                            </li>
                        );
                    })}
                </ul>
            </section>
        );
    },
};
