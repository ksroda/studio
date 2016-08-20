import axios from 'axios'

const getPromise = config =>
  axios(config).catch(error => console.error(error))

const api = {
  questions: {
    get: () => getPromise({
      method: 'get',
      url: './baza_pytan.json'
    })
  },
  image: {
    post: data => getPromise({
      method: 'post',
      url: 'http://localhost:3000',
      data
    })
  }
}

export default api
