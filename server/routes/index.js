var express = require('express');
var router = express.Router();
var _ = require('lodash');

const baza_pytan_pattern = {
  subject: 'Systemy operacyjne',
  author: 'Kasia Nowak',
  date: '21-02-2015',
  question: 'To jest treść pytania',
  answers: {
    a: 'Odpowiedz A',
    b: 'Odpowiedz B',
    c: 'Odpowiedz C',
    d: 'Odpowiedz D'
  }
}

const baza_pytan_data = _.range(1, 401).reduce((acc, id) => [
  ...acc,
  Object.assign({}, baza_pytan_pattern, { id })
], [])

/* GET home page. */
router.post('/login', function (req, res, next) {
  const { Email: login, Password: password } = req.body
  console.log(req.body)
  if (login === 'jan' && password === 'mak') {
    res.send(token)
  } else {
    res.send('')
  }
})

const token = '8ob86V8686o86oBkuybuyiHIYILBO88O6V8b8yhkuybwewfsbxccxuyYVKUYVYBL8YB8HKUhb8y8KHJKU8I8IHHOih'
router.post('/auth', function (req, res, next) {
  const { login, token: tokenClient } = req.body
  if (token === tokenClient && login === 'jan') {
    res.send(tokenClient)
  } else {
    res.status(401).send('Unauthorized')
  }
})

router.get('/questions', function (req, res, next) {
  const { page, numberOfEntriesOnPage } = req.query
  if (!!page && !!numberOfEntriesOnPage) {
    res.json({
      totalNumberOfEntries: baza_pytan_data.length,
      data: baza_pytan_data.slice(
        (page - 1) * numberOfEntriesOnPage,
        page * numberOfEntriesOnPage
      )
    })
  } else {
    res.status(401).send('Unauthorized')
  }
})

router.get('/question/:id', function (req, res, next) {
  const id = parseInt(req.params.id)
  const question = _.find(baza_pytan_data, question => question.id === id)
  res.json(question)
})

router.put('/questions', function (req, res, next) {
  console.log(req.query)
  res.send('Okejka')
})

module.exports = router;
