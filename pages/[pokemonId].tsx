import Link from "next/link";
import { useRouter } from "next/router";
import PokemonDetail from "../components/PokemonDetail";
import { GetStaticPaths, GetStaticProps } from "next";
import { initUrqlClient, withUrqlClient, WithUrqlState } from "next-urql";
import { cacheExchange, dedupExchange, fetchExchange, ssrExchange } from "urql";
import {
  PokemonDetailDocument,
  PokemonDetailResponse,
  PokemonDetailVariables,
  PokemonsDocument,
  PokemonsResponse,
  PokemonsVariables,
} from "../graphql/pokemon-documents";
import client from "../lib/urql-client";

type PageParams = {
  pokemonId: string;
};

function PokemonView() {
  const router = useRouter();
  const { pokemonId } = router.query as { pokemonId: string };

  return (
    <div>
      <Link href="/">
        <a>← Back to Home</a>
      </Link>
      <PokemonDetail pokemonId={pokemonId} />
    </div>
  );
}

export default withUrqlClient(() => ({
  url: "https://graphql-pokemon2.vercel.app/",
}))(PokemonView);

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  const result = await client
    .query<PokemonsResponse, PokemonsVariables>(PokemonsDocument, {
      pokemonsFirst: 151,
    })
    .toPromise();

  if (!result?.data) return { paths: [], fallback: false };

  const { data } = result;

  return {
    paths: data.pokemons.map((pokemon) => ({
      params: {
        pokemonId: pokemon.id,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<WithUrqlState, PageParams> = async (
  ctx
) => {
  if (!ctx.params) return { notFound: true };
  const { pokemonId } = ctx.params;

  const ssrCache = ssrExchange({ isClient: process.browser });
  const client = initUrqlClient(
    {
      url: "https://graphql-pokemon2.vercel.app/",
      exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
    },
    false
  );

  await client
    ?.query<PokemonDetailResponse, PokemonDetailVariables>(
      PokemonDetailDocument,
      { pokemonId }
    )
    .toPromise();

  return {
    props: {
      urqlState: ssrCache.extractData(),
    },
  };
};
