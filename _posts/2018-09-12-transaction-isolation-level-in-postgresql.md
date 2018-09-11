---
layout: post
title:  "PostgreSQL 事务隔离"
lang: cn
category: develop
tags: postgresql, isolation
comments: true
---

# ACID
一个好的数据库必须满足ACID四个特性。
- A: Atomicity原子性
一个事务的全部操作要么全部执行或者全部不执行。
- C: Consistency一致性
数据必须从一种一致性的状态到另一种一致性的状态。
- I: Isolation隔离性
一个事务未执行完毕，未提交的数据不能被另一个事务看见。
- D: Durability持久性
一旦事务提交了，系统崩溃也不会丢失数据。

# Isolation Level

![isolation level]({{"/isolation_level/isolation_level.png" | prepend: site.image_root }})

- Read uncommitted(dirty read) 脏读

一个事务（transaction）的修改没有提交（commit）也可以被其他事务读取，读取的数据可能是不正确的。
- Read committed 不可重复读，幻读

大部分数据库的隔离级别，没有commit的事务修改不可被其他事务读取，但是会导致另一事务读取不一致的结果。
T2 read a -> T1 update a and commit -> T2 read a
- Repeatable Read 可重复读

给当前的读加锁，防止中途数据改变。
- Serializable 可串行化

最强的隔离级别，给所有的读行加锁，写加写锁，但是这会导致大量超时以及锁冲突。

# MVCC
Multiple-version-concurrency-control
- 非阻塞读+写操作只锁必要的行
- Select 不加锁
- Update where columnA = ...
    - has index on column A lock related rows only
    - has no index on column A lock the whole table

# postgreSQL
For postgreSQL, transactions in SQL are isolated with Read Committed level.
Two select commands can return different data in the same transaction.

in psql:
    BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
    BEGIN; -- the default is READ COMMITED
    BEGIN TRANSACTION ISOLATION LEVEL READ UNCOMMITED;


