console.log('Hello World');
console.error('error message')
console.warn('warning message')

/* 
variables = var, let, const
var is global
let can be reassigned
const cannot be reassigned - always use unless knowledge that it needs to be reassigned
*/

// data types
// strings, numbers, boolean, null, undefined, symbol
const namee = 'Caden';
const number = 24;
const bool = true;
const exists = null;
// null shows up as an object type... huh...
const test = undefined;
let z; // also undefined

// concatenation
console.log('my name is '+namee+' and i am '+number);
//template string
console.log(`my name is ${namee} and i am ${number}`);
// make sure to use ` rather than ' or "

console.log(namee.toUpperCase());
console.log(namee.toLowerCase().split(''));
console.log(namee.substring(0,3));

const numbers = new Array(1,2,3,4,5);
const fruits = ['apples','pears',24, false];
fruits.push('new item at end');
fruits.unshift('new at beginning');
// check if something is an array
console.log(Array.isArray(fruits));
// checks if item exists in object
console.log(fruits.includes('pears'))
console.log(fruits)

const person = {
    firstn: 'Caden',
    lastn: 'Johnson',
    age: 24,
    hobbies: ['drugs', 'girls', 'money', 'liquor'],
    address: {
        street: 'sesame',
        city: 'PBS kids'
    }
}
// pull out data from the object
const { firstn, lastn, address: {street} } = person;
console.log(`${firstn} ${lastn} likes ${street} seeds`);

person.email = 'sesamestreetboi@gmail.com';
console.log(person);

const todo = [
    {
        id: 1,
        test: 'do something 1',
        isCompleted: true
    },
    {
        id: 2,
        test: 'do something 2',
        isCompleted: false
    },
    {
        id: 3,
        test: 'do something 3',
        isCompleted: false
    }
];

// create JSON string such as API request/response
const todoJSON = JSON.stringify(todo);


// for loop
for(let i =0; i < 10; i++) {
    if(i>7) {
        console.log(i);
    }
}

// while loop
let i=0;
while(i<10) {
    if(i>7) {
        console.log(i);
    }
    i++;
}

// looping through arrays
for(let item of todo) {
    console.log( item.test)
}

// high order array methods
// forEach
todo.forEach(function(item) {
    console.log(item.test)
});

// map
const todomap = todo.map(function(item){
    return item.test;
});
// returns the test value for each object
console.log(todomap)

// filter
const todofilter = todo.filter(function(item) {
    return item.isCompleted === false;
});
// returns the objects that meet the requirements
console.log(todofilter)


/* =, ==, and ===
= is assigning
== is checking if it is equal
=== is checking if equal in all cases including data type
*/
const x='10';
if(x==10){
    console.log('x is 10');
} else if(x===10){
    console.log('x is truly equal to 10')
} else {
    console.log('x is not 10')
}

/*
|| is or
&& is and
*/


// an if then situation
const color = x > 10 ? 'red' : 'blue';
// switch which is basically an alternative to nested if statements
switch(color) {
    case 'red':
        console.log(`color is ${color}`);
        break;
    case 'blue':
        console.log(`color is ${color}`);
        break;
    default:
        console.log('color is neither red nor blue');
        break;
}

// function example
function addNums(num1 = 1, num2 = 1) {
    console.log(num1+num2)
    return num1+num2
}
let y = addNums(3);
// arrow functions
const timesNums = (num1, num2) => num1 * num2;
console.log(timesNums(x, y))


// OOP
// Function (es5)
function Person(firstname, lastname, dob) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.dob = new Date(dob);
}

Person.prototype.getBirthYear = function() {
    return this.dob.getFullYear();
}

Person.prototype.getFullName = function() {
    return `${this.firstname} ${this.lastname}`;
}

const person1 = new Person('John', 'Doe', '4-3-1980');

// Class
class Person1 {
    constructor(firstname, lastname, dob) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.dob = new Date(dob);
    }
    getBirthYear() {
        return this.dob.getFullYear();
    }
    getFullName() {
        return `${this.firstname} ${this.lastname}`;
    }
}

const person2 = new Person1('Jane', 'Smith', '4-3-1990');


