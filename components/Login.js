import { useState } from "react";

const Login = ({ setIsTokenSaved, setIsLoginForm, setMessage }) => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const loginHandler = async e => {
        e.preventDefault();

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, password }),
            });

            const data = await response.json();

            if (response.status === 200) {
                localStorage.setItem("accessToken", "Bearer " + data.accessToken);

                setName("");
                setPassword("");

                setIsLoginForm(false);
            }
            setIsTokenSaved(prevstate => !prevstate);
            setMessage(data.message);
        } catch (err) {
            setMessage("Login failed");
        }
    };

    return (
        <div>
            <h1>Login Here</h1>
            <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                    placeholder="Name"
                    type="text"
                    value={name}
                    autoComplete="name"
                    onChange={e => setName(e.target.value)}
                />
                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    autoComplete="current-password"
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={loginHandler}>Login</button>
            </form>
        </div>
    );
};

export default Login;
