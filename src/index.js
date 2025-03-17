import React from 'react';
import { StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import 'semantic-ui-css/semantic.min.css'
import App from './App';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: process.env.REACT_APP_HASURA_URI,
  cache: new InMemoryCache(),
  headers: {
    "x-hasura-admin-secret": process.env.REACT_APP_HASURA_SECRET,
  },
});

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
      <StrictMode>
        <ApolloProvider client={client}>
      <Router>
        <Routes>
            <Route path="/" element={<App />} />
        </Routes>
        </Router>
        </ApolloProvider>
        </StrictMode>,
      
    );
  


