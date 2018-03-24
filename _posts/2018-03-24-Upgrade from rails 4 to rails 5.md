---
layout: post
comments: true
title:  "Upgrade from rails 4 to rails 5"
category: develop
tags: rubyonrails
---

Rails 5 has been released for a while, recently I was asked to upgrade from rails 4.2 to rails 5.1, it is quite straight forward, but there are some issues worth recording.

# Tips
After some googling, many people suggests remove all the version lock in `Gemfile` and run `bundle update`, this might help for some projects, but in my case I got into the issue below for 1 hours, cannot be resolved, but it's still good to try first.
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
- Doing patch update first to the lastest version of 4.2.x, vim Gemfile to `~>`
```
gem rails, '~> 4.2.0'
```
then run `bundle update`
- In my case this will update my rails to rails 4.2.10, without any issue.
```
bundle exec rails s(bundle exec thin start)
```
I have saw a lot of deprecation warnings in the console, I fixed them one by one.

# Upgrade to rails 5.0.0
- Edit Gemfile then run `bundle update rails`
```
gem 'rails', '5.0.0'
```
- If your project is anything like mine, you would have a lot of bundler's cannot find compatible version errors for many gems. I have found most of them are just for **development or test**, my solution is:
1. checkout the github issues of the gem you are using for supporting rails 5;
2. comment that line out in the Gemfile for now if it's must have for **production**
- Luckily I commented out a few gems and run `bundle update rails`, toda installing all the dependencies.
- After rails 5 is installed, I uncomment these gems and do `bundle install`, it auto fetches them again.
- Now is actually the good time to upgrade all the Gems as manuy as possible, but be carefully some will having breaking changes, luckily I have a rspec tests as the baseline, you should have tests before upgradeing rails.

# Post-install rails 5
- It's very likely your application will be borken at this point,
```
bundle exec rake rails:update
```
use `git diff` to carefully merge your old configurations with the new rails configurations.
- Fix all tests
- Fix all deprecation warnings

