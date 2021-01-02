import { ApolloClient,createHttpLink , InMemoryCache } from "@apollo/client";
// createHttpLink instead HttpLink for login
import fetch from 'node-fetch'
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
   uri: 'https://ocalhost:4000/',
   fetch
});
const authLink = setContext((_,{ headers }) => {
   // Leer el storage almacenado
   const token = localStorage.getItem('token')
    return {
       headers: {
          ...headers,
          authorization: token ? `Bearer ${token}`: ''
       }
    }
})
const client = new ApolloClient({
   connectToDevTools: true,
   cache: new InMemoryCache(),
   link: authLink.concat(httpLink)
});

export default client