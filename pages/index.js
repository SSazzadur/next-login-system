import { useState, useEffect } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import Update from "../components/Update";

export default function Home() {
    const [isUserTable, setIsUserTable] = useState(false);
    const [users, setUsers] = useState([]);

    const [isRegisterForm, setIsRegisterForm] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const [isLoginForm, setIsLoginForm] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isTokenSaved, setIsTokenSaved] = useState(false);
    const [loggedUser, setLoggedUser] = useState(null);

    const [isUpdateForm, setIsUpdateForm] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [message, setMessage] = useState("");

    const allUserHandler = async () => {
        setIsUserTable(!isUserTable);
        setIsLoading(true);

        if (!isUserTable) {
            const response = await fetch("/api/allusers", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

            setUsers(data);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (localStorage.getItem("accessToken") !== null) {
                const accessToken = localStorage.getItem("accessToken");
                const response = await fetch("/api/userAuth", {
                    method: "GET",
                    headers: {
                        Authorization: accessToken,
                    },
                });
                const data = await response.json();

                setLoggedUser(data);
                setIsLoggedIn(true);
            }
        };

        fetchData();
    }, [isTokenSaved]);

    const logoutHandler = () => {
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
        setLoggedUser(null);
        setMessage("You have been logged out");
    };

    setTimeout(() => {
        setMessage("");
    }, 10000);

    return (
        <div style={{ width: "70%", margin: "1rem auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button onClick={allUserHandler}>All Users</button>
                {isLoggedIn ? (
                    <>
                        <button onClick={logoutHandler}>Logout</button>

                        <button onClick={() => setIsUpdateForm(!isUpdateForm)}>Update</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsRegisterForm(!isRegisterForm)}>Register</button>
                        <button onClick={() => setIsLoginForm(!isLoginForm)}>Login</button>
                    </>
                )}
            </div>

            {loggedUser !== null && <h1>Logged In as {loggedUser.name}</h1>}
            {message && <h3>{message}</h3>}

            {isUserTable && (
                <table
                    width="100%"
                    border="1"
                    style={{ textAlign: "center", marginBlock: "2rem", wordBreak: "break-all" }}
                >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="2">No Users</td>
                            </tr>
                        )}
                        {isLoading ? (
                            <tr>
                                <td colSpan="2">Loading...</td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}

            {isRegisterForm && <Register setMessage={setMessage} />}
            {isLoginForm && (
                <Login
                    setIsTokenSaved={setIsTokenSaved}
                    setIsLoginForm={setIsLoginForm}
                    setMessage={setMessage}
                />
            )}
            {isUpdateForm && (
                <Update
                    setMessage={setMessage}
                    user={loggedUser}
                    setIsTokenSaved={setIsTokenSaved}
                    setIsUpdateForm={setIsUpdateForm}
                />
            )}
        </div>
    );
}
