import { Row, Col, Container } from "react-bootstrap";
import { NavBarWithSurvey } from "./navigation/navbar";
import { Survey } from "../models/Survey";
import { QuestionsSidebarLoading } from "./navigation/questionSidebarLoading";

interface PageLayoutProps {
    Survey: Survey,
    Disabled?: boolean
}

export function PageLayoutLoading(props: React.PropsWithChildren<PageLayoutProps>) {
    const survey = props.Survey;

    return <>
        <NavBarWithSurvey Disabled={props.Disabled} Survey={survey}></NavBarWithSurvey>

        <Container className="p-0 m-0" style={{ height: "100%" }}>
            <Row style={{ height: "100%" }}>
                <Col md="2" style={{ background: "gainsboro" }}>
                    <QuestionsSidebarLoading></QuestionsSidebarLoading>
                </Col>

                <Col>
                    <main style={{ padding: "40px" }}>
                        {props.children}
                    </main>
                </Col>
            </Row>
        </Container>
    </>;
}