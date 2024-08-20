const fs = require("fs");
const express = require('express');
const sqlite = require('sqlite3');

// initialize sqlite database
const connectDatabase = () => {
    if (fs.existsSync('./sql.db')) {
        return new sqlite.Database('./sql.db', sqlite.OPEN_READWRITE, (error) => {
            if (error) {
                console.log('Error: ' + error);
                exit(1);
            }
        
            console.log('Database connected');
        })     
    } else {
        const newDb = new sqlite.Database('./sql.db', (error) => {
            if (error) {
                console.log('Error: ' + error);
                exit(1);
            }
            createTables(newDb);
        })

        return newDb
    }
    
}

const createTables = (database) => {
    database.exec(`
        create table posts (
            id int primary key not null,
            author string not null
        );
        
        insert into posts (id, author)
        values (1, 'Nils'),
               (2, 'Lukas'),
               (3, 'Emil');
    `);

    console.log('Tables created');
}

const db = connectDatabase();

// initialize express app

const app = express();
app.use(express.json());

app.listen(3030, () => {
    console.log('App started on port 3030');
})

app.get('/posts', (req,res) => {
    db.all(`select * from posts`,(error,rows)=>{
        if(error){
            console.log('Error: ' + error);
            exit(1);
        }
        res.json(rows);
    })
})

app.post('/posts', (req,res) => {
    const query = `INSERT INTO posts (id, author) VALUES (?, ?)`;
    const params = [req.body.id, req.body.author];

    db.run(query,params, (error) => {
        if(error){
            return res.status(500).send('Error saving post');
        }
        res.send('Post saved.');
    })
})