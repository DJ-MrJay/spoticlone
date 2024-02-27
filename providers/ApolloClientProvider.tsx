import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";

const client = new ApolloClient({
  uri: "https://annaregina.stepzen.net/api/exciting-buffalo/__graphql",
  headers: {
    Authorization:
      "apikey annaregina::stepzen.net+1000::02f60e253cc079982893cabca53b64b9c8d9e0ea58bc8fb32cd9c1cec6dcfba7",
  },
  cache: new InMemoryCache(),
});

const ApolloClientProvider = ({ children }: PropsWithChildren) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloClientProvider;
