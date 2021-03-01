import Aue from '../../src/aue';
import transition from '../../src/components/transition';

var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Setup Firebase
// var config = {
//     apiKey: 'AIzaSyAi_yuJciPXLFr_PYPeU3eTvtXf8jbJ8zw',
//     authDomain: 'vue-demo-537e6.firebaseapp.com',
//     databaseURL: 'https://vue-demo-537e6.firebaseio.com',
// };
// firebase.initializeApp(config);

// var usersRef = firebase.database().ref('users');
// console.log(usersRef);

let vm = new Aue({
    el: '#app',
    data() {
        return {
            newUser: {
                name: '',
                email: '',
            },
            users: [],
        };
        // users: [],
    },
    // firebase binding
    // https://github.com/vuejs/vuefire
    // firebase: {
    //     users: usersRef,
    // },
    // computed property for form validation state
    computed: {
        validation: function () {
            return {
                name: !!this.newUser.name.trim(),
                email: emailRE.test(this.newUser.email),
            };
        },
        isValid: function () {
            var validation = this.validation;
            return Object.keys(validation).every(function (key) {
                return validation[key];
            });
        },
    },
    // methods
    methods: {
        addUser: function (e) {
            e.preventDefault();
            // if (this.isValid) {
            console.log(
                '🚀 ~ file: app.js ~ line 54 ~ this.newUser',
                this.newUser
            );
            // usersRef.push(this.newUser);
            let { name, email } = this.newUser;
            this.users.push({ name, email });
            this.newUser.name = '';
            this.newUser.email = '';
            // }
        },
        removeUser: function (index) {
            // usersRef.child(user['.key']).remove();
            this.users.splice(index, 1);
        },
    },
    render() {
        return (
            <div>
                {/* <ul is="transition-group"> */}
                {/* <li v-for="user in users" class="user" key="user['.key']">
                        <span>
                            {this.user.name} - {this.user.email}
                        </span>
                        <button onClick={this.removeUser(user)}>X</button>
                    </li> */}
                {this.users.map((user, index) => {
                    return (
                        <transition>
                            <li class="user">
                                <span>
                                    {user.name} - {user.email}
                                </span>
                                <button onClick={() => this.removeUser(index)}>
                                    X
                                </button>
                            </li>
                        </transition>
                    );
                })}
                {/* </ul> */}
                {/* <form id="form" onSubmit.prevent="addUser"> */}
                <form id="form" onSubmit={this.addUser} key="1">
                    {/* <input vModel={this.newUser.name} placeholder="Add Name" />
                    <input
                        vModel={this.newUser.email}
                        placeholder="Add Email"
                    /> */}
                    <input
                        key="2"
                        value={this.newUser.name}
                        onInput={(e) => {
                            console.log(e.target.value);
                            this.newUser.name = e.target.value;
                        }}
                        placeholder="Add Name"
                    />
                    <input
                        key="3"
                        value={this.newUser.email}
                        onInput={(e) => {
                            this.newUser.email = e.target.value;
                        }}
                        placeholder="Add Email"
                    />
                    <input type="submit" value="Add User" />
                </form>
                <ul class="errors">
                    <li vShow={!this.validation.name}>Name cannot be empty.</li>
                    <li vShow={!this.validation.email}>
                        Please provide a valid email address.
                    </li>
                </ul>
            </div>
        );
    },
});
