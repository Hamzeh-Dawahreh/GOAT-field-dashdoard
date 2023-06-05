const express = require("express");
const app = express();
const cors = require("cors");
const pool = require('./db');
const port = 8181;

// Middleware
app.use(cors());
app.use(express.json());

// Get users data
app.get('/usersData', async (req, res) => {
    try {
        const allUsers = await pool.query("SELECT * FROM users");
        res.json(allUsers.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add user data
app.post('/addUser', async (req, res) => {
    try {
        const { user_name, user_email, user_password, role } = req.body;

        const addUser = await pool.query(
            "INSERT INTO users(user_name, user_email, user_password, role) VALUES ($1, $2, $3, $4) RETURNING *",
            [user_name, user_email, user_password, role]
        );

        res.json(addUser.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred while processing the request." });
    }
});

// Update user data
app.put("/updateUser/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { user_name, user_email, user_password, role } = req.body;

        const updateUser = await pool.query(
            "UPDATE users SET user_name = $1, user_email = $2, user_password = $3, role = $4 WHERE user_id = $5 RETURNING *",
            [user_name, user_email, user_password, role, id]
        );

        if (updateUser.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        res.json(updateUser.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred while updating the user." });
    }
});


// Update a Specific Record
app.put('/mais/:user_id', async function (req, res) {
    try {
        const { user_id } = req.params;
        let id0 = req.body.id;
        let role = req.body.role;
        console.log(id0)
        if (role == "serviceProvider") {
            role = "user"
        } else { role = "serviceProvider" }

        const record = await pool.query("UPDATE users SET role = $1 WHERE user_id = $2",
            [role, id0]);
        res.send("Updated Successfully");
    }
    catch (err) { console.log(err.message); }
});


// ! delete users
app.put('/deleteUser/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Instead of deleting the user, update the 'deleted' column to indicate it's soft deleted
        await pool.query("UPDATE users SET deleted = true WHERE user_id = $1", [id]);
        res.json('Your user has been soft deleted.');
    } catch (err) {
        console.error(err.message);
        res.status(500).json('An error occurred while soft deleting the user.');
    }
});


// get pitches
app.get("/getdatas", (req, res) => {
    const query = "SELECT * FROM pitch;";

    pool
        .query(query)
        .then((result) => {
            const pitches = result.rows.map((pitch) => {
                const base64ImageDatas = pitch.images.map((imageData) =>
                    Buffer.from(imageData).toString("base64")
                );
                return { ...pitch, images: base64ImageDatas };
            });
            res.json(pitches);
        })
        .catch((error) => {
            console.error("Error retrieving data:", error);
            const errorMessage = "Error retrieving data";
            res.status(500).json({ error: errorMessage });
        });
});
// get pitch with user
app.get("/getpitchwithuser", (req, res) => {
    const query =
        "SELECT p.id, p.name, p.price, p.size, p.details, p.description, p.location, p.deleted, u.user_name " +
        "FROM pitch p " +
        "JOIN users u ON p.provider_id = u.user_id";

    pool
        .query(query)
        .then((result) => {
            const data = result.rows;
            res.json(data);
        })
        .catch((error) => {
            console.error("Error retrieving data:", error);
            res.status(500).send("Error retrieving data");
        });
});

// APPROVE
app.put("/pitch/:id/:isDeleted", async (req, res) => {
    const { id, isDeleted } = req.params;

    try {
        const client = await pool.connect();
        await client.query("BEGIN");

        const updateQuery = "UPDATE pitch SET deleted = $1 WHERE id = $2";
        await client.query(updateQuery, [isDeleted, id]);

        await client.query("COMMIT");
        res.status(200).json({ message: "Update successful" });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error updating pitch:", error);
        res
            .status(500)
            .json({ error: "An error occurred while updating the pitch" });
    }
});




app.listen(port, () => {
    console.log('Server listening on port ' + port);
});
