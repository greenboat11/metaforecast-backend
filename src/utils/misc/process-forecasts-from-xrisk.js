/* Imports */
import fs from "fs"

/* Definitions */
let locationData = "../../data/"

/* Body */
let rawdata = fs.readFileSync("/home/nuno/Documents/core/software/fresh/js/metaforecasts/metaforecasts-mongo/src/input/xrisk-questions.json")
let data = JSON.parse(rawdata)

let results = []
for(let datum of data){
    let result = ({
    "title": datum["title"],
    "url": datum["url"],
    "platform": "X-risk estimates",
    "moreoriginsdata": {
      "author": datum.author,
    },
    "description": datum.description,
    "options": datum.options,
    "timestamp": datum.timestamps,
    "qualityindicators": {
      "stars": 2//datum["stars"]
    }
  })
  results.push(result)
}

let string = JSON.stringify(results,null,  2)
fs.writeFileSync("/home/nuno/Documents/core/software/fresh/js/metaforecasts/metaforecasts-mongo/src/input/xrisk-questions-new2.json", string)
