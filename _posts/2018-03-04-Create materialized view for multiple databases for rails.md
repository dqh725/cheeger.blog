---
layout: post
title:  "Create materialized view for multiple databases for rails"
category: database
tags: rails MaterializedView PostgreSQL dblink
---

# Introduction
When rails app works with multiple databases, the database performance could be an issue due to the join features is blocked across databases. Even though dblink provides a way for the database to connect an external database, the latency is high if join via dblink. A better solution is to create a materialized view via dblink and save it.

The background: One of my rails app, beside from the default primary database, it has another PG database created by the gem [secondbase][secondbase], the second DB contains all the usage stats, which is not important but query intensive, therefore it causing a lot of performance issue, when query stats data.

If there is only one database, and you want to use views to cache SQL Query, the gem [scenic][scenic] does a good job.

# Open external connection via dblink
- Get the dblink connnection str into a initializer

```ruby
hash = ActiveRecord::Base.connection_config
dblink_hash = {}
dblink_hash[:dbname] = hash[:database]
dblink_hash[:host] = hash[:host] if hash[:host]
dblink_hash[:user] = hash[:username] if hash[:username]
dblink_hash[:password] = hash[:password] if hash[:password]
DBLINK_INFO = dblink_hash.map { |k, v| "#{k}=#{v}" }.join(' ')
```
[connection str options][pg-dblink]

- SQL via dblink

```sql
SELECT * FROM dblink('#{DBLINK_INFO}', 'SELECT STR against the external db')
```

# Create Materialized View in migration
Create a Materialized view in rails migration

```ruby
execute(
  <<-QUERY
    CREATE MATERIALIZED VIEW second_users AS (
      SELECT * FROM dblink('#{DBLINK_INFO}',
        'SELECT users.id, users.name FROM users')
      AS second_users(user_id uuid, name text)
    );
  QUERY
)
```
this will create a second_users in the secondbase, which will be a copy of the users tables


# Syncing Materialized View
Since PostgreSQL deals  with the Mview the same way as table, so we can create a model against the view.
```ruby
class SecondUser < SecondBase::Base # ActiveRecord::Base
  has_many :associations, foreign_key: :user_id

  def self.refresh_materialized_view(concurrently = false)
    # postgresql_version >= 9.4 if concurrently = true
    connection.execute "REFRESH MATERIALIZED VIEW #{concurrently ? 'CONCURRENTLY' : ''} second_users;"
  end
end

```
Finally set a rake task to sync daily;

[secondbase]:https://github.com/customink/secondbase
[pg-dblink]:https://www.postgresql.org/docs/9.6/static/libpq-connect.html#LIBPQ-CONNSTRING
[scenic]:https://github.com/thoughtbot/scenic
