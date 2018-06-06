#!/bin/sh
# rebuild
rm -rf _site
jekyll build

# by pass jekyll
touch _site/.nojekyll

echo ".DS_Store\n.sass-cache\n.jekyll-metadata" > .gitignore
git add _site && git commit -m "Initial _site subtree commit"

# delete remote-pages
git push origin --delete gh-pages

git subtree push --prefix _site origin gh-pages

git reset HEAD~
echo "_site\n.DS_Store\n.sass-cache\n.jekyll-metadata" > .gitignore

echo 'Deploy to github'

echo 'Start depoly _site to ali cloud...'

rm _site/*.sh
scp -r ./_site/* root@47.74.183.6:/srv/www/cheeger.com
