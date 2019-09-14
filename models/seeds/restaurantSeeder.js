const mongoose = require('mongoose')
const Restaurant = require('../restaurant.js')
const restaurantsData = require('./restaurants.json')

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'mongoDB error'))
db.once('open', () => {
  console.log('mongoDB is connected.')
  const { results } = restaurantsData
  results.forEach(result => Restaurant.create(result))
  console.log('done')
})
