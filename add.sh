if [[ -z "$1" ]]
then
  echo "title is missing;\n $ sh add Title"
  exit
fi
# date format
NOW=$(date +"%Y-%m-%d")
TITLE=$1
touch "./_posts/$NOW-$TITLE.md"


cat <<EOT >> "./_posts/$NOW-$TITLE.md"
---
layout: post
title:  "$1"
tags: general
---

EOT

vim "./_posts/$NOW-$TITLE.md"
