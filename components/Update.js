import { useEffect, useState } from "react";

const Update = ({ user, setMessage, setIsTokenSaved, setIsUpdateForm }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        } else setIsUpdateForm(false);
    }, [user]);

    const updateHandler = async e => {
        e.preventDefault();

        if (!name || !email || !password) {
            return setMessage("Please fill in all fields");
        }

        try {
            const response = await fetch(`/api/updateuser/${user.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.status === 200) {
                localStorage.setItem("accessToken", "Bearer " + data.accessToken);

                // clear form
                setName("");
                setEmail("");
                setPassword("");

                setIsUpdateForm(false);
                setIsTokenSaved(prevstate => !prevstate);
            }

            setMessage(data.message);
        } catch (err) {
            setMessage("Update failed...");
        }
    };
    return (
        <div>
            <h1>Update Here</h1>
            <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    autoComplete="name"
                    onChange={e => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    autoComplete="email"
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    autoComplete="current-password"
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={updateHandler}>Update</button>
            </form>
        </div>
    );
};

export default Update;
