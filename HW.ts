interface Film {
  name: string
  year: number
  rate: number
  awards: string[]
}

interface Filter {
  filter: string
}

interface RangeFilter extends Filter {
  filterTo: string
}

interface ValueFilter {
  values: string[]
}

type FilterType = Filter | RangeFilter | ValueFilter

interface Category {
  name: string
  films: Film[]
}

interface FilmList {
  films: Film[]
  filters: FilterType[]
  applySearchValue(value: string): void
  applyFiltersValue(filters: FilterType[]): void
}

class Movie implements Film {
  constructor(
    public name: string,
    public year: number,
    public rate: number,
    public awards: string[]
  ) {}
}

class MovieCategory implements Category {
  constructor(public name: string, public films: Film[]) {}
}

class MovieList implements FilmList {
  public filters: FilterType[] = []

  constructor(public films: Film[]) {}

  applySearchValue(value: string): void {
    this.films = this.films.filter(film => film.name.includes(value))
  }

  applyFiltersValue(filters: FilterType[]): void {
    this.filters = filters
    for (const filter of filters) {
      if ("filter" in filter) {
        this.films = this.films.filter(film =>
          film.name.includes(filter.filter)
        )
      }
      if ("filterTo" in filter) {
        this.films = this.films.filter(
          film =>
            film.year >= parseInt(filter.filter) &&
            film.year <= parseInt(filter.filterTo)
        )
      }
      if ("values" in filter) {
        this.films = this.films.filter(film =>
          filter.values.some(value => film.awards.includes(value))
        )
      }
    }
  }
}
