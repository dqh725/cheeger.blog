---
layout: post
comments: true
title:  "Image processing with AWS lambda & S3 buckets"
icon: c
category: develop
tags: AWS lambda S3
---

# Use AWS lambda for image processing
This is the toturial of how to file processing after uploading to s3 in aws lambda with node 4.

# How it works
1. Create a AWS Lambda,
![create a new lambda]({{"/images/posts/lambda/new_lambda.png"}})
2. Create a IAM role with the buildin AWS policy, in my case, I name the role `lambda_s3_writer`
![with the default policy]({{"/images/posts/lambda/aws_policy.png"}})
N.B. the default policy include `read/write` access to all S3 buckets, and permissions to write logs to cloudwatch.
3. Setup a lambda trigger event, mine is just set when an object is uploaded into s3 bucket
![lambda trigger]({{"/images/posts/lambda/trigger.png"}})
4. There are 3 ways upload function code, uploading the whole code package into a zip file, and upload to one S3 bucket, then copy the S3 object link into the lambda configuration.
5. You can also set `Environment variables` in lambda as well.

# Functional Code

AWS lambda have imagemagick installed by default, so I can just use [gm][gm-github] for image processing.

For extract file metadata, I recommend to use ffprobe, which can deal with `image/video/audio` files. However, in order to user `ffprobe` command in lambda, we will need to include this binary file in the package zip too. Luckily, we can use [node module of ffprobe binary][ffprobe-binary] together with [node module of ffprobe wrapper][ffprobe-github]

`npm install node-ffprobe --save`

`npm install ffprobe-static --save`

**index.js**
{% highlight JavaScript %}
'use strict';
var WIDTH = 1920;
var HEIGHT = 1080;
// get media file metadata
var probe = require('node-ffprobe');
var ffprobe = require('ffprobe-static');
probe.FFPROBE_PATH = ffprobe.path; // use the ffprobe-static's binary path
// resize image; fitScreen/bordering
var tools = require('./tools.js');
// POST to backend
var request = require('request');

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

function waterfall(obj_params, callback) {
  ffprobe_meta(obj_params.Key)
    .then(meta => {
      console.log(`[need resize] ${need_resize(meta)}`);
      if(need_resize(meta)) {
        var info = {
          height: meta.streams[0].height,
          width: meta.streams[0].width,
          format: meta.streams[0].codec_name
        };
        return download(obj_params)
                 .then(s3object => resize(s3object, info))
                 .then(newObject => save(newObject, obj_params))
                 .then(() => ffprobe_meta(obj_params.Key))
      }
      else
        return Promise.resolve(meta);
    })
    .then(meta => {
      console.log('start posting...');
      request({
        url: process.env.SERVER_ORIGIN + process.env.END_POINT
        method: 'PATCH',
        json: true,   // required
        body: paramlise(meta, obj_params.Key)
      }, function (error, response){
        if (response.statusCode < 400) {
          console.info('Message posted successfully');
          callback(null);
        } else if (response.statusCode < 500) {
          console.error(`Error posting message to Slack API: ${response.statusCode} - ${response.statusMessage}`);
          callback(null);  // Don"t retry because the error is due to a problem with the request
        } else {
          // TODO: Let Lambda retry
          callback(`Server error when processing message: ${response.statusCode} - ${response.statusMessage}`);
        }
      });
    })
    .catch(err => console.log(err));
}

function ffprobe_meta(key) {
  console.log('[ffprobe_meta] trying to ffprobe...');
  return new Promise((resolve) => {
    probe(getpath(key), function(err, file_meta){
      if(err)
        console.log('[ffprobe_meta] ffprobe err:', err);
      else
        resolve(file_meta);
    });
  });
}
function download(obj_params){
  console.log(`[download] start downloading s3 object: ${obj_params.Key}`);
  return new Promise((resolve, reject) => {
    s3.getObject(obj_params, function(err, data){
      if(err) {
        console.log('[download] err:', err);
        reject(err);
      }
      else
        resolve(data);
    });
  });
}

// option = "bordering | stretch"
function resize(s3object, info) {
  console.log('[resize] trying to resize...');
  var option = s3object.Metadata['resize'];
  console.log(`[resize] option: ${option}`);
  if(option === 'stretch'){
    return tools.fitScreen(s3object.Body)
             .then(newBuffer => {
               return {
                 Body: newBuffer,
                 ContentDisposition: s3object.ContentDisposition,
                 Metadata: { 'resized': 'stretch' }
               }
             });
  }
  else if(option === 'bordering'){
    return tools.bordering(s3object.Body, info)
             .then(newBuffer => {
               return {
                 Body: newBuffer,
                 ContentDisposition: s3object.ContentDisposition,
                 Metadata: { 'resized': 'bordering' }
               }
             });
  }
  else {
    console.log('invalid option');
    return Promise.reject('invalid option');
  }
}

