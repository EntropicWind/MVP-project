import express from "express";
import pg from "pg";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

// const pool = new pg.Pool({
//     database: "goal_tracker"
// });

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ...(process.env.NODE_ENV === "production" 
    ? {
        ssl: {
            rejectUnauthorized: false
        }
    }
    : {}),
});

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static('static'));
app.use(cors());

// const unknownHTTP = ((req, res, next) => {
//     res.sendStatus(404)
//     next()
// });

    // handle requests with routes
// when a user vists the server and make a GET Request and URL path 
// then respond with  "pet info"
// GET //
    //Client//
app.get('/api/client', (req, res) => {
    pool.query("SELECT * FROM client").then((data) => {
        res.send(data.rows);
        console.log(data.rows);
    })
    console.log(req.body);
});
     //Goals//
app.get('/api/goals', (req, res) => {
    pool.query("SELECT * FROM goals").then((data) => {
        res.send(data.rows);
        console.log(data.rows);
    })
    console.log(req.body);
});
//      //Goals Compeleted//
// app.get('/api/goals/:id/complete', (req, res) => {
//     const { id } = req.params;
//     pool.query("SELECT * FROM goals WHERE complete = 'yes' AND client_id = ($1)", [id]).then((data) => {
//         res.send(data.rows);
//         console.log(data.rows);
//     })
//     console.log(req.body);
// })

     //Client by ID//
app.get('/api/client/:client_name', (req, res) => {
    const { client_name } = req.params;
    pool.query(`SELECT * FROM client WHERE first_name IN ($1);`, [client_name]).then((data) => {
        const client = data.rows[0];
        if(client) {
            res.send(client); 
            console.log(client);
        } else {
            res.sendStatus(404);
        }
    })
});
     //Goals by Client name//
app.get('/api/goals/:client_goals', (req, res) => {
    const { client_goals } = req.params;
    console.log(client_goals);
    pool.query(`SELECT goals.client_id, client.first_name, goals.goals_id, goals.goal_name, 
    goals.complete_by, goals.priority, goals.complete FROM client RIGHT JOIN goals 
    ON goals.client_id=client.id WHERE first_name IN ($1)`, [client_goals]).then((data) => {
        const goals = data.rows;
        if(goals) {
            res.send(goals); 
            console.log(goals);
        } else {
            res.sendStatus(404);
        }
    })
});
//POST//
    //Post new Client//
app.post('/api/client', (req,res) => {
    const { first_name, last_name, age, phone_number, email } = req.body;
    if(!first_name || !last_name || !age || !phone_number || !email) {
        res.sendStatus(400)
    }else{
        pool.query(`INSERT INTO client (first_name, last_name, age, phone_number, email) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *;`, 
        [first_name, last_name, age, phone_number, email])
        .then((data) => {
            res.status(201).send(data.rows[0]);
            console.log('input successful')
        })
    }
});
      //Post new Goal//
