import { Survey } from "../../models/Survey";

interface NavBarButtonProps {
    Text: string,
    Href: string
}

function NavBarButton(props: NavBarButtonProps) {
    return <li className="navbar-button"><a href={props.Href} className="navbar-link text-white">{props.Text}</a></li>;
}


/**
 * Displays the navbar of the app when no survey is selected.
 * @returns 
 */
export function NavBar() {
    return <ul className="navbar-container">
        <NavBarButton Href="/" Text="Mis Encuestas"></NavBarButton>
    </ul>;
}

interface NavBarWithSurveyProps {
    Survey: Survey,
    QuestionId?: string
}

/**
 * Displays the navbar of the app when a survey is selected. Can also optionally
 * display buttons related to a given question.
 * @param props 
 * @returns 
 */
export function NavBarWithSurvey(props: NavBarWithSurveyProps) {
    const survey = props.Survey;
    const questionId = props.QuestionId;

    return <ul className="navbar-container">
        <NavBarButton Href="/" Text="Mis Encuestas"></NavBarButton>
        <NavBarButton Href={`/edit/${survey.ID}`} Text={survey.Title}></NavBarButton>
        <NavBarButton Href={`/edit/${survey.ID}/profile`} Text="Perfiles"></NavBarButton>
        <NavBarButton Href={`/edit/${survey.ID}/question`} Text="Preguntas"></NavBarButton>
        {
            questionId?
            <>
            <NavBarButton Href={`/edit/${survey.ID}/question/${questionId}`} Text="Información Pregunta"></NavBarButton>
            <NavBarButton Href={`/edit/${survey.ID}/question/${questionId}/version`} Text="Versiones"></NavBarButton>
            </>:
            <></>
        }
    </ul>;
}