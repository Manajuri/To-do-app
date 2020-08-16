const sqlite3 = require('sqlite3').verbose();
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get("/todos",(req,res)=>{
  //grt todoos from db
  let todoos = [{text:"çalış",complete:false},{text:"yat",complete:true}]
  res.json(todoos)
})
app.post("/account/login",(req,res)=>{
  console.log(req.body)
  res.json({user:"bahadır"})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})