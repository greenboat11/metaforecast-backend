import { addToHistory } from "./addToHistory.js"
import { createHistoryForMonth } from "./createHistoryForMonth.js"

export async function updateHistory(){
    let currentDate = new Date()
    let dayOfMonth = currentDate.getDate()
    if(dayOfMonth == 1){
        console.log(`Creating history for the month ${currentDate.toISOString().slice(0,7)}`)
        await createHistoryForMonth()
    }else{
        console.log(`Updating history for ${currentDate.toISOString()}`)
        await addToHistory()
    }
}