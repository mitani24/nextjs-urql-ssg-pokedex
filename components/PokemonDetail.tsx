import Image from "next/image";
import { useQuery } from "urql";
import {
  PokemonDetailDocument,
  PokemonDetailResponse,
  PokemonDetailVariables,
} from "../graphql/pokemon-documents";
import PokemonListItem from "../components/PokemonListItem";
import styles from "../styles/PokemonDetail.module.css";

type Props = {
  pokemonId: string;
};

export default function PokemonDetail({ pokemonId }: Props) {
  const [result] = useQuery<PokemonDetailResponse, PokemonDetailVariables>({
    query: PokemonDetailDocument,
    variables: { pokemonId },
  });
  const { fetching, data, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.pokemon) return <p>Pokemon not found</p>;

  const { pokemon } = data;

  return (
    <div>
      <h1>
        {pokemon.number} - {pokemon.name}
      </h1>
      <div className={styles.pokemonInfo}>
        <Image
          src={pokemon.image}
          width={300}
          height={300}
          objectFit="contain"
          loading="lazy"
          alt={pokemon.name}
        />
        <div>
          <p>Classification: {pokemon.classification}</p>
          <p>Types: {pokemon.types.join(", ")}</p>
          <p>Weaknesses: {pokemon.weaknesses.join(", ")}</p>
          <p>Max HP: {pokemon.maxHP}</p>
          <p>Max CP: {pokemon.maxCP}</p>
          {pokemon.evolutions && (
            <>
              <p>Evoluations:</p>
              <div className={styles.evoluationsContainer}>
                {pokemon.evolutions.map((evoluation) => (
                  <PokemonListItem key={evoluation.id} pokemon={evoluation} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
