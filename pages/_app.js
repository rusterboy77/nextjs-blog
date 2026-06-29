import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";
import "../styles/globals.css";

// 1. Configuramos dónde está el servidor
const httpLink = new HttpLink({
  uri: "/api/graphql",
});

// 2. Creamos el "Interceptor"
// Esto se ejecuta ANTES de cada petición al servidor
const authLink = setContext((_, { headers }) => {
  // Buscamos la pulsera VIP en el almacenamiento del navegador
  const token =
    typeof window !== "undefined" ? localStorage.getItem("neon_token") : null;

  // Devolvemos las cabeceras antiguas + el token (si existe)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// 3. Unimos el interceptor con la ruta del servidor
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
