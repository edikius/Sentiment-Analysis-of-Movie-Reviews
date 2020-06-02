const imdb = require('./imdb-api')
const google = require('./google-api')

async function getscore(){
  imdb.getReviews("tt2141913", async (data)=>{
    for (var i = 0; i < data.length; i++) {
      var score = await google.analyzeReview(data[i].reviewText)
      data[i].score = score;
      console.log(data[i])
      return data;
    }
}

getscore()
