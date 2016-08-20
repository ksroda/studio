import axios from 'axios'

const getPromise = (url, data, method) => axios({
  method: method || 'get',
  url,
  data
}).catch(error => console.error(error))

const api = {
  questions: {
    get: () => getPromise('./baza_pytan.json'),
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
