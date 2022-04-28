interface Person {
  name: string;
  age: number;
  lastName: string | null;
}

var person: Person = {
  name: 'John',
  age: 30,
  lastName: null,
};

// console.log(person.firstName);
// console.log(thePerson.firstName);

person.lastName = 'Doe';

var x: string = person.lastName ?? null;

var person2 = {
  name: 'John',
  age: 30,
  lastName: null,
};

function greet(person: Person): string {
  console.log('Hello ' + person.name);
  return 'Hello ' + person.name;
  // return NaN
}

function greet2(person: Person): string {
  if (person) {
    return person.name;
  }

  return Math.random().toString();
}

var y: any = 1;
console.log(greet2(y));

// const p: Person = {
//   name: 'John',
//   age: 30,
// };

// p.age = 12

// class Employee implements Person {
//   name: string;
//   age: number;
//   lastName: string;
// }

class Employee {
  name: string;
  age: number;
  // lastName: string;
}

const me = new Employee();
me.name = 'John';

// function printPerson(p: Person) {
//   console.log(p.name);
// }

function printPerson(p: { name: string }) {
  console.log(p.name);
}

printPerson(me);

class Cat {
  name: string;
}

const zorro = new Cat();
printPerson(zorro);

printPerson({ name: 'John' });
