/* Imports */
import axios from "axios"
import fs from 'fs'

/* Definitions */
let jsonEndPoint = 'https://www.metaculus.com/api2/questions/?page='
let all_questions = [];
let now = new Date().toISOString()

/* Support functions */
async function fetchMetaculusQuestions(page=1){
  // Numbers about a given address: how many, how much, at what price, etc.
  let response  = await axios(({
    url: jsonEndPoint+page,
    method: 'GET',
    headers: ({ 'Content-Type': 'application/json' })
  }))
  .then(res => res.data)
  //console.log(response)
  return response
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/* Body */

export async function metaculus(){

  let metaculusQuestionsInit = await fetchMetaculusQuestions(1)
  let numQueries = Math.round(Number(metaculusQuestionsInit.count)/20)
  console.log(`Downloading... This might take a while. Total number of queries: ${numQueries}`)
  for(let i = 1; i <= numQueries; i++){ // change numQueries to 10 if one want to just test
    if (i%20 == 0){
      console.log("Sleeping for 5secs")
      await sleep(5000)
    }
    console.log(`Query #${i}`)
    let metaculusQuestions = await fetchMetaculusQuestions(i)
    let results = metaculusQuestions.results;
    for(let result of results){
      if(
        (result.publish_time < now) && 
        (now < result.close_time)
      ){
        let isbinary = result.possibilities.type == "binary"  
        let interestingInfo = ({
          "Title": result.title,
          "URL": "https://www.metaculus.com" + result.page_url,
          "Platform": "Metaculus",
          "Binary question?": isbinary,
          "Percentage": isbinary?(Number(result.community_prediction.full.q2)*100+"%"):"none",
          "# Forecasts": result.number_of_predictions

          //"status": result.status,
          //"publish_time": result.publish_time,
          //"close_time": result.close_time,
          //"type": result.possibilities.type, // We want binary ones here.
          //"last_activity_time": result.last_activity_time,
        })
        
        if(Number(result.number_of_predictions) >= 10){
          all_questions.push(interestingInfo)
        }
        
      }
    }
  }
  
  let string = JSON.stringify(all_questions,null,  2)
  fs.writeFileSync('./data/metaculus-questions.json', string);
  console.log("Done")
}
//metaculus()