import { Serie } from '../factories/serie';
import { Movie } from '../factories/movie';

export type DataBaseSerie = {
  [key: number] : Serie,
};

export type DataBaseMovie = {
  [key: number] : Movie,
};
