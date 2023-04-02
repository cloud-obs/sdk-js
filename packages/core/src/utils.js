const https = require('https');

function submit(url, batch, apiKey) {
  const postData = JSON.stringify({data: batch});

  const req = https.request(url, {
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
