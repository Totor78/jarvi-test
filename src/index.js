import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css'
import App from './App';
import dotenv from "dotenv";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

dotenv.config();

export const client = new ApolloClient({
  uri: process.env.REACT_APP_HASURA_URI,
  cache: new InMemoryCache(),
  headers: {
    "x-hasura-admin-secret": process.env.REACT_APP_HASURA_SECRET,
  },
});


ReactDOM.render(
  
    <Router>
      <ApolloProvider client={client}>
      <React.StrictMode>
        <Switch>
            <Route exact path="/" component={App} />
        </Switch>
        </React.StrictMode>,
      </ApolloProvider>
    </Router>,
  
  document.getElementById("root")
);


