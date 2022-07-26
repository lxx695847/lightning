import axios from 'axios';
const CancelToken = axios.CancelToken
let source = CancelToken.source()
export const TIMEOUT = 5 * 10000
const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? process.env.VUE_APP_BASE_API : process.env.VUE_APP_BASE_URL,
  timeout: TIMEOUT
})
/* eslint-disable prefer-promise-reject-errors  */
instance.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    if (response.status === 200) {
      return Promise.resolve(response.data);
    }
    return Promise.reject({ error: response.statusText })
  },
  function (error) {
    return Promise.reject({ error })
  }
)

export default instance

