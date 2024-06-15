import { LogInForm } from "../components/forms/login";
import { NavBar } from "../components/navigation/navbar";

function LogIn() {
    return <>
        <NavBar></NavBar>

        <main>
            <h1>Iniciar Sesión</h1>
            <LogInForm></LogInForm>
        </main>
    </>;
}

export default LogIn;