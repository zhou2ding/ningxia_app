import axios from 'axios'

const service = axios.create({
  baseURL: 'http://36.133.97.26:12345',
  timeout: 15000,
  withCredentials: true
})

export default service
