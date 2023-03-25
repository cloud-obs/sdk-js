# Cloud-Obs SDK for ExpressJS

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/ddoronin/bytable/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/@cloud-obs/express.svg?style=flat-square)](https://www.npmjs.com/package/@cloud-obs/express)

## Getting Started

First, you need to visit [cloud-obs.com](http://app.cloud-obs.com), add your company to the system and create a new project where all dashboards and analytics will be displayed. After that you can create a new Access Token that will be used by the SDK to establish TCP connection with Cloud-Obs SDK API back-end.

Second, you need to install the SDK into your project. 

```bash
yarn add @cloud-obs/express

npm i --save @cloud-obs/express
```

Now, in your ExpressJS server file you just need to import the `cloudObs` middleware factory.

```typescript
const { cloudObs } = require('@cloud-obs/express');
```

This function will return an ExpressJS middlware. Please pass the Access Token as a parameter for this function. Here is an example:

```typescript
const app = express()
...
app.use(cloudObs('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'));
```

## Examples

Please feel free to navigate to the examples directory for [`express`](/packages/express).
