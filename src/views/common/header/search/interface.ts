export interface SearchStateOption {
  searchType: number
  searchValue: string
  isResultShow: boolean
  locationResultList: LocationResultListParam[]
  elementResultList: ElementResultListParam[]
}

export interface LocationParam {
  lng: number
  lat: number
}

export interface LocationResultListParam {
  id: string
  name: string
  address: string
  location: LocationParam
}

export interface ElementResultListParam {
  name: string
  id: string
  lng: number
  lat: number
}
