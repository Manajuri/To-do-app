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

/*app.get('/deneme', (req, res) => {
  res.send('Hello World!')
})*/
/*app.get("/todos",(req,res)=>{
  //grt todoos from db
  let todoos = [{text:"çalış",complete:false},{text:"yat",complete:true}]
  res.json(todoos)
})
*/
app.post('/account/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let db;
  if(db = new sqlite3.Database('data.db')){
    console.log("baglandi")
  }

  
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [
      username, password
  ], (err, row) => {
      if (!row) { 
        console.log("Yanlis");
          return res.json({
              "success": false,
          });
          
      }

      row.password = null;
      console.log("Dogru");
      return res.json({
          "success": true,
          "user": row,
          
      });
  });
 
  db.close();
});


app.post('/account/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  //const token = makeToken(45);

  if(db = new sqlite3.Database('data.db')){
    console.log("baglandi");
  }
  
  db.all("INSERT INTO users (username, password) VALUES (?, ?)", [
      username, password
  ], (err) => {
      if (err) {
          console.log(err);
          return res.json({
              "success": false,
          });
      }

      res.json({
          "success": true,
      });
  });
  db.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})