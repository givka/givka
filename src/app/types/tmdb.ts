export type SerieResult = {
  poster_path: string
  popularity: number
  id: number,
  backdrop_path: string
  vote_average: number
  overview: string
  first_air_date: string
  origin_country:string[]
  genre_ids:number[]
  original_language: string
  vote_count: number
  name: string
  original_name: string,
};

export type MovieResult = {
  poster_path:string
  adult: boolean
  overview: string
  release_date: string
  genre_ids:number[]
  id: number
  original_title: string
  original_language: string
  title: string
  backdrop_path: string
  popularity: number
  vote_count: number
  video: boolean
  vote_average: number,
};

export type Collection = {
  id: number,
  name: string,
  poster_path: string,
  backdrop_path: string,
  parts :  MovieResult[],
};

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
    cast: {
      cast_id: number
      character: string
      credit_id: string
      gender: number
      id: number
      name: string
      order: number
      profile_path: string,
    } [],
    crew:{
      credit_id: string
      department: string
      gender: number
      id: number
      job: string
      name: string
      profile_path: string,
    } [],
  }
};
