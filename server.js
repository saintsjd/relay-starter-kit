import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {Schema} from './data/schema';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

if (process.env.NODE_ENV === 'production') {
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
} else {
    // Expose a GraphQL endpoint
    var graphQLServer = express();
    graphQLServer.use('/', graphQLHTTP({
      graphiql: true,
      pretty: true,
      schema: Schema,
    }));
    graphQLServer.listen(GRAPHQL_PORT, () => console.log(
      `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
    ));

    // Serve the Relay app
    var config = require('./webpack.config');
    config.entry.app.unshift(`webpack-dev-server/client?http://localhost:${APP_PORT}`, "webpack/hot/dev-server");
    var compiler = webpack(config);
    var app = new WebpackDevServer(compiler, {
      noInfo: true,
      hot: true,
      historyApiFallback: true,
      contentBase: '/public/',
      proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
      publicPath: '/js/',
      stats: {colors: true}
    });
    // Serve static resources
    app.use('/', express.static(path.resolve(__dirname, 'public')));
    app.listen(APP_PORT, () => {
      console.log(`App is now running on http://localhost:${APP_PORT}`);
    });
}
