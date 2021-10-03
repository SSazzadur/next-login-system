import { useState } from "react";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");

    const registerHandler = async e => {
        e.preventDefault();

        if (name === "" || email === "" || password === "")
            return setMessage("Please fill all fields");

        const user = { name, email, password };

        // api call
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            const data = await response.json();

            setMessage(data.message);

            // clear form
            setName("");
            setEmail("");
            setPassword("");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h1>Register Here</h1>
            <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={registerHandler}>Register</button>
            </form>

            <h1>{message}</h1>
        </div>
    );
};

export default Register;
