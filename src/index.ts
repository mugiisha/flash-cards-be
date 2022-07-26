import { ApolloServer } from "apollo-server";
import {schema} from './schema'
import 'dotenv/config'

export const server = new ApolloServer({
    schema,
})

const port = process.env.PORT || 2000

server.listen({port}).then(({url}) => {
    console.log(`🚀  Server ready at ${url}`)
})