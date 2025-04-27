import axios from 'axios'

const service = axios.create({
  baseURL: 'http://127.0.0.1:12345',
  timeout: 300000,
  withCredentials: true
})

export default service
