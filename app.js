const express = require('express');
const sqlite = require('sqlite3');

// initialize sqlite database

const db = new sqlite.Database('./sql.db', sqlite.OPEN_READWRITE, (error) => {
    if (error && error.code == "SQLITE_CANTOPEN") {
        createDatabase();
    } else if (error) {
        console.log('Error: ' + error);
        exit(1);
    }

    console.log('Database connected');
})

const createDatabase = () => {
    const newDb = new sqlite.Database('./sql.db', (error) => {
        if (error) {
            console.log('Error: ' + error);
            exit(1);
        }
        createTables(newDb);
    })
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

// initialize express app

const app = express();

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