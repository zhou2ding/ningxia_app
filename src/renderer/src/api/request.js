import axios from 'axios'

const service = axios.create({
  baseURL: 'http://127.0.0.1:12345',
  timeout: 1800000,
  withCredentials: true
})

export default service
