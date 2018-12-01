type TmdbResult = {
  poster_path: string;
  popularity: number;
  id: number;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  origin_country:string[];
  genre_ids:number[];
  original_language: string;
  vote_count: number;
};

export type SerieResult = TmdbResult & {
  first_air_date: string;
  name: string;
};

export function isSerieResult(options: any): options is SerieResult {
  return options.name !== undefined;
}

export interface MovieResult  {
  release_date: string;
  title: string;
}

export type Collection = {
  id: number,
  name: string,
  poster_path: string,
  backdrop_path: string,
  parts :  MovieResult[],
};

export type BelongsToCollection = {
  id: number,
  name: string,
  poster_path: string,
  backdrop_path: string,
} | null;

export type MovieDetailsResult = MovieResult & {
  belongs_to_collection: {
    id: number,
    name: string,
    poster_path: string,
    backdrop_path: string,
  } | null
  budget: number,
  genres: {
    id: number,
    name: string,
  }[],
  homepage:  string
  imdb_id:  string
  production_companies: {
    id: number,
    logo_path: string
    name: string
    origin_country: string,
  }[],
  production_countries:  {
    iso_3166_1: string
    name: string,
  }[],
  revenue: number,
  runtime: number,
  spoken_languages: {
    iso_639_1: string
    name: string,
  } [],
  status: string
  tagline: string,
  videos : {
    id: number
    results: {
      id: string
      iso_639_1: string
      iso_3166_1: string
      key: string
      name: string
      site: string
      size: number
      type: string,
    } [],
  }
  images :{
    id: number,
    backdrops: {
      aspect_ratio: number,
      file_path: string,
      height: number,
      iso_639_1: string,
      vote_average: number,
      vote_count: number,
      width: number,
    } [],
    posters: {
      aspect_ratio: number
      file_path: string
      height: number
      iso_639_1: string
      vote_average: number
      vote_count: number,
      width: number,
    } [],
  };
  recommendations: {
    page: number
    results: MovieResult[],
    total_pages: number
    total_results: number,
  }
  credits:{
    id:number
    cast: CastResult [],
    crew: CrewResult [],
  }
};

export type CastResult = {
  character: string
  credit_id: string
  gender: number
  id: number
  name: string
  order: number
  profile_path: string,
};

export type CrewResult = {
  credit_id: string
  department: string;
  gender: number
  id: number
  job: string
  name: string
  profile_path: string,
};

type TmdbDetailsResult = TmdbResult & {

};

export type SerieDetailsResult = SerieResult & {
  budget: number,
  genres: {
    id: number,
    name: string,
  }[],
  homepage:  string
  imdb_id:  string
  production_companies: {
    id: number,
    logo_path: string
    name: string
    origin_country: string,
  }[],
  production_countries:  {
    iso_3166_1: string
    name: string,
  }[],
  revenue: number,
  runtime: number,
  spoken_languages: {
    iso_639_1: string
    name: string,
  } [],
  status: string
  tagline: string,
  videos : {
    id: number
    results: {
      id: string
      iso_639_1: string
      iso_3166_1: string
      key: string
      name: string
      site: string
      size: number
      type: string,
    } [],
  }
  images :{
    id: number,
    backdrops: {
      aspect_ratio: number,
      file_path: string,
      height: number,
      iso_639_1: string,
      vote_average: number,
      vote_count: number,
      width: number,
    } [],
    posters: {
      aspect_ratio: number
      file_path: string
      height: number
      iso_639_1: string
      vote_average: number
      vote_count: number,
      width: number,
    } [],
  };
  recommendations: {
    page: number
    results: MovieResult[],
    total_pages: number
    total_results: number,
  }
  credits:{
    id:number
    cast: CastResult [],
    crew: CrewResult [],
  }
};
