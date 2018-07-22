#!/bin/sh
# rebuild
rm -rf _site
webpack
jekyll build

# delete remote-pages
# git push origin --delete gh-pages

# git subtree push --prefix _site origin gh-pages

echo 'Start depoly _site to ali cloud...'

rm _site/*.sh
scp -r ./_site/* root@47.74.183.6:/srv/www/cheeger.com
