const AWS = require('aws-sdk');
const config = require('config');

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

  s3.upload(params, function (err, data) {
    console.log(err, data);
  });
};
