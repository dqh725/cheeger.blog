---
layout: post
title:  "ES6/ES7 New Features"
lang: en
category: develop
tags: ES6
icon: 2
comments: false
---

# Introduction
There are some significant changes in ES6 compared to ES5, here I will just list a few commonly used ones with examples.

ES6 includes the following new features:
- [Arrows](#arrows)
- [Promise](#promise)
- [Await(ES7)](#await)
- [Destructuring](#destructuring)
- [spread+rest](#spreadrest)


---
# Arrows
```javascript
var name = 'value';
// this
['level1'].forEach(() => {
  // same this
  ['level2'].forEach(() => {
    // same this again
    console.log(this.name);
  });
})

> value // print value
```

---
# Promise
This is finally included into ES6 standard;

---
# Await
Introduced in ES7, `await` can only be used in `async` function;

```javascript
function finish_lazy_work(success){
  return new Promise((resolve, reject) => {
    setTimeout(function(){
      if(success)
        resolve('my job is done');
      else
        reject('my job failed');
    }, 1000);
  });
}

var start_job = async function(flag) {
  try {
    var job = await finish_lazy_work(flag);
    console.log(job);
  } catch (err) {
    console.log(err);
  }
}

// fake to finish job
console.log(start_job(true));
> my job is done
// fake to fail job
console.log(start_job(false));
> my job failed

```

---
# Destructuring
Destructuring allows binding using pattern matching, with support for matching arrays and objects. Destructuring is failsoft, similar to standard object lookup foo["bar"], producing undefined values when not found.

```javascript
// list matching
var [a, , b] = [1,2,3];

// object matching
var {b, c = 1} = {a: 1, b: 2}
// b=2; c=1, Fail-soft destructuring with defaults
```

---
# Spread+Rest
Spread Operator && Rest Operator, the three dots ...

- Rest parameters

```javascript
function myFunc(a, b, ...args) {
 console.log(a); // 22
 console.log(b); // 98
 console.log(args); // [43, 3, 26]
};
myFunc(22, 98, 43, 3, 26);
```
- Spread Operator for array

```javascript
const featured = ['Deep Dish', 'Pepperoni', 'Hawaiian'];
const specialty = ['Meatzza', 'Spicy Mama', 'Margherita'];

const pizzas = [...featured, 'veg pizza', ...specialty];

console.log(pizzas); // 'Deep Dish', 'Pepperoni', 'Hawaiian', 'veg pizza', 'Meatzza', 'Spicy Mama', 'Margherita'
```

- Spread operator for merging object

```javascript
var obj1 = { foo: 'bar', x: 42 };
var obj2 = { foo: 'baz', y: 13 };

var clonedObj = { ...obj1 };
// Object { foo: "bar", x: 42 }

var mergedObj = { ...obj1, ...obj2 };
// Object { foo: "baz", x: 42, y: 13 }
```
