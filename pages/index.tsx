import { GetServerSideProps } from "next";
import { initUrqlClient, withUrqlClient, WithUrqlState } from "next-urql";
import { cacheExchange, dedupExchange, fetchExchange, ssrExchange } from "urql";
import PokemonList from "../components/PokemonList";
import {
  PokemonsDocument,
  PokemonsResponse,
  PokemonsVariables,
} from "../graphql/pokemon-documents";

function Home() {
  return (
    <div>
      <h1>Pokedex</h1>
      <PokemonList />
    </div>
  );
}

export default withUrqlClient(() => ({
  url: "https://graphql-pokemon2.vercel.app/",
}))(Home);

export const getServerSideProps: GetServerSideProps<WithUrqlState> =
  async () => {
    const ssrCache = ssrExchange({ isClient: process.browser });
    const client = initUrqlClient(
      {
        url: "https://graphql-pokemon2.vercel.app/",
        exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
      },
      false
    );

    await client
      ?.query<PokemonsResponse, PokemonsVariables>(PokemonsDocument, {
        pokemonsFirst: 151,
      })
      .toPromise();

    return {
      props: {
        urqlState: ssrCache.extractData(),
      },
    };
  };
