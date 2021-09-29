require("dotenv").config();

const db = require("./dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export default async function login(req, res) {
    if (req.method === "POST") {
        const { name, password } = req.body;

        db.query("SELECT * FROM users", (err, result) => {
            if (err) {
                console.log(err);
            }
            const userFound = result.find(user => user.name === name);
            if (userFound) {
                if (bcrypt.compare(password, userFound.password)) {
                    const accessToken = jwt.sign(
                        {
                            id: userFound.id,
                            name: userFound.name,
                            email: userFound.email,
                            // password: userFound.password,
                        },
                        process.env.ACCESS_TOKEN
                    );

                    res.status(200).json({ message: "Login successful", accessToken });
                } else {
                    res.status(401).json({ message: "Invalid password" });
                }
            } else {
                res.status(401).json({ message: "Invalid email" });
            }
        });
    }
}
