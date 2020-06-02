const language = require('@google-cloud/language');

class google {
  constructor(){
    var projectId = "755323864460"
    var keyFilename = "./key/SentimentalAnalysysAssigment-671cc54a7813.json"
    this.client = new language.LanguageServiceClient({projectId, keyFilename});
  }
'C:\\Users\\john\\Desktop\\key\\SentimentalAnalysysAssigment-671cc54a7813.json'
  // async analyzeReview(text){
  //   const document = {
  //     content: text,
  //     type: 'PLAIN_TEXT',
  //   };
  //   const [result] = await this.client.analyzeSentiment({document: document});
  //   const sentiment = result.documentSentiment;
  //   return sentiment;
  //   //console.log(`Text: ${text}`);
  //   //console.log(sentiment.score);
  //   //console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
  // }

  analyzeReview(text){
    return new Promise((resolve) => {
      const document = {
        content: text,
        type: 'PLAIN_TEXT',
      };
      // const [result] = await
      this.client.analyzeSentiment({document: document})
      .then(([result]) => {
        const sentiment = result.documentSentiment;
        resolve(sentiment)
      })
      .catch((e) => {
        console.log(e)
        resolve(false)
      })
    })
  }

}



module.exports = new google()
