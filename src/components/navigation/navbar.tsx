import { User } from "firebase/auth";
import { Survey } from "../../models/Survey";
import { LogOutCurrentUser } from "../../repositories/auth";

interface NavBarButtonProps {
    Text: string,
    Href: string,
    Disabled: boolean
}

function NavBarButton(props: NavBarButtonProps) {
    const className = props.Disabled? "navbar-button-disabled" : "navbar-button";

    return <li className={className}>
        {
            props.Disabled?
            <div>{props.Text}</div>
            :
            <a href={props.Href} className="navbar-link text-white">{props.Text}</a>
        }
    </li>;
}


function SignOutNavBarButton() {
    async function onSignOutClick() {
        await LogOutCurrentUser();
        window.location.href = "/";
    }

    return <li onClick={onSignOutClick} className="navbar-button">
        <div className="navbar-link text-white">Cerrar Sesión</div>
    </li>;
}


interface NavBarProps {
    User: User | null
}


/**
 * Displays the navbar of the app when no survey is selected.
 * @returns 
 */
export function NavBar(props: NavBarProps) {
    const user = props.User;

    if(user) {
        return <ul className="navbar-container">
            <NavBarButton Disabled={false} Href="/help" Text="Ayuda"></NavBarButton>
            <SignOutNavBarButton></SignOutNavBarButton>
            <NavBarButton Disabled={false} Href="/" Text="Mis Encuestas"></NavBarButton>
        </ul>;
    } else {
        return <ul className="navbar-container">
            <NavBarButton Disabled={false} Href="/help" Text="Ayuda"></NavBarButton>
            <NavBarButton Disabled={false} Href="/login" Text="Iniciar Sesión"></NavBarButton>
            <NavBarButton Disabled={false} Href="/signup" Text="Crear Cuenta"></NavBarButton>
        </ul>;
    }
}

interface NavBarWithSurveyProps {
    Survey: Survey,
    QuestionId?: string,
    Disabled?: boolean,
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

    const disabled = props.Disabled ?? false;

    return <ul className="navbar-container">
        <NavBarButton Disabled={false} Href="/help" Text="Ayuda"></NavBarButton>
        <SignOutNavBarButton></SignOutNavBarButton>
        <NavBarButton Disabled={false} Href="/" Text="Mis Encuestas"></NavBarButton>
        <NavBarButton Disabled={disabled} Href={`/${survey.ID}`} Text={survey.Title}></NavBarButton>
        <NavBarButton Disabled={disabled} Href={`/${survey.ID}/profile`} Text="Perfiles"></NavBarButton>
        <NavBarButton Disabled={disabled} Href={`/${survey.ID}/question`} Text="Preguntas"></NavBarButton>
        {
            questionId?
            <>
            <NavBarButton Disabled={disabled} Href={`/${survey.ID}/question/${questionId}`} Text="Información Pregunta"></NavBarButton>
            <NavBarButton Disabled={disabled} Href={`/${survey.ID}/question/${questionId}/version`} Text="Versiones"></NavBarButton>
            </>:
            <></>
        }
    </ul>;
}