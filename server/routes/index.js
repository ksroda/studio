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
router.post('/auth', function (req, res, next) {
  const { Login: login, Password: password } = req.body
  console.log(req.body)
  if (login === 'jan' && password === 'mak') {
    res.send(token)
  } else {
    res.send('')
  }
})

router.get('/baza_pytan', function (req, res, next) {
  console.log('jestem tu')
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

module.exports = router;
