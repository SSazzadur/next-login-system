require("dotenv").config();

const db = require("./dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export default function login(req, res) {
    if (req.method === "POST") {
        const { name, password } = req.body;

        db.query("SELECT * FROM users", (err, result) => {
            if (err) {
                res.status(500).json({
                    message: "Internal server error",
                    error: err,
                });
            }

            const userFound = result.find(user => user.name === name);

            if (userFound) {
                bcrypt
                    .compare(password, userFound.password)
                    .then(isMatch => {
                        if (isMatch) {
                            const accessToken = jwt.sign(
                                {
                                    id: userFound.id,
                                    name: userFound.name,
                                    email: userFound.email,
                                },
                                process.env.ACCESS_TOKEN
                            );

                            res.status(200).json({ message: "Login successful", accessToken });
                        } else {
                            res.status(401).json({ message: "Invalid password" });
                        }
                    })
                    .catch(err => {
                        res.status(500).json({ message: "Internal server error" });
                    });
            } else {
                res.status(401).json({ message: "User not found" });
            }
        });
    }
}