// app.post('/api/goals', (req,res) => {
//     const { client_id, goal_name, complete_by, priority, complete } = req.body;
//     if(!client_id || !goal_name || !complete_by || !priority || !complete) {
//         res.sendStatus(400)
//     }else{
//         pool.query(`INSERT INTO goals (client_id, goal_name, complete_by, priority, complete) 
//         VALUES ($1, $2, $3, $4, $5) RETURNING *;`, 
//         [client_id, goal_name, complete_by, priority, complete])
//         .then((data) => {
//             res.status(201).send(data.rows[0]);
//             console.log('Goals successfully logged')
//         })
//     }
// });

    //Client specific//
    app.post('/api/goals/:client_goals', async (req, res) => {
        const { goal_name, complete_by, priority, complete} = req.body;
        console.log(req.body, req.path)
        const { client_goals } = req.params;
        console.log(client_goals);
        // const { goal_name, complete_by, priority, complete } = req.body;
        if(!client_goals || !goal_name || !complete_by || !priority || !complete) {
            res.sendStatus(400)
        }else{
            const client_id = await pool.query('SELECT id FROM client where first_name = ($1);', [client_goals]);
            console.log(client_id.rows[0].id, "logging out client id")
        pool.query(`INSERT INTO goals (client_id, goal_name, complete_by, priority, complete)
       VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [client_id.rows[0].id, goal_name, complete_by, priority, complete]).then((data) => {
            const goals = data.rows[0];
            console.log(goals);
            if(goals) {
                res.send(goals); 
                console.log(goals);
            } else {
                res.sendStatus(404);
            }
        })
    }
});
      //Post to completed goals//
// app.post('/api/goals_completed', (req,res) => {
//     const { client_id, goals_id, goal, complete } = req.body;
//     if(!client_id || !goals_id || !goal || !complete) {
//         res.sendStatus(400)
//     }else{
//         pool.query(`INSERT INTO goals_completed (client_id, goals_id, goal, complete) 
//         VALUES ($1, $2, $3, $4) RETURNING *;`, 
//         [client_id, goals_id, goal, complete])
//         .then((data) => {
//             res.status(201).send(data.rows[0]);
//             console.log('Goals successfully Completed')
//         })
//     }
// });
// PATCH //
    //PATCH specific Client //
app.patch("/api/client/:id", (req,res) => {
    const { id } = req.params;
    const { first_name, last_name, age, phone_number, email } = req.body;
    if(first_name || last_name || age || phone_number || email) {
        pool.query(`
        UPDATE client
        SET first_name = COALESCE($1, first_name),
            last_name = COALESCE($2, last_name),
            age = COALESCE($3, age),
            phone_number = COALESCE($4, phone_number),
            email = COALESCE($5, email)
        WHERE id = $6
        RETURNING *;
        `, [first_name, last_name, age, phone_number, email, id])
        .then((data) => {
            res.status(200).send(data.rows[0]);
            console.log("UPDATE Client Complete")
        })
    }else{
        res.sendStatus(400);
    }
});
    //PATCH specific goal//
app.patch("/api/goals/:id", (req,res) => {
    const { id } = req.params;
    const { client_id, goal_name, complete_by, priority, complete } = req.body;
    console.log(complete)
    if(client_id || goal_name || complete_by || priority || complete === "yes" || complete === "no") {
        pool.query(`
        UPDATE goals
        SET client_id = COALESCE($1, client_id),
            goal_name = COALESCE($2, goal_name),
            complete_by = COALESCE($3, complete_by),
            priority = COALESCE($4, priority),
            complete = COALESCE($5, complete)
        WHERE goals_id = $6
        RETURNING *;
        `, [client_id, goal_name, complete_by, priority, complete, id])
        .then((data) => {
            res.status(200).send(data.rows[0]);
            console.log("UPDATE Goals Complete")
        })
    }else{
        res.sendStatus(400);
    }
});
// DELETE //
    //Client ID//
app.delete('/api/client/:id', (req,res) => {
    const { id } = req.params;
    console.log(req.params)
    pool.query(`DELETE FROM client WHERE client_id = $1 RETURNING *;`,[id]).then((data) => {
        if(data.rows.length === 0) {
            res.sendStatus(404) 
        }else{
            res.sendStatus(204)
            console.log('Delete Successful')
        }
    })
});
    //Goals ID//
app.delete('/api/goals/:id', (req,res) => {
    const { id } = req.params;
    console.log(req.params)
    pool.query(`DELETE FROM goals WHERE complete = "yes" RETURNING *;`,[id]).then((data) => {
        if(data.rows.length === 0) {
            res.sendStatus(404) 
        }else{
            res.sendStatus(204)
            console.log('Delete Successful')
        }
    })
});
    //Goals Complete//
    app.delete('/api/goals_completed', (req,res) => {
        const { id } = req.params;
        console.log(req.params)
        pool.query(`DELETE FROM goals_complete WHERE complete = "yes" RETURNING *;`,[id]).then((data) => {
            if(data.rows.length === 0) {
                res.sendStatus(404) 
            }else{
                res.sendStatus(204)
                console.log('Delete Successful')
            }
        })
    });
    app.delete('/api/goals_completed/:1', (req,res) => {
        const { id } = req.params;
        console.log(req.params)
        pool.query(`DELETE FROM goals_complete WHERE client_id = $1 RETURNING *;`,[id]).then((data) => {
            if(data.rows.length === 0) {
                res.sendStatus(404) 
            }else{
                res.sendStatus(204)
                console.log('Delete Successful')
            }
        })
    });

//SERVER Listening//
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
});











// app.get('/api/goals/:client_goals', (req, res) => {
//     const { client_goals } = req.params;
//     console.log(client_goals);
//     pool.query(`SELECT goals.client_id, client.first_name, goals.goals_id, goals.goal_name, 
//     goals.complete_by, goals.priority FROM client RIGHT JOIN goals 
//     ON goals.client_id=client.id WHERE client_id IN ($1)`, [client_goals]).then((data) => {
//         const goals = data.rows;
//         console.log(id);
//         if(goals) {
//             res.send(goals); 
//             console.log(goals);
//         } else {
//             res.sendStatus(404);
//         }
//     })
// });