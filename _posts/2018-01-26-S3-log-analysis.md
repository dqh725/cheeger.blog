---
layout: post
comments: true
title:  "HTTP Log Analysis for aws s3 usage"
icon: c
lang: en
category: develop
tags: aws S3 goaccess log
---

AWS s3 is charging by storage and downloading in KB, so sometime it's is useful to find out how much data the clients is using so we know how much we should bill them, this could be done via S3 log, which is http access log basically.

### Resource and tools needed:

- AWS S3 bucket
- s3cmd: collect logs to local
- goaccess: ([Github Link][goaccess-github]; [Home Page][goaccess-home]) visualise tool


### How to do it?
#### 1. Enable S3 bucket server logging

[The official doc][enable-s3-doc]

In short, AWS S3 doesn't enable s3 logging by default, so first you will have to enable server logging first, go to the `bucket` -> `Properties` -> `Server access logging`, the log will be saved in an S3 bucket as well.

Ideally, you should choose the destination bucket differently from the source bucket. However, save logs into the source bucket with a different `prefix` is allowed too. (Extra cost for saving log files)

---
#### 2. Collect logs via s3cmd

Note: log might be deplayed in hours;

- Install **s3cmd** or **aws**

      brew install s3cmd

- Configure s3cmd

      s3cmd --configure

  ![Provide the default information in the prompt]({{"/log_analyse/1.png" | prepend: site.image_root }})
  The most basic configuration is the `Access Key`, `Secret Key` and `Default Region`, you can leave all the others with s3cmd's default setting.

  In order for s3cmd access the logs, you need to have an AWS IAM Roles pre-defined, which have read access to the destination bucket. From that IAM Roles, you can generate the credential for API access, which is the `access key` and `secret key`.

  In the configuration prompt, you can test the connection with your setting before you save it, and the config will be saved in `~/.s3cfg` by default.

- Collect logs

      s3cmd sync  s3://[bucket_name]/[prefix]/ /path/to/your/local/

  `/` in the end is required, and replace the `[bucket_name]` and `[prefix]` to log bucket and its `prefix`, and all the log file will be saved in your local folder

        cd /path/to/your/local

  Each log file will look like `2018-01-22-04-17-29-D30883E096442F77`.

---
### 3. Analyse log via goaccess
* install goaccess: ([Gethub Link][goaccess-github]; [Home Page][goaccess-home])

      brew install goaccess

  can also make from Github repo.

  Goaccess is quite easy to use, and it has s3 log format predefined, and it has the prompt to guide you when running, just do

      goaccess * # select s3 log by typing space

  or predefine configuration file

      goaccess --dcf # this will print the path of the default configuration file

      vim /path/from/above

  Three fields are required, `date-format`, `time-format`, `log-format`
  in my example:

      time-format %H:%M:%S
      date-format %d/%b/%Y
      log-format %^ %v [%d:%t %^] %h %^"%r" %s %^ %b %^ %L %^ "%R" "%u"

  - GoAccess requires the following fields:
  - a valid IPv4/6 %h
  - a valid date %d
  - the request %r

  The log-format is defined in regex, see details in [MAN PAGE][goaccess-manpage], or `man goaccess`

  Finally you can produce the report,

      ag org s3_logs/ | less | goaccess $1

  As in my case, I have to filter my logs and group all the logs by the query string `path?org=org_id` before apply goaccess.

  And to generate a html/csv report

      goaccess * --no-csv-summary -o report.csv
      goaccess * -o report.html

  My terninal view looks like this
  ![My Goaccess View]({{"/log_analyse/2.png" | prepend: site.image_root}})

[goaccess-github]: https://github.com/allinurl/goaccess
[goaccess-home]: https://goaccess.io
[enable-s3-doc]: https://docs.aws.amazon.com/AmazonS3/latest/user-guide/server-access-logging.html
[goaccess-manpage]: https://goaccess.io/man#custom-log
