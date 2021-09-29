const db = require("./dbConnect");
const bcrypt = require("bcrypt");

export default async function register(req, res) {
    if (req.method === "POST") {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = { name, email, password: hashedPassword };

        const sql = "INSERT INTO users SET ?";
        db.query(sql, user, (err, result) => {
            if (err) {
                res.status(500).json({
                    error: err.message,
                });
            } else {
                res.status(201).json({
                    message: "User created",
                });
            }
        });
    }
}
