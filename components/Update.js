import { useEffect, useState } from "react";

const Update = ({ user, setMessage, setIsTokenSaved, setIsUpdateForm }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        setName(user.name);
        setEmail(user.email);

        // setPassword(user.password);
    }, [user]);

    const updateHandler = async e => {
        e.preventDefault();

        if (!name || !email || !password) {
            return setMessage("Please fill in all fields");
        }

        const uUser = { name, email, password };

        const response = await fetch(`/api/updateuser/${user.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(uUser),
        });

        const data = await response.json();
        // console.log(data.accessToken);

        setMessage(data.message);
        localStorage.setItem("accessToken", "Bearer " + data.accessToken);

        // clear form
        setName("");
        setEmail("");
        setPassword("");

        setIsUpdateForm(false);
        setIsTokenSaved(prevstate => !prevstate);
    };
    return (
        <div>
            <h1>Update Here</h1>
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
                <button onClick={updateHandler}>Update</button>
            </form>
        </div>
    );
};

export default Update;
