---
layout: post
title:  "[DP] Factory Pattern"
lang: 中文
category: develop
tags: design-pattern
comments: true
---

# 介绍
准备做一起设计模型的介绍，主要的参考是一本书：Design Patterns Elements of Reusable Object-Oriented Software
作者是4位大侠，Erich，Richard，Ralph，John，也叫四人帮, GoF（Gang of Four）
> Coding to interfaces, not implementation

# 目的
当要处理具有关联性的不同东西（动物，形状，颜色等）的时候，必要的准备工作有以下3点；

1. 给每一样东西定义一个class。
2. 给每一个东西的class都注入处理的具体方法。
3. 给整体处理的逻辑写一个method或者class

Factory Pattern的目的就是如何有效的组织这些class文件，以便应对将来可能的扩展，比如添加处理方法，添加更多类型。

# 具体的例子

写一个画板程序，这个程序可以画圆形，长方形，三角形， 准备工作：
1. 给圆形，长方形，三角形各写一个class。
2. 不同形状画法不一样，每个class注入画的方法。
3. 写一个画版Canvas的class，分别给给圆形，长方形，三角形创建一个对象，然后使用这三个工具画画吧。

# Factory 方案

![Factory]({{"/design_pattern/factory.jpg" | prepend: site.image_root }})

# 分析

1. Canvas的逻辑已经足够复杂了，不同形状画法的逻辑被完全的抽离，这样可以让Canvas这个class更加关注它自己的工作，代码管理更加有效。比如需要画圆的时候，调用shapeFactory.getShape('circle').draw()即可。

2. 添加新的形状（五角星），需要写一个新的五角星的class，然后在ShapeFactory里面注册这个class。

3. 便于扩展，方便管理，画图软件里的画笔类型可以有成百上千种，添加新的类型可以基本不更改Canvas的代码。

4. Factory的扩展Abstract Factory Pattern

    沿袭Factory Pattern的思路，形状有shapeFactory，颜色有ColorFactory，画笔有penFactory等等，这么多Factory本身也是同类型的东西，但是因为Factory的功能是不同的，用继承的思路并没有什么优势，所以一般的处理方法是通过添加一个抽象的class，其他的思路不变。

        abstract class factory
          abstract Shape getShape;
          abstract Color getColor;
          abstract Pen getPen;
