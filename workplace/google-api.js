const language = require('@google-cloud/language');

class google {
  constructor(){
    var projectId = "755323864460"
    var keyFilename = "./key/SentimentalAnalysysAssigment-671cc54a7813.json"
    this.client = new language.LanguageServiceClient({projectId, keyFilename});
  }
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
