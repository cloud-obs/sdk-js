const http = require('http');

const SDK_API_SERVER = process.env.SDK_API_SERVER?? 'http://sdk-api.cloud-obs.com';

function submit(batch, apiKey) {
  const postData = JSON.stringify({data: batch});

  const req = http.request(SDK_API_SERVER + '/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Api-Key': apiKey
    }
  });
  req.write(postData, 'utf8');
  req.end();
}

module.exports = {
  submit
};
