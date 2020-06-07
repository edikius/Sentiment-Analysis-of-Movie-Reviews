const imdb = require('./imdb-api')
const google = require('./google-api')

function socket(io) {
  io.sockets.on('connection', (socket) => {
    socket.on('analyzeMovie', (moviedata) => {
      imdb.getReviews(moviedata.id)
      .then(async (data) => {
        for (let item of data) {
          await google.analyzeReview(item.reviewText)
          .then((result) => {
              if (!result) return res.status(500);
              socket.emit("newReview", {imdb: item, google: result})
          })
        }
      })
    })
  })
}

module.exports = socket
