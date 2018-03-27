---
layout: post
title:  "Understand $.Deferred and Promise"
category: develop
icon: B
tags: jQuery code
---

In short, `$.Deferred` and `Promise` are asynchronous value.
Sepuencial asynchronous process will easily getting into callback hell, inorder to resolve the problem, these two concepts are introduced.

# $.Deferred

This is a jQuery implementation introduced in 1.5
## creation
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



