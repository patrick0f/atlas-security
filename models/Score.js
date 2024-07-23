const mongoose = require('mongoose')

const ScoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [20, 'name can not be more than 20 characters'],
  },
  userscore: {
    type: Number,
    default: 0,
  },
})

module.exports = mongoose.model('Score', ScoreSchema)
