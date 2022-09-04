import React from 'react'
import App from './App'
import ApolloClient from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {createHttpLink} from 'apollo-link-http'
import {ApolloProvider} from '@apollo/react-hooks'
import {setContext} from 'apollo-link-context'

let httpLink = createHttpLink({
    uri: 'https://pacific-journey-56712.herokuapp.com/',
})


let authLink = setContext(() => {
    let _token_ = localStorage.getItem('jwtToken')

    return {
        headers: {
            authorization: _token_ ? `Bearer ${_token_}` : ""
        }
    }
})


let client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})


export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)