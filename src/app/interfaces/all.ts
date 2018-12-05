import { Movie } from '../classes/movie';
import { Painting } from '../classes/painting';
import { Serie } from '../classes/serie';

export interface IDataBaseSerie {
  [key: number]: Serie;
}

export interface IDataBaseMovie {
  [key: number]: Movie;
}

export interface IDataBasePainting {
  [key: number]: Painting;
}

export type BelongsToCollection = {
  id: number,
  name: string,
  poster_path: string,
  backdrop_path: string,
} | null;

export interface ISeason {
  id: number;
  name: string;
  poster: string;
  releaseDate: string;
}

export interface IOrder {
  [key: string]: boolean;
  title: boolean;
  releaseDate: boolean;
  voteCount: boolean;
  voteAverage: boolean;
}
