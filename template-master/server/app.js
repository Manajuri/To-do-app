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
  const email = req.body.username;
  let db;
  if(db = new sqlite3.Database('data.db')){
    console.log("baglandi")
  }
  db.get("SELECT * FROM users WHERE (username = ? OR email = ?)  AND password = ?", [
      username, email, password
  ], (err, row) => {
      if (!row) { 
        console.log("Yanlis");
          return res.json({
              "success": false,
          });
          
      }

      //row.password = null;
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
  const email = req.body.email;
  //const token = makeToken(45);

  if(db = new sqlite3.Database('data.db')){
    console.log("baglandi");
  }
  
  db.all("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", [
      username, password,email
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


app.get('/todos/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  let db;
  console.log("gel");
  if(db = new sqlite3.Database('data.db')){
    console.log("Baglanti basarili");
  }
  
  db.all("SELECT * FROM todos WHERE deleted_at IS NULL AND user_id = ?", [
      user_id
  ], (err, rows) => {
      if (err) {
          return console.log(err.message);
          res.json({
              "success": false,
          });
      }

      console.log("rows", rows);

      res.json({
          "success": true,
          "todos": rows
      });
  });
  db.close();
}); //Usera ait todoları çekiyor.

app.post('/todos', (req, res) => {
  const user_id = req.body.user_id;
  const text = req.body.text;

  let db = new sqlite3.Database('data.db');
  db.run("INSERT INTO todos (user_id, text, is_completed, created_at, deleted_at) VALUES (?, ?, ?, ?, ?)", [
      user_id, text, 0, null, null
  ], (err) => {
      if (err) {
          return console.log(err.message);
          res.json({
              "success": false,
          });
      }

      res.json({
          "success": true,
      });
  });
  db.close();
})

app.post('/todos/:todo_id', (req, res) => {
  const is_completed = req.body.is_completed;

  const todo_id = req.params.todo_id;

  let db = new sqlite3.Database('data.db');
  db.run("UPDATE todos SET is_completed = ? WHERE id = ?", [
      is_completed, todo_id
  ], (err) => {
      if (err) {
          return console.log(err.message);
          res.json({
              "success": false,
          });
      }

      res.json({
          "success": true,
      });
  });
  db.close();
})

app.post('/todos/:todo_id/delete', (req, res) => {
  const todo_id = req.params.todo_id;
  const currentTime = new Date();

  let db = new sqlite3.Database('data.db');
  db.run("UPDATE todos SET deleted_at = ? WHERE id = ?", [
      currentTime.getTime(), todo_id
  ], (err) => {
      if (err) {
          
          res.json({
              "success": false,
          });
      }

      res.json({
          "success": true,
      });
  });
  db.close();
})

app.get('/todos/:user_id/deleted', (req, res) => {
    const user_id = req.params.user_id;

    if(db = new sqlite3.Database('data.db')){
        console.log("Baglanti basariliiiiii");
      }
    db.all("SELECT * FROM todos WHERE deleted_at IS NOT NULL AND user_id = ?", [
        user_id
    ], (err, rows) => {
        if (err) {
            return console.log(err.message);
            res.json({
                "success": false,
            });
        }

        console.log("rows", rows);

        res.json({
            "success": true,
            "todos": rows
        });
    });
    db.close();
});//silinen todoları getiriyor.


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})