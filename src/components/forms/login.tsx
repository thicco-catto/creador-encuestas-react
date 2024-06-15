import { FormEvent, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { LogInUser } from "../../repositories/auth";

export function LogInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function onSubmit(e: FormEvent) {
        e.preventDefault();

        await LogInUser(email, password);
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
                placeholder="Introduce tu contraseña"
                onChange={(e) => setPassword(e.target.value)}
            />
        </Form.Group>

        <Button variant="secondary" type="submit">
            Iniciar Sesión
        </Button>
        </Form>
    </>;
}