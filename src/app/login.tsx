import { LogInForm } from "../components/forms/login";
import { NavBar } from "../components/navigation/navbar";

function LogIn() {
    return <>
        <NavBar></NavBar>

        <main>
            <LogInForm></LogInForm>
        </main>
    </>;
}

export default LogIn;