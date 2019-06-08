---
layout: post
title:  "Understand $.Deferred and Promise"
category: develop
icon: B
lang: en
tags: jQuery
---

`$.Deferred` and `Promise` are asynchronous value, a very powerful feature to execute a sequential functions in order based on the previous one's result, either succeed or failed.

## $.Deferred

This is a jQuery implementation introduced in 1.5

### Creation
```
var deferred = jQuery.Deferred();
or
var deferred = $.Deferred();
```
once it's created, it will expose these methods:

- always(callback)
- done(callback)
- fail(callback)
- resolve(value)
- reject(value)
- promose()

## Promise

`new Promise(callbackForSuccess, callbackForFailed)` returns an object that is very similar to the `Deferred` object except that it only has `then(), done(), and fail()` methods and does not have `resolve() or reject()`.


### Usage
- example1:

```javascript
var promise = new Promise((callback1, callback2) => callback1("succeedValue"));
promise.then(console.log); # => succeedValue;
```

- example2:

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

