const db = require("./dbConnect");

export default function allusers(req, res) {
    if (req.method === "GET") {
        db.query("SELECT * FROM users", (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    }
}
