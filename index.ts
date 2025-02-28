//1. Infer types (implicit types)

// let num = 10;

//2. Defining types (Explicit types)
// let num1: number = 9;
// let text: string = "Hello";
// let isTrue: boolean = false;
// isTrue = true;
// let skills= ["HTML", "CSS", "JS" , 3 , true];
// let skill : string[] = ["HTML", "CSS", "JS"];

// let user:{name:string ; age: number ; salary:number } = {
//    name: "John",
//    age: 30,
//    salary: 50000,
// };
// user.salary = 60000;


//3.interface

interface User{
  name:string;
  age:number;
  salary:number;
  getName:()=> void;
}

let person: User= {
  name:"hello",
  age:20,
  salary:32_223,
  getName() {
    console.log(this.name);
  }

}

//3.a type

type User2 ={
  name:string;
  age:number;
  salary:number;
  getName:()=> void;
}

let person2: User ={
  name:"maher",
  age:21,
  salary:10000,
  getName(){
    console.log(this.age)
  }
}

//4. union / optional operator

type User3={
  name:string;
  age:number| string;
  //optional (?:)
  //so if don't use the salary it doesn't show any error
  salary?:number
}

let person3: User3 ={
  name:"ali",
  age:"23",
  // salary:30_000
}

function add(a: number, b: number): number {
  return a + b;
}
console.log(add(3,4))