import { Row, Col, Container } from "react-bootstrap";
import { NavBarWithSurvey } from "./navigation/navbar";
import { QuestionsSidebar } from "./navigation/questionSidebar";
import { Profile } from "../models/Profile";
import { Question } from "../models/Question";
import { Survey } from "../models/Survey";

interface PageLayoutProps {
    Survey: Survey,
    Profiles: Profile[]
    Questions: Question[],
    QuestionId?: string,
    SelectedProfile?: string,
    AffectedProfiles?: string[],
}

export function PageLayout(props: React.PropsWithChildren<PageLayoutProps>) {
    const survey = props.Survey;
    const profiles = props.Profiles;
    const questions = props.Questions;
    const questionId = props.QuestionId;
    const selectedProfile = props.SelectedProfile;

    return <>
        <NavBarWithSurvey Survey={survey} QuestionId={questionId}></NavBarWithSurvey>

        <Container className="p-0 m-0" style={{ height: "100%" }}>
            <Row style={{ height: "100%" }}>
                <Col md="2" style={{ background: "gainsboro" }}>
                    <QuestionsSidebar Questions={questions} QuestionOrder={survey.QuestionOrder} SurveyId={survey.ID} Profiles={profiles} SelectedQuestion={questionId} SelectedProfile={selectedProfile} AffectedProfiles={props.AffectedProfiles}></QuestionsSidebar>
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