---
layout: post
title:  "Understand $.Deferred and Promise"
category: develop
icon: B
lang: en
tags: jQuery
---

In short, `$.Deferred` and `Promise` are asynchronous value.
Sepuencial asynchronous process will easily getting into callback hell, inorder to resolve the problem, these two concepts are introduced.

# $.Deferred

This is a jQuery implementation introduced in 1.5
## Creation
`var deferred = jQuery.Deferred();` or
`var deferred = $.Deferred();`
once it's created, it will expose these methods:

- always(callback)
- done(callback)
- fail(callback)
- resolve(value)
- reject(value)
- promose()

`promise()` returns an object that is very similar to the `Deferred` object except that it only has `then(), done(), and fail()` methods and does not have `resolve() or reject()`.

## Usage
```javascript
function lazy_work(){
  return new Promise((resolve, reject) => {
    setTimeout(function(){
      resolve('my job is done');
    }, 3000);
  });
}

function lazy_work2(){
  var deferred = $.Deferred();
  setTimeout(function(){
    deferred.resolve('my job is done');
  }, 3000);
  return deferred;
}
lazy_work().then(data => {console.log(data)})
lazy_work2().then(data => {console.log(data)})
# => show 'my job is done' after 3 seconds.
```

