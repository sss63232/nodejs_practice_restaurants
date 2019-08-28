// app.js
// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantsList = require('./restaurant')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

app.get(
  `/`,
  (req, res) => {
    const restaurants = restaurantsList.results
    res.render('index', { restaurants })
  }
)

const RESTAURANTS_PATH = `/restaurants`
app.get(
  `${RESTAURANTS_PATH}/:restaurant_id`,
  (req, res) => {
    const reqRestaurantId = req.params.restaurant_id
    const restaurant = restaurantsList.results
      .find(restaurant => restaurant.id.toString() === reqRestaurantId)

    res.render('show', { restaurant })
  }
)

app.get(
  `/search`,
  (req, res) => {
    const keyword = req.query.keyword
    const restaurants = restaurantsList.results
      .filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase()))

    res.render('index', { restaurants, keyword })
  })

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