// replace the original s3 object with the resized image buffer and return the metadata of the new file
function save(newObject, obj_params){
  console.log('[save] replace the s3 object with resized one');
  newObject.Bucket = obj_params['Bucket'];
  newObject.Key = obj_params['Key'];
  return new Promise((resolve, reject) => {
    s3.putObject(newObject, function(err, data){
      if(err) {
        console.log(err);
        reject(err);
      }
      else {
        console.log('[save] image is successfully saved.');
        resolve(data);
      }
    });
  });
}

// ffprobe only work with path/url, cannot work with buffer
function getpath(key){
  return process.env.BUCKET_ORIGIN + '/' + key;
}

function paramlise(data, key) {
  var params = {};
  params.file_size = data.format.size;
  params.duration = data.format.duration;
  params.width = data.streams[0].width;
  params.height = data.streams[0].height;
  params.lambda_token = process.env.LAMBDA_TOKEN;
  params.location = key;
  return params;
}

// image with incorrect dimension will need resize
function need_resize(data) {
  if(data.streams[0].width === WIDTH && data.streams[0].height === HEIGHT)
    return false;
  var codec_name = data.streams[0].codec_name;
  if(codec_name === 'png' || codec_name === 'mjpeg' || codec_name === 'gif')
    return true;
  else
    return false;
}

// lambda entry
exports.handler = (event, context, callback) => {
  var obj_params = {
    Key: unescape(event.Records[0].s3.object.key),
    Bucket: unescape(event.Records[0].s3.bucket.name)
  };
  waterfall(obj_params, callback);
};

{% endhighlight %}
**tools.js** // a js lib to resize images
{% highlight JavaScript %}
var gm = require('gm').subClass({ imageMagick: true });
var WIDTH = 1920;
var HEIGHT = 1080;
var RATIO = 16.0/9;

// dimension     ratio        scale          add bar
// 1920x1080     1.78         /              /
// 960x540       1.78         WIDTH/width    /
// 1920x1000     1.92         WIDTH/width    bottom
// 1800x1080     1.67         HEIGHT/height  right

var borderFigures = function(width, height) {
  var ratio = width * 1.0 / height;
  var percentage = ratio > RATIO ? WIDTH * 1.0 / width : HEIGHT * 1.0 / height;
  // force it an even integer, simpler to add two bars on two sides
  var scaled_width = parseInt(width * percentage) + parseInt(width * percentage) % 2;
  var scaled_height = parseInt(height * percentage) + parseInt(height * percentage) % 2;
  return {
    scaled_width: scaled_width,
    scaled_height: scaled_height,
    border_height: ratio > RATIO ? (HEIGHT-scaled_height)/2 : 0,
    border_width: ratio > RATIO ? 0 : (WIDTH-scaled_width)/2
  };
};

var getInfo = function(buffer) {
  return new Promise((resolve) => {
      gm(buffer)
        .identify({ bufferStream: true }, (err, meta) => {
          if(err) {
            console.log(`[bordering] gm err: ${err}`);
            reject(err);
          }
          else
            resolve({
              width: meta.size.width,
              height: meta.size.height,
              format: meta.format
            });
        });
  });
};

// meta: {width, height, format}
var resizeBuffer = function (buffer, meta) {
  return new Promise(resolve => {
    var vars = borderFigures(meta.width, meta.height);
    gm(buffer)
      .resizeExact(vars.scaled_width, vars.scaled_height)
      .borderColor(255)
      .border(vars.border_width, vars.border_height)
      .toBuffer(meta.format, (err, newBuffer) => resolve(newBuffer));
  });
}

module.exports = {
  settings: function(width, height) {
    return borderFigures(width, height);
  },

  bordering: function(buffer, info) {
    // if info: {width, height, format } is known, skip the getInfo promise
    return (info ? Promise.resolve(info) : getInfo(buffer))
           .then(info => resizeBuffer(buffer, info));
  },

  fitScreen: function(buffer) {
    return new Promise((resolve) => {
      gm(buffer)
        .resizeExact(WIDTH, HEIGHT)
        .toBuffer('png', (err, newBuffer) => resolve(newBuffer));
    });
  }
};


{% endhighlight %}

# How to pack the whole code package

`rm -rf node_modules`

`npm install`

The ffprobe-statics includes the binary files for most Common OS, e.g. Windows, linux, MacOS, x64/x32, so the packed zip file is too large, as the aws lambda uses the linux(x64)

the command to pack:
{% highlight shell %}
zip $1 index.js tools.js -r node_modules/ -x node_modules/ffprobe-static/bin/darwin/\* -x node_modules/ffprobe-static/bin/win32/\* -x node_modules/ffprobe-static/bin/linux/ia32/\* >/dev/null
{% endhighlight %}

the command to put the zip to s3
{% highlight shell %}
s3cmd put deploy-1.0.0.zip s3://bucketname/lambda/deploy-1.0.0.zip
{% endhighlight %}

set the s3 object link to be the functional code link.

[gm-github]:https://github.com/aheckmann/gm
[ffprobe-github]:https://github.com/ListenerApproved/node-ffprobe
[ffprobe-binary]:https://github.com/joshwnj/ffprobe-static
