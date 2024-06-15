import { FormEvent, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { SignUpUser } from "../../repositories/auth";

export function SignUpForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    async function onSubmit(e: FormEvent) {
        e.preventDefault();

        if(password !== repeatPassword) {
            return;
        }

        await SignUpUser(email, password);
    }

    return <>
    <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
            <Form.Label htmlFor="email">Email:</Form.Label>
            <Form.Control
                id="email"
                name="email"
                style={{width: "40%"}}
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
                style={{resize: "none"}}
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
                password !== repeatPassword?
                <p className="text-red">Las contraseñas deben ser iguales.</p>
                :
                <></>
            }
            <Form.Control
                id="repeat-password"
                name="repeat-password"
                style={{resize: "none"}}
                required
                type="password"
                defaultValue={repeatPassword}
                placeholder="Introduce la misma contraseña"
                onChange={(e) => setRepeatPassword(e.target.value)}
            />
        </Form.Group>

        <Button variant="secondary" type="submit" disabled={password !== repeatPassword}>
            Crear Cuenta
        </Button>
        </Form>
    </>;
}