import { User } from "firebase/auth";
import { useState, useEffect } from "react";
import { LogInForm } from "../components/forms/login";
import { NavBar } from "../components/navigation/navbar";
import { OnAuthStateChanged } from "../repositories/auth";

function LogIn() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        OnAuthStateChanged((user) => {
            setUser(user);
        });
    }, []);

    return <>
        <NavBar User={user}></NavBar>

        <main>
            <h1>Iniciar Sesión</h1>
            <hr style={{border: "2px solid"}}></hr>
            <LogInForm></LogInForm>
        </main>
    </>;
}

export default LogIn;