import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

/*
ApolloProvider - is a special type of React component that we'll use to provide data to all of the other components.
ApolloClient - is a constructor function that will help initialize the connection to the GraphQL API server.
InMemoryCache - enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently.
createHttpLink - allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests.
*/

import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';


// establish the connection to the back-end server's /graphql endpoint.
const httpLink = createHttpLink({
  //uri: "http://localhost:3001/graphql"
  uri: "/graphql"
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/thought" element={<SingleThought />} />
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
