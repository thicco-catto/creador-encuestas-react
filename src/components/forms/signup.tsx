import { FormEvent, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { SignUpUser } from "../../repositories/auth";

export function SignUpForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [error, setError] = useState(false);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();

        if (password !== repeatPassword) {
            return;
        }

        const user = await SignUpUser(email, password);
        if(!user) {
            setError(true);
            return;
        }

        window.location.href = "/";
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
                    placeholder="Introduce una contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="repeat-password">Repita la contraseña:</Form.Label>
                {
                    password !== repeatPassword ?
                        <p className="text-red">Las contraseñas deben ser iguales.</p>
                        :
                        <></>
                }
                <Form.Control
                    id="repeat-password"
                    name="repeat-password"
                    style={{ width: "40%" }}
                    required
                    type="password"
                    defaultValue={repeatPassword}
                    placeholder="Introduce la misma contraseña"
                    onChange={(e) => setRepeatPassword(e.target.value)}
                />
            </Form.Group>

            <div className="login-buttons-container">
                {
                    error?
                    <p className="error-message">Ha ocurrido un error al crear la cuenta.</p>
                    :
                    <></>
                }
                <Button variant="secondary" type="submit" disabled={password !== repeatPassword} className="mb-3">
                    Crear Cuenta
                </Button>

                <hr style={{ border: "1px solid" }}></hr>

                <p>¿Ya tienes cuenta?</p>

                <Button as="a" href="/login" variant="secondary">
                    Inicia Sesión
                </Button>
            </div>
        </Form>
    </>;
}