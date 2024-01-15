# GarbageLang

## A Programming Language That is Literally Garbage!

GarbageLang has everything your typical programming language has:

### Variables

```ts
  const hello String = "hello world";
```

```ts
  let expr Int = 10 * 5 + 3 - 1 / 9;
```

### Functions

```go
  func hello() {
    call println("Hello World!");
  };

  call hello();
```

### Loops

```ts
  for (let i = 0; i < 5; ++i;) {
    call println("This is a great loop!");
  };
```

### Conditionals

```ts
   for (let i Int = 0; i < 5; ++i;) {

     if (i > 3) {
       call println("i greater than 3!");
     } else {
       call println("i is NOT greater than 3!"); 
     };
   };

      let expr Float = 10 * 5 + 3 - 1 / 9;

      call println(expr);
```

### Primitive Types

I will only write the currently implemented ones:

* String
* Int
* Float
* Null

I did not make this into an npm package so the steps to run are:

```sh
  1. Clone the repo
  2. Navigate to the directory
  3. Once in root, npm run test or npx tsx index.ts to initialize the REPL
```

## Real Note Though

During the development of this project, I was essentially just yoloing and learning as I went. But there came a point
where I realized I had already gone to deep, and so I decided to finish it with the flaws it has. There is a lot of code that needs
to be cleaned due to the fact that I was rushing to get something working today (1/15/2024), so there is a lot of unelegant code in many parts of the
runtime and also the frontend. Nontheless I learned a lot about interpreters and interpreter design, aswell as the techniques that come with the learning process.

I plan on coming back to refactor and make things more presentable, since it is something I should do due to the fact that the conclusion of it has left
a bad taste in my mouth (I finished it today but, at the cost of presentability).

This interpreter and language is truly garbage, my next project will be another interpreter in go to which I will properly plan for,
this is because this time around I have no need to yolo because, I feel like I have understood the process that goes into making a 
relatively simple language and interpreter for the language.

#### GarbageLang - 10/10 Would Not Recommend!
