const express = require('express')
const {cloudObs} = require('@cloud-obs/express');
const p = require('./package.json');

const app = express()
const port = 3030

app.use(cloudObs({
    apiKey:'246655b2-0a88-488d-80dd-ee479721c62f',
    version: p.version
}));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/100ms', (req, res) => {
    setTimeout(() => res.send('100ms'), 100);
});

app.get('/200ms', (req, res) => {
    setTimeout(() => res.send('200ms'), 200);
});

app.get('/500ms', (req, res) => {
    setTimeout(() => res.send('500ms'), 500);
});

app.listen(port, () => console.log(`Express NodeJS server listening on port ${port}...`));
