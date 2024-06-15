import { NavBar } from "../components/navigation/navbar";
import { SignUpForm } from "../components/forms/signup";
import { User } from "firebase/auth";
import { useState, useEffect } from "react";
import { OnAuthStateChanged } from "../repositories/auth";

function SignUp() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        OnAuthStateChanged((user) => {
            setUser(user);
        });
    }, []);

    return <>
        <NavBar User={user}></NavBar>

        <main>
            <SignUpForm></SignUpForm>
        </main>
    </>;
}

export default SignUp;