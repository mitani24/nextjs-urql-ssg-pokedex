import Image from "next/image";
import Link from "next/link";
import { PokemonSimple } from "../graphql/pokemon-documents";
import styles from "../styles/PokemonListItem.module.css";

type Props = {
  pokemon: PokemonSimple;
};

export default function PokemonListItem({ pokemon }: Props) {
  return (
    <Link href={`/${pokemon.id}`}>
      <a>
        <div className={styles.pokemonListItem}>
          <Image
            src={pokemon.image}
            width={80}
            height={80}
            objectFit="contain"
            loading="lazy"
            alt={pokemon.name}
          />
          <p className={styles.pokemonTitle}>
            {pokemon.number} - {pokemon.name}
          </p>
        </div>
      </a>
    </Link>
  );
}
