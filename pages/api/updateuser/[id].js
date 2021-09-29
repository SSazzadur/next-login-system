import db from "../dbConnect";

require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { name, email, password } = req.body;
        const { id } = req.query;

        db.query("SELECT * FROM users", (err, result) => {
            if (err) {
                console.log(err);
            }
            const userFound = result.find(user => user.id.toString() === id);
            if (userFound) {
                if (bcrypt.compare(password, userFound.password)) {
                    const accessToken = jwt.sign(
                        {
                            id: userFound.id,
                            name: name,
                            email: email,
                        },
                        process.env.ACCESS_TOKEN
                    );

                    const sql = `UPDATE users SET name = '${name}', email = '${email}' WHERE id='${id}'`;
                    db.query(sql, (err, result) => {
                        if (err) console.log(err);

                        res.status(200).json({
                            message: "User updated successfully",
                            accessToken,
                        });
                    });
                } else {
                    res.status(401).json({ message: "Invalid password" });
                }
            } else {
                res.status(404).json({ message: "User not found" });
            }
        });
    }
}
