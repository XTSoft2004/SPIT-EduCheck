import axios from 'axios'

const api = axios.create({
  baseURL: 'http://chamcong.spit-husc.io.vn:5000/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export class PaginationFilter {
  pageNumber: number = 1
  pageSize: number = 10

  constructor(init?: Partial<PaginationFilter>) {
    Object.assign(this, init)
  }

  toURLSearchParams(): URLSearchParams {
    const params = new URLSearchParams()
    params.append('pageNumber', this.pageNumber.toString())
    params.append('pageSize', this.pageSize.toString())
    return params
  }
}

export interface Meta {
  totalRecords: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export default api
