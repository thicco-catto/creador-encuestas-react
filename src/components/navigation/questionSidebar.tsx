import { Profile } from "../../models/Profile";
import { Question, QuestionType } from "../../models/Question";
import { CSSProperties, useState } from "react";
import { Button, ButtonGroup, Container, Row } from "react-bootstrap";
import { ArrowLeft, ArrowRight, Calendar, Check2Circle, Collection, Icon1Circle, PencilSquare, UiChecksGrid } from "react-bootstrap-icons";

const QUESTION_PAGE_SIZE = 10;
const PROFILE_PAGE_SIZE = 5;

interface QuestionsSidebarElementProps {
    Question: Question,
    SurveyId: string,
    SelectedQuestion?: string,
}

function QuestionSidebarElement(props: QuestionsSidebarElementProps) {
    const question = props.Question;

    const style: CSSProperties = {};
    if (question.ID && question.ID === props.SelectedQuestion) {
        style.borderColor = "#000000";
        style.borderWidth = "4px";
    }

    function GetTypeIcon() {
        if (question.QuestionType === QuestionType.SINGLE_CHOICE) {
            return <Check2Circle></Check2Circle>;
        } else if (question.QuestionType === QuestionType.MULTIPLE_CHOICE) {
            return <UiChecksGrid></UiChecksGrid>;
        } else if (question.QuestionType === QuestionType.FREE_TEXT) {
            return <PencilSquare></PencilSquare>;
        } else if (question.QuestionType === QuestionType.DATE) {
            return <Calendar></Calendar>;
        } else if (question.QuestionType === QuestionType.RANGE) {
            return <Icon1Circle></Icon1Circle>;
        }

        return <></>;
    }

    function GetVersionsIcon() {
        if (question.HasVersions) {
            return <Collection></Collection>;
        }

        return <></>;
    }

    return <a href={`/${props.SurveyId}/question/${question.ID}`} className="no-style-link">
        <li className="question-sidebar-element" style={style}>
            {question.InternalTitle} {GetTypeIcon()} {GetVersionsIcon()}
        </li>
    </a>;
}


interface ProfileSidebarElementProps {
    Profile: Profile,
    SurveyId: string,
    SelectedProfile?: string,
    AffectedProfiles?: string[]
}

function ProfileSidebarElement(props: ProfileSidebarElementProps) {
    const profile = props.Profile;

    const style: CSSProperties = {};
    if (profile.ID && profile.ID === props.SelectedProfile) {
        style.borderColor = "#000000";
        style.borderWidth = "4px";
    }

    if (profile.ID && props.AffectedProfiles && props.AffectedProfiles.includes(profile.ID)) {
        style.borderColor = "#666666";
        style.borderWidth = "4px";
    }

    return <a href={`/${props.SurveyId}/profile/${profile.ID}`} className="no-style-link"><li className="question-sidebar-element" style={style}>{profile.Title}</li></a>;
}

interface QuestionsSidebarProps {
    Questions: Question[],
    Profiles: Profile[]
    SurveyId: string,
    QuestionOrder: string[],
    SelectedQuestion?: string,
    SelectedProfile?: string,
    AffectedProfiles?: string[],
}


/**
 * Displays a sidebar that contains a list of questions and profiles for the selected survey.
 * @param props 
 */
export function QuestionsSidebar(props: QuestionsSidebarProps) {
    const questions = props.Questions;
    const profiles = props.Profiles;
    profiles.sort((a, b) => a.Title.localeCompare(b.Title));

    let defaultQuestionPage = 0;

    const selectedQuestionId = props.SelectedQuestion;
    if (selectedQuestionId) {
        const index = props.QuestionOrder.indexOf(selectedQuestionId);
        defaultQuestionPage = Math.floor(index / QUESTION_PAGE_SIZE);
    }

    const [questionPage, setQuestionPage] = useState(defaultQuestionPage);

    let defaultProfilePage = 0;

    const selectedProfileId = props.SelectedProfile;
    if (selectedProfileId) {
        const index = props.Profiles.findIndex(x => x.ID === selectedProfileId);
        defaultProfilePage = Math.floor(index / PROFILE_PAGE_SIZE);
    }

    const [profilePage, setProfilePage] = useState(defaultProfilePage);

    return <Container>
        <Row>
            <ul style={{ listStyle: "none", padding: "4px" }}>
                <li><h4 className="text-center">Preguntas</h4></li>
                {props.QuestionOrder.slice(questionPage * QUESTION_PAGE_SIZE, questionPage * QUESTION_PAGE_SIZE + QUESTION_PAGE_SIZE).map((id) =>
                    <QuestionSidebarElement key={id} Question={questions.find(x => x.ID === id)!} SurveyId={props.SurveyId} SelectedQuestion={props.SelectedQuestion}></QuestionSidebarElement>
                )}
                <li className="text-center mb-1">
                    {
                        props.QuestionOrder.length >= QUESTION_PAGE_SIZE ?
                            <ButtonGroup>
                                <Button variant="secondary" disabled={questionPage === 0} onClick={() => setQuestionPage(questionPage - 1)}>
                                    <ArrowLeft></ArrowLeft>
                                </Button>
                                <Button variant="secondary" disabled={questionPage * QUESTION_PAGE_SIZE + QUESTION_PAGE_SIZE >= props.QuestionOrder.length} onClick={() => setQuestionPage(questionPage + 1)}>
                                    <ArrowRight></ArrowRight>
                                </Button>
                            </ButtonGroup>
                            :
                            <></>
                    }
                </li>

                <li className="text-center"><a href={`/${props.SurveyId}/question`}><button className="btn btn-secondary">Gestionar Preguntas</button></a></li>
            </ul>
        </Row>

        <Row>
            <ul style={{ listStyle: "none", padding: "4px" }}>
                <li><h4 className="text-center">Perfiles</h4></li>
                {profiles.slice(profilePage * PROFILE_PAGE_SIZE, profilePage * PROFILE_PAGE_SIZE + PROFILE_PAGE_SIZE).map((profile) =>
                    <ProfileSidebarElement key={profile.ID} Profile={profile} SurveyId={props.SurveyId} SelectedProfile={props.SelectedProfile} AffectedProfiles={props.AffectedProfiles}></ProfileSidebarElement>
                )}
                <li className="text-center mb-1">
                    {
                        props.QuestionOrder.length >= PROFILE_PAGE_SIZE ?
                            <ButtonGroup>
                                <Button variant="secondary" disabled={profilePage === 0} onClick={() => setProfilePage(profilePage - 1)}>
                                    <ArrowLeft></ArrowLeft>
                                </Button>
                                <Button variant="secondary" disabled={profilePage * PROFILE_PAGE_SIZE + PROFILE_PAGE_SIZE >= props.Profiles.length} onClick={() => setProfilePage(profilePage + 1)}>
                                    <ArrowRight></ArrowRight>
                                </Button>
                            </ButtonGroup>
                            :
                            <></>
                    }
                </li>
                <li className="text-center"><a href={`/${props.SurveyId}/profile`}><button className="btn btn-secondary">Gestionar Perfiles</button></a></li>
            </ul>
        </Row>
    </Container>;
}