const sqlite3 = require('sqlite3').verbose()
const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000
import App from './App.svelte';


const app = new App({
	target: document.body,
	
});

var bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'))
app.post('/account/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let db = new sqlite3.Database('chinook.db');
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [
        username, password
    ], (err, row) => {
        if (!row) {   
            return res.json({
                "success": false,
            });
        }

        row.password = null;

        return res.json({
            "success": true,
            "user": row 
        });
    });
    db.close();
});


let db = new sqlite3.Database('./chinook.db',(err)=>{

    if(err){
        console.log(err.message)
    }

    console.log('connected to chinook db in sqlite')

    db.close((err)=>
    {
        if(err){
            console.log(err.message)
        }

    })

    console.log('chinook db connection closed')
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

export default app;