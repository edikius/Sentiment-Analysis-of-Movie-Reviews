var express = require('express');
var router = express.Router();
const imdb = require('../workplace/imdb-api')
const google = require('../workplace/google-api')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sentimental Analysys' });
});

router.get('/search', async function(req, res, next) {
  var movietitle = req.query.movie_title;
   imdb.findMovies(movietitle, (result)=>{
     var generate = {
       movie_title: movietitle,
       items: result
      }
     console.log(result);
     res.render('search', generate);
  })
});

router.get('/analyze/title/:id',  async (req, res, next) => {
  var id = req.params.id;

  imdb.getReviews(id)
  .then(async (data) => {
    //console.log(data)
      var object = []
      for (let item of data) {
        await google.analyzeReview(item.reviewText)
        .then((result) => {
          if (!result) return res.status(500);
          object.push({imdb: item, google: result})
          console.log('test')
        })
      }
      console.log('done')
        console.log(object.length)
        res.render('analyze', {items: object});
  })
});

module.exports = router;


//
//
// this.view.suggest = {}
//
// for (let videos of result.items) {
// 	videos.avatar = videos.avatar ? ('/img/avatar-small/' + videos.avatar) : '/assets/brand/avatar/smile.png'
// 	videos.quality = Quality_meter(videos.bucket)
// 	videos.duration =  Math.ceil(videos.duration / 60)
// }
//
// this.view.suggest = result.items
