#!/bin/sh
# rebuild
rm -rf _site
jekyll build

# by pass jekyll
touch _site/.nojekyll

echo ".sass-cache\n.jekyll-metadata" > .gitignore
git add _site && git commit -m "Initial _site subtree commit"
git reset --soft

echo "_site\n.sass-cache\n.jekyll-metadata" > .gitignore

# delete remote-pages
git push origin --delete gh-pages

git subtree push --prefix _site origin gh-pages
