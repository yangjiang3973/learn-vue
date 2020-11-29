# Basic Types

## Array

```ts
let list: number[] = [1, 2, 3];

let list: Array<number> = [1, 2, 3];
```

## Tuple

(fixed number of elements)

```ts
let x: [string, number];

x = ['hello', 10];
```

## unknown

```ts
let notSure: unknown = 4;

notSure = 'maybe a string later';
```

## Any

```ts
declare function getValue(key: string): any;

const str: string = getValue('myString');
```

## Void

```ts
function warnUser(): void {
    console.log('This is a warning message');
}
```

## Type assertions

### as-syntax

```ts
let someValue: unknown = 'this is a string';

let strLength: number = (someValue as string).length;
```

### angle-bracket

```ts
let someValue: unknown = 'this is a string';

let strLength: number = (<string>someValue).length;
```

# Interfaces

```ts
interface LabeldValue {
    label: string;
}

function printLabel(labeledObj: LabeledValue) {
    console.log(labeledObj.label);
}

let myObj = { size: 10, label: 'Size 10 Object' };
printLabel(myObj);
```

## optional properties

```ts
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    let newSquare = { color: 'white', area: 100 };
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let mySquare = createSquare({ color: 'black' });
```

## readonly properties

```ts
interface Point {
    readonly x: number;
    readonly y: number;
}
```

The easiest way to remember whether to use readonly or const is to ask

whether you’re using it on a variable or a property.

Variables use const whereas properties use readonly.

## excess property checks

```ts
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}
```

## Function Types

```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;

mySearch = function (src: string, sub: string) {
    let result = source.search(subString);
    return result > -1;
};
```

```ts
let mySearch: SearchFunc;

mySearch = function (src, sub) {
    let result = src.search(sub);
    return result > -1;
};
```

## Indexable Types

```ts
interface StringArray {
    [index: number]: string;
}

let myArray: StringArray;
myArray = ['Bob', 'Fred'];

let myStr: string = myArray[0];
```

## Class Types

```ts
interface ClockInterface {
    currentTime: Date;
}

class Clock implements ClockInterface {
    currentTime: Date = new Date();
    constructor(h: number, m: number) {}
}
```

You can also describe methods in an interface that are implemented in the class, as we do with setTime in the below example:

```ts
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date): void;
}

class Clock implements ClockInterface {
    currentTime: Date = new Date();
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) {}
}
```

Interfaces describe the public side of the class, rather than both the public and private side.

When a class implements an interface, only the instance side of the class is checked.

## Extending Interfaces

Interfaces can extend each other.

## Hybrid Types

```ts
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = function (start: number) {} as Counter;
    counter.interval = 123;
    counter.reset = function () {};
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

## Interfaces Extending Calsses

```ts
class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() {}
}

class TextBox extends Control {
    select() {}
}
```

# Functions

```ts
let myAdd: (x: number, y: number) => number = function (
    x: number,
    y: number
): number {
    return x + y;
};
```

## Inferring the types

```ts
// The parameters 'x' and 'y' have the type number
let myAdd = function (x: number, y: number): number {
    return x + y;
};

// myAdd has the full function type
let myAdd2: (baseValue: number, increment: number) => number = function (x, y) {
    return x + y;
};
```

## Optional and Default Parameters

```ts
function buildName(firstName: string, lastName: string) {
    return firstName + ' ' + lastName;
}

let result1 = buildName('Bob'); // error, too few parameters
// Expected 2 arguments, but got 1.
let result2 = buildName('Bob', 'Adams', 'Sr.'); // error, too many parameters
// Expected 2 arguments, but got 3.
let result3 = buildName('Bob', 'Adams'); // ah, just right
```

In JavaScript, every parameter is optional, and users may leave them off as they see fit.

When they do, their value is undefined.

```ts
function buildName(firstName: string, lastName?: string) {
    if (lastName) return firstName + ' ' + lastName;
    else return firstName;
}

