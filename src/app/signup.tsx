import { NavBar } from "../components/navigation/navbar";
import { SignUpForm } from "../components/forms/signup";

function SignUp() {
    return <>
        <NavBar></NavBar>

        <main>
            <SignUpForm></SignUpForm>
        </main>
    </>;
}

export default SignUp;