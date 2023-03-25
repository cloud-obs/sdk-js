# Cloud-Obs SDK for Yoga

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/ddoronin/bytable/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/@cloud-obs/yoga.svg?style=flat-square)](https://www.npmjs.com/package/@cloud-obs/yoga)

## Getting Started

First, you need to visit [cloud-obs.com](http://app.cloud-obs.com), add your company to the system and create a new project where all dashboards and analytics will be displayed. After that you can create a new Access Token that will be used by the SDK to establish TCP connection with Cloud-Obs SDK API back-end.

Second, you need to install the SDK into your project. 

```bash
yarn add @cloud-obs/yoga

npm i --save @cloud-obs/yoga
```

Now, in your yoga server file you just need to import the `useCloudObsEnvelop` function.

```typescript
import { useCloudObsEnvelop } from '@cloud-obs/yoga'
```

This function will return an Envelop plugin for the Yoga server. Please pass the Access Token as a parameter for this function. Here is an example:

```typescript
// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({ 
  schema, 
  plugins: [
    useCloudObsEnvelop('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
  ]
})
```

## Examples

Please feel free to navigate to the examples directory for [`yoga`](/packages/yoga).
