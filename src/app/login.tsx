import { User } from "firebase/auth";
import { useState, useEffect } from "react";
import { LogInForm } from "../components/forms/login";
import { NavBar } from "../components/navigation/navbar";
import { OnAuthStateChanged } from "../repositories/auth";
import { PageTemplate } from "../components/editPageTemplate";

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
            <PageTemplate Title="Iniciar Sesión">
                <LogInForm></LogInForm>
            </PageTemplate>
        </main>
    </>;
}

export default LogIn;