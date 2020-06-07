var unirest = require("unirest");

class imdb {
  constructor(){
    this.host = "imdb8.p.rapidapi.com"
    this.key = "df1bd4f8f6mshbc9ebd452d6db37p1addcejsn6041f85b47ba"
  }

  findMoviePlots(id, cb) {
    var req = unirest("GET", "https://imdb8.p.rapidapi.com/title/get-plots");

    req.query({
    	"tconst": id
    });
    req.headers({
      "x-rapidapi-host": this.host,
    	"x-rapidapi-key": this.key,
    	"useQueryString": true
    });
    req.end((res)=>{
      	if (res.error) throw new Error(res.error);
        console.log(res.body);
        try{
          var data = {
            title: res.body.base.title,
            image: res.body.base.image.url,
            titleType: res.body.base.titleType,
            year: res.body.base.year,
            plots: [res.body.plots[0]]
          }
          cb(data)
        } catch(e){
          cb(false)
        }
      });
  }

  async validateMovies(item){
    var data = new Array()
    for (var i = 0; i < item.length; i++) {
      if(typeof item[i].titleType == 'undefined') continue;
      if(item[i].titleType !== 'movie' && item[i].titleType !== 'tvSeries') continue;
      if(typeof item[i].image == 'undefined') continue; // item[i].image = {url: ""}
      data.push({
        id: item[i].id,
        image: item[i].image.url || "",
        titleType: item[i].titleType,
        title: item[i].title,
        year: item[i].year || 0
      })
    }
    return data;
  }

  async findMovies(query, cb) {
    var req = unirest("GET", "https://imdb8.p.rapidapi.com/title/find");
    req.query({
    	"q": query
    });
    req.headers({
    	"x-rapidapi-host": this.host,
    	"x-rapidapi-key": this.key,
    	"useQueryString": true
    });
    req.end(async (res) => {
    	if (res.error) throw new Error(res.error);
    //	console.log(this.validateMovies(res.body.results));
      var parsed = await this.validateMovies(res.body.results);
      cb(parsed)
    });
  }

  async validateReviews(reviews){
      var data = new Array()
      for (var i = 0; i < reviews.length; i++) {
        if(reviews[i].languageCode !== "eng") continue;
        if(typeof reviews[i].interestingVotes == 'undefined') reviews[i].interestingVotes = {down: 0, up: 0}
        data.push({
          id: reviews[i].id,
          interestingVotes:{
            down: reviews[i].interestingVotes.down || 0,
            up: reviews[i].interestingVotes.up || 0
          } ,
          spoiler: reviews[i].spoiler,
          reviewTitle: reviews[i].reviewTitle,
          reviewText: reviews[i].reviewText.split("\n").join("")
        })
      }
      return data;

  }

  getReviews(movie_id) {
    return new Promise(resolve => {
      var req = unirest("GET", "https://imdb8.p.rapidapi.com/title/get-user-reviews");
      req.query({
      	"currentCountry": "US",
      	"purchaseCountry": "US",
      	"tconst": movie_id
      });
      req.headers({
      	"x-rapidapi-host": this.host,
      	"x-rapidapi-key": this.key,
      	"useQueryString": true
      });
      req.end((res) => {
        console.log(res.body.reviews)
      	if (res.error) throw new Error(res.error);
        var validated = this.validateReviews(res.body.reviews)
        resolve(validated)
        // .then(data => {
        //   console.log(data)
        //   resolve(data)
        // })
      })
    })

  }
}

module.exports = new imdb()
