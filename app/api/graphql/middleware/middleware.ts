

import jwt from 'jsonwebtoken';

const authenticate = (handler:any) => async (ctx:any) => {
  try {
    console.log({ctx})
    // Extract the GraphQL operation from the context
    const { operationName } = ctx.req.body;

    
    // / Check for allowed operations without authentication (optional)
    const allowedOperationsWithoutAuth = ['login', 'signup']; // Adjust as needed

    // Skip authentication if allowed operation
    if (allowedOperationsWithoutAuth.includes(operationName)) {
      return handler(ctx);
    }


    // Get the token from the authorization header
    const token = ctx.req.headers.authorization;

    // If no token is provided, return an error
    if (!token) {
      return { statusCode: 401, body: { error: 'Unauthorized' } };
    }

    // Verify the token
    jwt.verify(token, `${process.env.JWT_SECRET}`, (err:any, decoded:any) => {
      if (err) {
        return { statusCode: 401, body: { error: 'Invalid token' } };
      }

      // Attach the decoded token to the context object
      ctx.user = decoded;
    });

    // Call the next handler
    return handler(ctx);
  } catch (error) {
    console.error('Authentication error:', error);
    return { statusCode: 500, body: { error: 'Internal server error' } };
  }
};

export default authenticate;
