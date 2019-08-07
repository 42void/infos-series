import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import SearchSerie from './components/SearchSerie';

// apollo client setup
const client = new ApolloClient({
    uri: '/graphql',  //uri for local tests http://localhost:4000/graphql
    onError: ({ networkError, graphQLErrors }) => {
        console.log(graphQLErrors)
        console.log(networkError)
    }
});

class App extends Component {
  render() {
    return (
        <ApolloProvider client={client}>
                <div id="main">
                    <h1>Infos Series</h1>
                    <SearchSerie/>
                </div>
        </ApolloProvider>
    );
  }
}

export default App;
