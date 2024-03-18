import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';

import * as dotenv from "dotenv";

import connectDB from '../../db/model/db';
import typeDefs from './schema';
import resolvers from './resolvers';




dotenv.config();
connectDB();



const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error:any) => {
    const { message } = error;
    return { message };
  },

  
});


const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer, {
  context: async req => ({ req }),
});



export { handler as GET, handler as POST };

