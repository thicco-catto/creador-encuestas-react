import { FormEvent, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { LogInUser } from "../../repositories/auth";

export function LogInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState(false);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();

        const loggedInUser = await LogInUser(email, password);
        if(!loggedInUser) {
            setError(true);
            return;
        }

        const relativePath = window.location.pathname;
        if(relativePath !== "/") {
            window.location.href = "/";
        }
    }

    return <>
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="email">Email:</Form.Label>
                <Form.Control
                    id="email"
                    name="email"
                    style={{ width: "40%" }}
                    required
                    type="text"
                    defaultValue={email}
                    placeholder="Introduce tu correo electrónico"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="password">Contraseña:</Form.Label>
                <Form.Control
                    id="password"
                    name="password"
                    style={{ width: "40%" }}
                    required
                    type="password"
                    defaultValue={password}
                    placeholder="Introduce tu contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            <div className="login-buttons-container">
                {
                    error?
                    <p className="error-message">Email o contraseña incorrectos.</p>
                    :
                    <></>
                }
                <Button variant="secondary" type="submit" className="mb-3">
                    Iniciar Sesión
                </Button>

                <hr style={{ border: "1px solid" }}></hr>

                <p>¿No tienes cuenta?</p>

                <Button as="a" href="/signup" variant="secondary">
                    Crear Cuenta
                </Button>
            </div>
        </Form>
    </>;
}