---
layout: post
title:  "S3 Log Analysis"
category: programming
tags: aws S3 goaccess log_analysis
---

Recently, I have been working on analysing AWS S3 Bucket usage, in order to produce a report of uploading and downloading of s3 objects. The process is quite tricky, here I will show you how to do it.

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

One important thing that I have noticed is that the logs might be delayed in hours.

First, I installed **s3cmd** command line tool

    brew install s3cmd

Then, configure the s3cmd
G
    s3cmd --configure

![Provide the default information in the prompt]({{"/images/posts/log_analyse/1.png"}})
The most basic configuration is the `Access Key`, `Secret Key` and `Default Region`, you can leave all the others with s3cmd's default setting.

In order for s3cmd access the logs, you need to have an AWS IAM Roles pre-defined, which have read access to the destination bucket (can read the log file). From that IAM Roles, you can generate the credential for API access, which is the `access key` and `secret key`.

In the configuration prompt, you will be able to test the connection with your setting before you save it, and finally, it will be saved in the `~/.s3cfg` by default.

After the setting is done, now we are ready to collect the log files.

    s3cmd sync  s3://bucket_name/prefix/ /path/to/your/local/

`/` in the end is required, and replace the `bucket_name` and `prefix` to log bucket and its `prefix`, and all the log file will be saved in your local folder

    cd /path/to/your/local

My log file name look like this `2018-01-22-04-17-29-D30883E096442F77`.

---
### 3. Analyse and visualise log via goaccess
Firstly, install goaccess: ([Gethub Link][goaccess-github]; [Home Page][goaccess-home])

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
![My Goaccess View]({{"/images/posts/log_analyse/2.png"}})

[goaccess-github]: https://github.com/allinurl/goaccess
[goaccess-home]: https://goaccess.io
[enable-s3-doc]: https://docs.aws.amazon.com/AmazonS3/latest/user-guide/server-access-logging.html
[goaccess-manpage]: https://goaccess.io/man#custom-log
