import axios from 'axios'

const protocol = 'http'
const host = 'localhost'
const port = '3000'

const getPromise = (url, data, method) => axios({
  method: method || 'get',
  url,
  [method === 'post' ? 'data' : 'params']: {
    ...data,
    token: sessionStorage.getItem('studioToken')
  }
})

const api = {
  login: {
    post: data => getPromise(`${protocol}://${host}:${port}/auth`, data, 'post')
  },
  questions: {
    get: () => getPromise('./baza_pytan.json'),
    getByAuthor: () => getPromise('./baza_pytan_kasia.json'), // mock
    getByPage: data => getPromise(`${protocol}://${host}:${port}/baza_pytan`, data), // mock
    post: data => getPromise('./test.json', data, 'post')
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