let result1 = buildName('Bob'); // works correctly now
let result2 = buildName('Bob', 'Adams', 'Sr.'); // error, too many parameters
// Expected 1-2 arguments, but got 3.
let result3 = buildName('Bob', 'Adams'); // ah, just right
```

Any optional parameters must follow required parameters.

Had we wanted to make the first name optional, rather than the last name,

we would need to change the order of parameters in the function,

putting the first name last in the list.

Unlike plain optional parameters, default-initialized parameters don’t need to occur after required parameters.

## Rest Parameters

```ts
function buildName(firstName: string, ...restOfName: string[]) {
    return firstName + ' ' + restOfName.join(' ');
}

// employeeName will be "Joseph Samuel Lucas MacKinzie"
let employeeName = buildName('Joseph', 'Samuel', 'Lucas', 'MacKinzie');
```

## this and arrow functions

In JavaScript, this is a variable that’s set when a function is called.

This makes it a very powerful and flexible feature, but it comes at the cost of always having to know about the context that a function is executing in.

```ts
interface Card {
    suit: string;
    card: number;
}

interface Deck {
    suits: string[];
    cards: number[];
    createCardPicker(this: Deck): () => Card;
}

let deck: Deck = {
    suits: ['hearts', 'spades', 'clubs', 'diamonds'],
    cards: Array(52),
    // NOTE: The function now explicitly specifies that its callee must be of type Deck
    createCardPicker: function (this: Deck) {
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
        };
    },
};

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert('card: ' + pickedCard.card + ' of ' + pickedCard.suit);
```

## Overloads

```ts
let suits = ['hearts', 'spades', 'clubs', 'diamonds'];

function pickCard(x: { suit: string; card: number }[]): number;
function pickCard(x: number): { suit: string; card: number };
function pickCard(x: any): any {
    // Check to see if we're working with an object/array
    // if so, they gave us the deck and we'll pick the card
    if (typeof x == 'object') {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // Otherwise just let them pick the card
    else if (typeof x == 'number') {
        let pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}

let myDeck = [
    { suit: 'diamonds', card: 2 },
    { suit: 'spades', card: 10 },
    { suit: 'hearts', card: 4 },
];

let pickedCard1 = myDeck[pickCard(myDeck)];
alert('card: ' + pickedCard1.card + ' of ' + pickedCard1.suit);

let pickedCard2 = pickCard(15);
alert('card: ' + pickedCard2.card + ' of ' + pickedCard2.suit);
```

# Literal Types

There are three sets of literal types available in TypeScript today: strings, numbers, and booleans;

by using literal types you can allow an exact value which a string, number, or boolean must have.

## String Literal Types

```ts
type Easing = 'ease-in' | 'ease-out' | 'ease-in-out';

class UIElement {
    animate(dx: number, dy: number, easing: Easing) {
        if (easing === 'ease-in') {
            // ...
        } else if (easing === 'ease-out') {
        } else if (easing === 'ease-in-out') {
        } else {
            // It's possible that someone could reach this
            // by ignoring your types though.
        }
    }
}

let button = new UIElement();
button.animate(0, 0, 'ease-in');
button.animate(0, 0, 'uneasy');
// Argument of type '"uneasy"' is not assignable to parameter of type 'Easing'.
```

# Unions and Intersection Types

## Union types

# Classes

```ts
class Greeter {
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }

    greet() {
        return 'Hello, ' + this.greeting;
    }
}

let greeter = new Greeter('world');
```

## Public by default

```ts
class Animal {
    public name: string;

    public constructor(theName: string) {
        this.name = theName;
    }

    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

# Enums

## Numeric enums

```ts
enum Direction {
    Up = 1,
    Down,
    Left,
    Right,
}
```

# Generics

`type parameter T`

```ts
function identity<T>(arg: T): T {
    return arg;
}
```

we can explicitly set T to be string as one of the arguments to the function call,

denoted using the <> around the arguments rather than ().

```ts
let output = identity<string>('myString');
//       ^ = let output: string
```

The second way is also perhaps the most common.

Here we use type argument inference

That is, we want the compiler to set the value of T for us automatically based on the type of the argument we pass in:

```ts
let output = identity('myString');
//       ^ = let output: string
```

## Generic Types

```ts
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <T>(arg: T) => T = identity;
```

generic interface:

```ts
interface GenericIdentityFn {
    <T>(arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

## Generic Classes

```ts
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
    return x + y;
};
```
