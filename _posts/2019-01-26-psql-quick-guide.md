---
layout: post
title:  "PostgreSQL sql funcs Quickguide"
lang: en
icon: w
category: develop
tags: postgres
comments: true
---

## Introduction
A list of commonly used functions/indexes/helpers for postgres SQL statements;

- [LOWER](#lower)
- [NOW](#now)
- [INTERVAL](#interval)
- [REGEX_REPLACE](#regex-replace)
- [COALESCE](#coalesce)
- [EXPLAIN ANALYZE](#explain-analyze)
- [Index](#index)

## LOWER
```sql
SELECT LOWER("rooms"."name") FROM "rooms";
```
This is straight forward, LOWER() function convert string into small case letters, non-alpha letters are skipped;

## NOW
```sql
SELECT (NOW() - "rooms"."created_at") FROM "rooms";
```
NOW() will return the current date time from the postgres engine;
so the result will be e.g. `5 days 13:58:30.700536`;

## Interval
```sql
SELECT (NOW() - INTERVAL '1 day');
           ?column?
-------------------------------
 2019-01-25 19:29:46.430743+11
(1 row)
```
can do for `days, hours, minutes, seconds, ms, months, weeks, years` for interval

## REGEX REPLACE
replace string pattern with something string
@params: (value, regex scanner, replace string[, 'g'])
```sql
SELECT REGEXP_REPLACE('<head>header</head><body>body<body>', '<[^\<]*>', '', 'g');
```
This will remove all tags; resulting in `headerbody`; 'g' will apply the replacement globally;
```sql
SELECT REGEXP_REPLACE('<head>header</head><body>body<body>', '<[^\<]*>', '');
```
This will remove the first match; resulting in `header</head><body>body<body>`

## COALESCE
Return the first non-null value, often used to replace null field to an alternative string;
```sql
SELECT COALESCE(NULL, NULL, NULL, 'alternative', NULL, 'alternative2');
```
this will return "alternative", and an example usage in relality is like this:
`SELECT COALESCE("users"."name", 'guest');` purpose is to set default user name as `guest`;

## EXPLAIN ANALYZE
Syntax: add `EXPLAIN ANALYZE` to select statement will generate a analyse report, e.g.
```
EXPLAIN ANALYZE SELECT  "rooms".* FROM "rooms" WHERE (REGEXP_REPLACE(LOWER(name), '[^a-z0-9]+', '', 'g') LIKE '%b7e%') ORDER BY levenshtein(name, 'b7e'), "rooms"."name";
                                                   QUERY PLAN
-----------------------------------------------------------------------------------------------------------------
 Sort  (cost=19.23..19.28 rows=20 width=135) (actual time=3.437..3.437 rows=0 loops=1)
   Sort Key: (levenshtein((name)::text, 'b7e'::text)), name
   Sort Method: quicksort  Memory: 25kB
   ->  Seq Scan on rooms  (cost=0.00..18.80 rows=20 width=135) (actual time=2.869..2.869 rows=0 loops=1)
         Filter: (regexp_replace(lower((name)::text), '[^a-z0-9]+'::text, ''::text, 'g'::text) ~~ '%b7e%'::text)
         Rows Removed by Filter: 5
 Planning time: 14.188 ms
 Execution time: 4.979 ms
(8 rows)
```
(cost=19.23..19.28 rows=20 width=135) means that Postgres expects that it will “cost” 19.28 unit to find these values, the `19.23` is the cost at which this node can begin working(prepare all the regex replace and lower), here the `unit` means `arbitrary unit of computation`, rows is the estimated number of rows this Index Scan will return, and width is the estimated size in bytes of each row;

`(actual time=3.437..3.437 rows=0 loops=1)` means the the Sort was executed 1 time(loop value), and it returns 0 rows in 3.437 units.

`Seq Scan` is searching by sequencial order, `Bitmap Heap Scan` is for fields has bitmap index, so often it indicates index should be added for more efficiently searching.

## Index
For fields whose value will be searched on WHERE clause directly, a b-tree index is good for that purpose:

```
CREATE INDEX index_rooms_on_name ON public.rooms USING btree (name);
```

For fields which are searched on WHERE clause with `LIKE`, should use trigram index, it basically break down the values into 3-letter gram for quick reference, as a result the it will only take effect when the LIKE clause is more than 4 letters.

```
CREATE INDEX index_rooms_on_regex_replace_lower_name ON public.rooms USING gin (regexp_replace(lower((name)::text), '[^a-z0-9]+'::text, ''::text, 'g'::text) public.gin_trgm_ops);
```

This is to create a trigram index of rooms.name field, but only for pre-computed name field value with all the non-digit-non-alpha letters removed.
