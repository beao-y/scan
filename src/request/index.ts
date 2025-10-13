import Request from './request'

export const request = new Request({
  baseURL: import.meta.env.VITE_BASEURL,
  timeout: 10000,
})
