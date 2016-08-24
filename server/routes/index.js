var express = require('express');
var router = express.Router();
var _ = require('lodash');

const token = '8ob86V8686o86oBkuybuyiHIYILBO88O6V8b8yhkuybiuykuyYVKUYVYBL8YB8HKUhb8y8KHJKU8I8IHHOih'
const baza_pytan_pattern = {
  subject: 'Systemy operacyjne',
  author: 'Kasia Nowak',
  date: '21-02-2015'
}

const baza_pytan_data = _.range(1, 401).reduce((acc, id) => [
  ...acc,
  Object.assign({}, baza_pytan_pattern, { id })
], [])

/* GET home page. */
router.post('/auth', function(req, res, next) {
  const { Login: login, Password: password } = req.body
  console.log(req.body)
  if (login === 'jan' && password === 'mak') {
    res.send(token)
  } else {
    res.send('')
  }
})

router.get('/baza_pytan', function(req, res, next) {
  const { page, numberOfEntriesOnPage, token: tokenClient } = req.query
  if (!!page && !!numberOfEntriesOnPage && token === tokenClient) {
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

module.exports = router;
