import serverless from 'serverless-http';
import app from '../../server/server.mjs';

export const handler = serverless(app);
