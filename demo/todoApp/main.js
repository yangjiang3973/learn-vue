// import Vue from 'vue';
const { Aue } = require('../../src/aue');
const Header = require('./header');
// const List = require('./list');
// const Foote = require('./footer');

let vm = new Aue({
    el: '#app',
    data: {
        todos: [],
        filter: 'all',
    },
    methods: {
        addTodo: function (newTodoText) {
            const newTodo = {
                id: this.todos.length,
                text: newTodoText,
                done: false,
            };
            this.todos.push(newTodo);
        },
        chooseFilter: function (filter) {
            this.filter = filter;
        },
    },
    render(h) {
        return (
            <section class="todoapp">
                <Header todos={this.todos} addTodo={this.addTodo}></Header>
                {/* <List todos={this.todos} filter={this.filter}></List>
                <Footer
                    todos={this.todos}
                    filter={this.filter}
                    chooseFilter={this.chooseFilter}
                ></Footer> */}
            </section>
        );
    },
});
