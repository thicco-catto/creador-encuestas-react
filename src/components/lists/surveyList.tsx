import { Survey } from "../../models/Survey";
import { DeleteSurvey } from "../../repositories/surveyRepo";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { SetVariable, StorageVariable } from "../../utils/localStorage";

interface SurveyListElementProps {
    Survey: Survey
}

function SurveyListElement(props: SurveyListElementProps) {
    const survey = props.Survey;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function onClickEdit() {
        SetVariable(StorageVariable.SURVEY_INFO, survey);

        window.location.href = `/${survey.ID}/loading`;
    }

    async function confirmDelete() {
        await DeleteSurvey(survey.ID);
        handleClose();

        // TODO: Find alternative
        // router.refresh();
    };

    return <li className="survey-list-element">
        <h2>{survey.Title}</h2>
        <p>{survey.PrivateDescription}</p>

        <Button variant="secondary" style={{marginRight: "10px"}}>Compartir</Button>
        <Button onClick={onClickEdit} variant="secondary">Editar</Button>
        <Button onClick={handleShow} variant="danger" style={{float: "right"}}>Eliminar</Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>¿Eliminar encuesta {survey.Title}?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Eliminar esta encuesta es una acción permanente. ¿Continuar?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={confirmDelete}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    </li>;
}

interface SurveyListProps {
    Surveys: Survey[]
}


/**
 * Displays a list of surveys.
 * @param props 
 */
export function SurveyList(props: SurveyListProps) {
    const surveys = props.Surveys;
    surveys.sort((a, b) => a.Title.localeCompare(b.Title));
    return <>
    <a href="/new"><Button variant="secondary" className="mb-3">Crear Nueva</Button></a>

    <ul className="survey-list">
        {surveys.map(survey => <SurveyListElement key={surveys.indexOf(survey)} Survey={survey}></SurveyListElement>)}
    </ul>
    </>;
}