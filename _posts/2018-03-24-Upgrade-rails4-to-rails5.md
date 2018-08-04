---
layout: post
comments: true
title:  "Upgrade from Rails 4 to Rails 5"
icon: D
lang: en
category: develop
tags: rubyonrails
---

Rails 5 has been released for a while, recently I was asked to upgrade from rails 4.2 to rails 5.1, it is quite straightforward, but there are some issues worth recording.

# First thing try first
After some googling, many people suggest remove all the version lock-in `Gemfile` and run `bundle update`, this might help for some projects, but in my case, I got into the issue below for 1 hours, cannot be resolved, but it's still good to try first.
```ruby
Resolving dependencies...........................................................................
.................................................................................................
.................................................................................................
.................................................................................................
.................................................................................................
.................................................................................................
.................................................................................................
.................................................................................................

```
# Patch update rails first
- Doing patch update first to the latest version of 4.2.x, vim Gemfile to `~>`
```
gem rails, '~> 4.2.0'
```
then run `bundle update`
- In my case, this will update my rails to rails 4.2.10, without any issue.
```
bundle exec rails s(bundle exec thin start)
```
I have seen a lot of deprecation warnings in the console, I fixed them one by one.

# Upgrade to Rails 5.0.0
- Edit Gemfile then run `bundle update rails`
```
gem 'rails', '5.0.0'
```
- If your project is anything like mine, you would have a lot of bundler's cannot find compatible version errors for many gems. I have found most of them are just for **development or test**, my solution is:
1. checkout the github issues of the gem you are using for supporting rails 5;
2. comment that line out in the Gemfile for now if it's must have for **production**
- Luckily I commented out a few gems and run `bundle update rails`, toda installing all the dependencies.
- After rails 5 is installed, I uncomment these gems and do `bundle install`, it auto fetches them again.
- Now is actually the good time to upgrade all the Gems as many as possible, but be carefully some will having breaking changes, luckily I have Rspec tests as the baseline, you should have tests before upgrading rails.

# Post-install Rails 5
- It's very likely your application will be borken at this point,
```
bundle exec rake rails:update
```
For Rails 5.1, the command is `bin/rake app:update`.
Use `git diff` to carefully merge your old configurations with the new rails configurations.
- Then run `bin/rake app:update:bin` to update the bin binary, which i think should be included in the git repo.

# A list of breaking changes:
1. Gem `quiet_assets`, `test_after_commit` are included in Rails 5, should delete in Gemfile.
2. Gem `factory_girl_rails` is renamed to `factory_bot_rails`.
3. Enum type, **where(field: string)** no longer work, changed to **where(field: fields[field]) or where(field: :symbol)**
4. Enum finally support `_prefix` and `_suffix`
5. **render nothing: true, status: 401** is deprecated, change to **head :unauthorized**.
6. `belongs_to` default to `optional: false`, so association is required, it's said you can configure the setting
```
Rails.application.config.active_record.belongs_to_required_by_default = false
```
however, according to [the known issue][issue-url], it cannot be turned off when **activerecord-session_store** is used.
7. `config.active_job.queue_adapter = :async` by default which uses concurrent-ruby. But this is not recommended for production environments.
8. Finally can use hash#dig, `{}.dig(:firstkey, :secondkey)`
9. `ActiveRelation#uniq` is removed in 5.1, will have to use `ActiveRelation#distinct`

[issue-url]: https://github.com/rails/activerecord-session_store/issues/116
