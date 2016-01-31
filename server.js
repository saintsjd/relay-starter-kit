import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {Schema} from './data/schema';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

var app = express();
app.use('/graphql', graphQLHTTP({
  schema: Schema,
}));

// Serve static resources
app.use('/', express.static('public'));
app.use('/js', express.static('dist/js'));
app.listen(process.env.PORT || APP_PORT, () => {
  console.log(`App is now running on http://localhost:${process.env.PORT || APP_PORT}`);
});
