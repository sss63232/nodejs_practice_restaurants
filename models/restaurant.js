const mongoose = require('mongoose')

// 製作 mongoose model
const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  name_en: {
    type: String
  },
  category: {
    type: String
  },
  image: {
    type: String
  },
  location: {
    type: String
  },
  phone: {
    type: String
  },
  google_map: {
    type: String
  },
  rating: {
    type: Number
  },
  description: {
    type: String
  }
})

const Restaurant = mongoose.model('restaurant', restaurantSchema)

module.exports = Restaurant