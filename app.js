const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')

// Express related variables
const app = express()
const port = process.env.PORT || 3000

// set `handlebars` as engine template
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// use static data
app.use(express.static('public'))
// use body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// mongoose related settings
mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', () => console.log('mongodb error!'))
db.once('open', () => console.log('mongodb connected!'))

/** =================================== routes =================================== */

/** index, homepage */
app.get('/', (req, res) => {
  Restaurant.find((err, restaurants) => {
    if (err) return console.log(err)
    return res.render('index', { restaurants })
  })
})

app.get('restaurants', (req, res) => {
  res.redirect('/')
})

/** create a new restaurant */
app.get('/restaurants/create', (req, res) => {
  res.render('detailForm', { createNew: true })
})

app.post('/restaurants', (req, res) => {
  const restaurantModelInstance = new Restaurant(req.body)

  restaurantModelInstance.image = restaurantModelInstance.image || '/images/default.jpg'

  restaurantModelInstance.save(err => {
    if (err) return console.log(err)
    return res.redirect('/')
  })
})

/** edit a restaurant */
app.get('/restaurants/edit/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)
    return res.render('detailForm', { restaurant })
  })
})

app.post('/restaurants/edit/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)

    Object.assign(restaurant, req.body)

    restaurant.save(err => {
      if (err) return console.log(err)
      return res.redirect(`/restaurants/${req.params.id}`)
    })
  })
})

/** delete a restaurant */
app.post('/restaurants/delete/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)
    restaurant.remove(err => {
      if (err) return console.log(err)
      return res.redirect('/')
    })
  })
})

/** show a specific restaurant */
app.get(
  '/restaurants/:id',
  (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
      if (err) return console.log(err)
      return res.render('show', { restaurant })
    })
  }
)

/** search restaurants by entering keywords */
app.get(
  '/search',
  (req, res) => {
    const keyword = req.query.keyword

    Restaurant.find((err, restaurants) => {
      if (err) return console.log(err)

      restaurants = restaurants.filter(
        restaurant => restaurant.name
          .toLowerCase()
          .includes(keyword.toLowerCase())
      )

      res.render('index', { restaurants, keyword })
    })
  })

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
