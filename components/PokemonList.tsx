import { useQuery } from "urql";
import {
  PokemonsDocument,
  PokemonsResponse,
  PokemonsVariables,
} from "../graphql/pokemon-documents";
import PokemonListItem from "./PokemonListItem";
import styles from "../styles/PokemonList.module.css";

export default function PokemonList() {
  const [result] = useQuery<PokemonsResponse, PokemonsVariables>({
    query: PokemonsDocument,
    variables: {
      pokemonsFirst: 151,
    },
  });
  const { fetching, data, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={styles.pokemonListItemContainer}>
      {data?.pokemons.map((pokemon) => (
        <PokemonListItem key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
}
