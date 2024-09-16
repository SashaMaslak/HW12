// type GridFilterValue<T> = {
//   type: GridFilterTypeEnum
//   filter: Extract<T, string | number>
//   filterTo?: Extract<T, string | number>
// }

// type GridFilterSetValues<T> = {
//   values: T[]
// }

// Опис фільму
interface Movie {
  title: string
  year: number
  rating: number
  awards: string[]
}

// Опис категорії
interface Category {
  name: string
  movies: Movie[]
}

enum GridFilterTypeEnum {
  Match = "match", // для фільтра відповідності
  Range = "range", // для фільтра діапазону
  ValueSet = "valueSet", // для пошуку за значеннями
}

// Фільтр відповідності
type GridFilterMatch<T> = {
  type: GridFilterTypeEnum.Match
  filter: Extract<T, string | number>
}

// Фільтр діапазону
type GridFilterRange<T> = {
  type: GridFilterTypeEnum.Range
  filter: Extract<T, number>
  filterTo: Extract<T, number>
}

// Фільтр пошуку за значеннями
type GridFilterSetValues<T> = {
  type: GridFilterTypeEnum.ValueSet
  values: T[]
}

// Тип для можливих фільтрів
type GridFilterValue<T> =
  | GridFilterMatch<T>
  | GridFilterRange<T>
  | GridFilterSetValues<T>

// Фільтри для фільмів
type MovieFilters = {
  title?: GridFilterValue<string>
  year?: GridFilterValue<number>
  rating?: GridFilterValue<number>
  awards?: GridFilterValue<string>
}

// Фільтри для категорій
type CategoryFilters = {
  name?: GridFilterValue<string>
}

class MovieList {
  private movies: Movie[]
  private filters: MovieFilters = {}

  constructor(movies: Movie[]) {
    this.movies = movies
  }

  // Застосування пошуку по назві фільму
  applySearchValue(value: string) {
    this.filters.title = { type: GridFilterTypeEnum.Match, filter: value }
  }

  // Застосування фільтрів (рік, рейтинг, нагороди)
  applyFiltersValue(filters: MovieFilters) {
    this.filters = { ...this.filters, ...filters }
  }

  // Метод для отримання відфільтрованих фільмів (не обов'язкова частина)
  getFilteredMovies(): Movie[] {
    return this.movies.filter(movie => {
      let matches = true

      if (this.filters.title) {
        matches =
          matches && movie.title.includes(this.filters.title.filter as string)
      }

      if (
        this.filters.year &&
        this.filters.year.type === GridFilterTypeEnum.Range
      ) {
        matches =
          matches &&
          movie.year >= (this.filters.year.filter as number) &&
          movie.year <= (this.filters.year.filterTo as number)
      }

      if (
        this.filters.rating &&
        this.filters.rating.type === GridFilterTypeEnum.Range
      ) {
        matches =
          matches &&
          movie.rating >= (this.filters.rating.filter as number) &&
          movie.rating <= (this.filters.rating.filterTo as number)
      }

      if (
        this.filters.awards &&
        this.filters.awards.type === GridFilterTypeEnum.ValueSet
      ) {
        matches =
          matches &&
          this.filters.awards.values.some(award => movie.awards.includes(award))
      }

      return matches
    })
  }
}

class CategoryList {
  private categories: Category[]
  private filters: CategoryFilters = {}

  constructor(categories: Category[]) {
    this.categories = categories
  }

  // Застосування пошуку по назві категорії
  applySearchValue(value: string) {
    this.filters.name = { type: GridFilterTypeEnum.Match, filter: value }
  }

  // Метод для отримання відфільтрованих категорій
  getFilteredCategories(): Category[] {
    return this.categories.filter(category => {
      if (this.filters.name) {
        return category.name.includes(this.filters.name.filter as string)
      }
      return true
    })
  }
}
