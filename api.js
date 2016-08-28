import axios from 'axios'

const protocol = 'http'
const host = 'localhost'
const port = '3000'

const baseURL = `${protocol}://${host}:${port}`

const getPromise = (url, data, method) => axios({
  method: method || 'get',
  url,
  [method === 'post' ? 'data' : 'params']: {
    ...data,
    token: sessionStorage.getItem('studioToken') || localStorage.getItem('studioToken')
  }
})

const api = {
  auth: {
    post: data => getPromise(`${baseURL}/auth`, data, 'post')
  },
  login: {
    post: data => getPromise(`${baseURL}/login`, data, 'post')
  },
  questions: {
    get: data => getPromise(`${baseURL}/question/${data.id}`),
    getByAuthor: () => getPromise('./baza_pytan_kasia.json'), // mock
    getByPage: data => getPromise(`${baseURL}/baza_pytan`, data), // mock
    post: data => getPromise('./test.json', data, 'post'),
    put: data => getPromise(`${baseURL}/questions`, data, 'put')
  },
  profile: {
    get: () => getPromise('./profile.json'),
    post: data => getPromise('./test.json', data, 'post')
  },
  image: {
    post: data => getPromise('http://localhost:3000', data, 'post')
  }
}

export default api
