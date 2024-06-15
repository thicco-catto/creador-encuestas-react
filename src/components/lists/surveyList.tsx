import { Survey } from "../../models/Survey";
import { DeleteSurvey } from "../../repositories/surveyRepo";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { SetVariable, StorageVariable } from "../../utils/localStorage";
import QRCode from "qrcode.react";


interface SurveyListElementProps {
    Survey: Survey
}

function SurveyListElement(props: SurveyListElementProps) {
    const survey = props.Survey;
    const surveyLink = `https://rellenar-encuestas.vercel.app/${survey.ID}/start`;

    const [deleteModalShow, setDeleteModalShow] = useState(false);

    const handleDeleteModalClose = () => setDeleteModalShow(false);
    const handleDeleteModalShow = () => setDeleteModalShow(true);

    const [shareModalShow, setShareModalShow] = useState(false);

    const handleShareModalClose = () => setShareModalShow(false);
    const handleShareModalShow = () => setShareModalShow(true);

    function onClickEdit() {
        SetVariable(StorageVariable.SURVEY_INFO, survey);

        window.location.href = `/${survey.ID}/loading`;
    }

    async function confirmDelete() {
        await DeleteSurvey(survey.ID);
        handleDeleteModalClose();

        window.location.reload();
    };

    return <li className="survey-list-element">
        <h2>{survey.Title}</h2>
        <p>{survey.PrivateDescription}</p>

        <Button onClick={handleShareModalShow} variant="secondary" style={{marginRight: "10px"}}>Compartir</Button>
        <Button onClick={onClickEdit} variant="secondary">Editar</Button>
        <Button onClick={handleDeleteModalShow} variant="danger" style={{float: "right"}}>Eliminar</Button>

        <Modal show={deleteModalShow} onHide={handleDeleteModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>¿Eliminar encuesta {survey.Title}?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Eliminar esta encuesta es una acción permanente. ¿Continuar?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleDeleteModalClose}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={confirmDelete}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>

        <Modal size="lg" show={shareModalShow} onHide={handleShareModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Compartir encuesta {survey.Title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{textAlign: "center"}}>
                    <p className="mb-1">Escanea el siguiente código QR...</p>
                    <QRCode value={surveyLink}></QRCode>
                    <p className="mt-3 mb-0">...o sigue el siguiente enlace.</p>
                    <a href={surveyLink}>{surveyLink}</a>
                </div>
            </Modal.Body>
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