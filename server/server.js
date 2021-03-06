const express = require('express');
const db = require('./config/connection');
const path = require("path");

//APOLLO & GraphQL
const { ApolloServer } = require("apollo-server-express");
//APOLLO & GraphQL
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");

const PORT = process.env.PORT || 3001;

//APOLLO & GraphQL
//create a new Apollo server and pass in our schema data
//provide the type definitions and resolvers so they know what our API looks like and how it resolves requests.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  //used for token
  context: authMiddleware
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//APOLLO & GraphQL
//Create a new instance of an Apollo server with the GraphQL schema
//connect our Apollo server to our Express.js server
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();

  //APOLLO & GraphQL
  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });

  // Serve up static assets
  //check to see if the Node environment is in production. 
  //If it is, we instruct the Express.js server to serve any files in the React application's build directory in the client folder.
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  //wildcard GET route for the server
  //f we make a GET request to any location on the server that doesn't have an explicit route defined, respond with the production-ready React front-end code.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      //APOLLO & GraphQL
      // log where we can go to test our GQL API
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

//APOLLO & GraphQL
startApolloServer(typeDefs, resolvers);