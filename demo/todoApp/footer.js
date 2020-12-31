export default {
    props: ['todos', 'filter', 'chooseFilter'],
    computed: {
        remaining: function () {
            return this.todos.filter((todo) => {
                return !todo.done;
            }).length;
        },
    },
    render() {
        return (
            <footer class="footer">
                <span class="todo-count">
                    {this.remaining} {this.remaining > 1 ? 'items' : 'item'}{' '}
                    left
                </span>
                <ul class="filters">
                    <li>
                        <a
                            href="#"
                            onClick={() => this.chooseFilter('all')}
                            class={{ selected: this.filter === 'all' }}
                        >
                            All
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={() => this.chooseFilter('active')}
                            class={{ selected: this.filter === 'active' }}
                        >
                            Active
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={() => this.chooseFilter('completed')}
                            class={{
                                selected: this.filter === 'completed',
                            }}
                        >
                            Completed
                        </a>
                    </li>
                </ul>
            </footer>
        );
    },
};
