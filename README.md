# Add a new post

go to the `_posts/` add a post with name following

**YEAR-MONTH-DAY-title.MARKUP**

e.g.

    2011-12-31-new-years-eve-is-awesome.md
    2012-09-12-how-to-write-a-blog.md

Start of post:

    ---
    layout: post
    title: Blogging Like a Hacker
    category: genetal | programming | server
    ---

# script

There are two scripts in this projects

- `add.sh` to add new post

    sh add.sh 'title'

- `deploy.sh` to deploy to both Github Page / My own server

    sh deploy.sh
