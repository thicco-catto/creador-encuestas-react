import { Row, Col, Container } from "react-bootstrap";
import { NavBarWithSurvey } from "./navigation/navbar";
import { QuestionsSidebar } from "./navigation/questionSidebar";
import { Profile } from "../models/Profile";
import { Question } from "../models/Question";
import { Survey } from "../models/Survey";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GetVariable, StorageVariable } from "../utils/localStorage";

interface PageLayoutProps {
    QuestionId?: string,
    SelectedProfile?: string,
    AffectedProfiles?: string[],
}

export function PageLayout(props: React.PropsWithChildren<PageLayoutProps>) {
    const params = useParams();
    const surveyId = params.surveyId!;

    const [survey, setSurvey] = useState<Survey | null>(null);
    const [questions, setQuestions] = useState<Question[] | null>(null);
    const [profiles, setProfiles] = useState<Profile[] | null>(null);

    useEffect(() => {
        const surveyData = GetVariable(StorageVariable.SURVEY_INFO);
        const questionsData = GetVariable(StorageVariable.QUESTIONS);
        const profilesData = GetVariable(StorageVariable.PROFILES);

        if(!survey || !questions || !profiles || survey.ID !== surveyId) {
            window.location.href = `/${surveyId}/loading`;
        } else {
            setSurvey(surveyData);
            setQuestions(questionsData);
            setProfiles(profilesData);
        }
    }, [survey, questions, profiles, surveyId]);

    if(!survey || !questions || !profiles) {
        return <></>;
    }

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