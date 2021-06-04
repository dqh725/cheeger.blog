---
layout: post
title:  "PostgreSQL 事务隔离"
lang: cn
icon: y
category: develop
tags: postgresql, isolation
comments: true
---

**<span style="color: rgb(255, 76, 0);">
</span>**
# ACID
传统的关系型数据库最好是要满足ACID四个特性。
- A: **<span style="color: rgb(255, 76, 0);">Atomicity原子性</span>**
一个事务的全部操作要么全部执行或者全部不执行。
- C: **<span style="color: rgb(255, 76, 0);">Consistency一致性</span>**
数据必须从一种一致性的状态到另一种一致性的状态。
- I: **<span style="color: rgb(255, 76, 0);">Isolation隔离性</span>**
一个事务未执行完毕，未提交的数据不能被另一个事务看见。
- D: **<span style="color: rgb(255, 76, 0);">Durability持久性</span>**
一旦事务提交了，系统崩溃也不会丢失数据。

# Isolation Level

为了兼顾数据库的性能，可以根据需求调整相应隔离水平。

![isolation level]({{"/isolation_level/isolation_level.png" | prepend: site.image_root }})

- Read uncommitted(dirty read)
**<span style="color: rgb(255, 76, 0);">
脏读: 没完成的修改提前被发现了
</span>**

一个事务（transaction）的修改没有提交（commit）也可以被其他事务读取，读取的数据可能是不正确的。

- Read committed
<br />
**<span style="color: rgb(255, 76, 0);">
不可重复读: 前后两次阅读中间被别人修改了
<br />
幻读: 修改全部的同时被插入一列导致有一个没有修改的幻觉。
</span>**

大部分数据库的隔离级别，没有commit的事务修改不可被其他事务读取，但是会导致另一事务读取不一致的结果。
T2 read a -> T1 update a and commit -> T2 read a

- Repeatable Read
**<span style="color: rgb(255, 76, 0);">
可重复读
</span>**

幻读：是指当事务不是独立执行时发生的一种现象，例如第一个事务对一个表中的数据进行了修改，这种修改涉及到表中的全部数据行。同时，第二个事务也修改这个表中的数据，这种修改是向表中插入一行新数据。那么，以后就会发生操作第一个事务的用户发现表中还有没有修改的数据行，就好象发生了幻觉一样。

解决方法是给当前的读加读锁，防止中途数据改变。
- Serializable 可串行化

最强的隔离级别，给所有的读加读锁，写加写锁，但是这会导致大量超时以及锁冲突。

# MVCC
Multiple-version-concurrency-control
- 非阻塞读+写操作只锁必要的行
- Select 不加锁
- Update where columnA = ...
    - has index on column A lock related rows only
    - has no index on column A lock the whole table

# PostgreSQL
For postgreSQL, transactions in SQL are isolated with Read Committed level.
Two select commands can return different data in the same transaction.

To change the level in psql:

    BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

    BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;

    BEGIN; -- the default is READ COMMITED

    BEGIN TRANSACTION ISOLATION LEVEL READ UNCOMMITED;

