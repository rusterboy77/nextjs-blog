import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import "../styles/globals.css";

// Configuramos hacia dónde tiene que apuntar el cliente
const client = new ApolloClient({
  link: new HttpLink({
    uri: "/api/graphql", // La ruta de tu servidor local
  }),
  cache: new InMemoryCache(),
});

export default function App({ Component, pageProps }) {
  return (
    // Envolvemos la app para que todas las páginas tengan superpoderes GraphQL
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
