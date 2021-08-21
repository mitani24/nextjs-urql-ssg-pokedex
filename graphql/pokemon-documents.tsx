import { gql } from "urql";

export const PokemonsDocument = gql`
  query pokemons($pokemonsFirst: Int!) {
    pokemons(first: $pokemonsFirst) {
      id
      number
      name
      image
    }
  }
`;

export const PokemonDetailDocument = gql`
  query pokemon($pokemonId: String) {
    pokemon(id: $pokemonId) {
      id
      number
      name
      image
      classification
      types
      weaknesses
      maxHP
      maxCP
      evolutions {
        number
        name
        id
        image
      }
    }
  }
`;

export type PokemonSimple = {
  id: string;
  number: string;
  name: string;
  image: string;
};

export type PokemonDetail = {
  id: string;
  number: string;
  name: string;
  image: string;
  classification: string;
  types: string[];
  weaknesses: string[];
  maxHP: number;
  maxCP: number;
  evolutions?: PokemonSimple[];
};

export type PokemonsResponse = {
  pokemons: PokemonSimple[];
};

export type PokemonsVariables = {
  pokemonsFirst: number;
};

export type PokemonDetailResponse = {
  pokemon: PokemonDetail | null;
};

export type PokemonDetailVariables = {
  pokemonId: string;
};
