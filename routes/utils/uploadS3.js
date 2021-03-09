const AWS = require('aws-sdk');
const config = require('config');

// Tutorial about progress bar https://github.com/aws/aws-sdk-js/issues/785

module.exports = function (file, path) {
  const S3_BUCKET = 'kart-iw';
  const AWS_ACCESS_KEY_ID = config.get('AWSaccessKeyId');
  const AWS_SECRET_ACCESS_KEY = config.get('AWSsecretAccessKey');

  AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  });

  const s3 = new AWS.S3();

  var params = {
    Bucket: S3_BUCKET,
    Key: path,
    Body: file.buffer,
  };

  // var uploadBar = form.find('.upload-bar');
  // var uploadBarMeter = uploadBar.find('div');
  // uploadBar.removeClass('hidden');

  s3.upload(params, function (err, data) {
    // console.log(err, data);
    if (err) {
      console.log('Error occured, please try again later');
      return false;
    }
  });
  // .on('httpUploadProgress', function (e) {
  //   loaded[this.body.name] = e.loaded;
  //   var loadedTotal = 0;
  //   for (var j in loaded) {
  //     loadedTotal += loaded[j];
  //   }
  //   var progress = Math.round((loadedTotal / sizeTotal) * 100);
  //   uploadBarMeter.css({ width: progress + '%' });
  //   if (loadedTotal === sizeTotal) {
  //     successCallback(form, { files: resp.files, form: form.serialize() });
  //   }
  // });
};
