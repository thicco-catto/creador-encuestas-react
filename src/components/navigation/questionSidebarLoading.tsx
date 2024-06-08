import { Button, Container, Row, Spinner } from "react-bootstrap";


/**
 * Displays the regular sidebar that contains a list of questions and profiles, but contains
 * two spinners instead
 */
export function QuestionsSidebarLoading() {
    return <Container>
        <Row>
            <ul style={{ listStyle: "none", padding: "4px" }}>
                <li><h4 className="text-center">Preguntas</h4></li>

                <li><Spinner></Spinner></li>

                <li className="text-center">
                    <Button disabled={true} className="btn btn-secondary">Gestionar Preguntas</Button>
                </li>
            </ul>
        </Row>

        <Row>
            <ul style={{ listStyle: "none", padding: "4px" }}>
                <li><h4 className="text-center">Perfiles</h4></li>

                <li><Spinner></Spinner></li>

                <li className="text-center">
                    <Button disabled={true} variant="secondary">Gestionar Perfiles</Button>
                </li>
            </ul>
        </Row>
    </Container>;
}