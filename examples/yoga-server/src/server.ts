import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { schema } from './schema'
import { useCloudObs } from '@cloud-obs/yoga'
import p from '../package.json';
 
// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({ 
  schema, 
  plugins: [
    useCloudObs({
      apiKey: '53e90734-4712-4c62-8e98-b321fad0173d',
      version: p.version
    })
  ]
})
 
// Pass it into a server to hook into request handlers.
const server = createServer(yoga)
 
// Start the server and you're done!
server.listen(3031, () => {
  console.info('Server is running on http://localhost:3031/graphql')
});
