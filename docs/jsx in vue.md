# Syntax(v2.6)

## insert content:

```js
return <span>{this.title}</span>;
```

## v-if

```js
function render(h) {
    if (this.show)
        return (
            <div onClick={this.showSwitch}>
                <span id="1">A</span>
                <span id="2">B</span>
                <span id="3">C</span>
            </div>
        );
}
```

## v-for

```js
render(){
  return(
    {this.items.map(item => {
        return (
           <div> {item} </div>
          )
      }
  )}
```

## v-on

```js
export default {
    methods: {
        handleButtonClick(e) {
            e.preventDefault();
            alert('button clicked');
        },
    },
    render() {
        return (
            <div>
                <button onClick={this.handleButtonClick}> click me</button>
            </div>
        );
    },
};
```

## v-html

domPropsInnerHTML attribute performs the same task as v-html , it sets the content of the div to rawHtml.

```js
export default {
    data() {
        return {
            rawHtml: '<h1> This is some HTML </h1>',
        };
    },
    render() {
        return (
            <div>
                <div domPropsInnerHTML={this.rawHtml}> </div>
            </div>
        );
    },
};
```

## component

When using JSX there’s no need to register a component after importing it, you can just use it directly.

```js
import NewComponent from 'NewComponent.vue'
//...
render(){
    return(
        <div> <NewComponent/></div>
    )
}
```

You can still write a component in a file(.vue) and wrap it in `<script>` tag, like the traditional template style.

```js
<script>
	import Todo from './Todo';

	export default {
    name: 'app',

		render() {
			const data = {
				props: {
					title: "Hello"
				}
			}
			return <Todo {...data} />
		}
  }
</script>
```

but you can also use class style:

```js
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class MyComponent extends Vue {
    message = 'hello world';

    render() {
        return <div>{this.message}</div>;
    }
}
```

# v-model

vue jsx transpiler accepts v-model as vModel
