const Score = require("../models/Score");
const asyncWrapper = require('../middleware/async')

const getTopScores = asyncWrapper( async (req, res, next) => {
    const scores = await Score.find({})
    // if (scores.length === 0) {
    //     return next(createCustomError("no scores found", 404))
    // }
    res.status(200).json(scores)
})

const createScore = asyncWrapper(async (req, res) => {
    const score = await Score.create(req.body)
    res.status(201).json(score)
  })

module.exports = {
    getTopScores,
    createScore
}