import { useParams } from "react-router-dom";
import { QuestionVersion } from "../../models/QuestionVersion";
import { DeleteVersion } from "../../repositories/versionRepo";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

interface VersionListElementProps {
    Version: QuestionVersion
}

function VersionListElement(props: VersionListElementProps) {
    const params = useParams();
    const surveyId = params.surveyId!;
    const questionId = params.questionId!;

    const version = props.Version;
    const baseVersionUrl = `/${surveyId}/question/${questionId}/version/${version.ID}`;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const confirmDelete = async () => {
        handleClose();
        await DeleteVersion(surveyId, questionId, version.ID!);

        window.location.reload();
    };

    return <li className="survey-list-element">
        <h2>{version.Title}</h2>
        <p>{version.Description}</p>
        <a href={baseVersionUrl}><Button variant="secondary" style={{marginRight: "10px"}}>Editar Información</Button></a>
        <a href={baseVersionUrl + "/details"}><Button variant="secondary">Editar Respuestas</Button></a>
        <Button onClick={handleShow} variant="danger" style={{float: "right"}}>Eliminar</Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>¿Eliminar versión {version.Title}?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Eliminar esta versión es una acción permanente. ¿Continuar?</Modal.Body>
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

interface VersionListProps {
    Versions: QuestionVersion[]
}

/**
 * Displays a list of question versions.
 * @param props 
 */
export function VersionList(props: VersionListProps) {
    const params = useParams();
    const surveyId = params.surveyId!;
    const questionId = params.questionId!;

    const versions = props.Versions;

    return <>
    <a href={`/${surveyId}/question/${questionId}/version/new`} className="no-style-link-white">
        <Button variant="secondary" className="mb-3">Añadir</Button>
    </a>

    <ul className="survey-list">
        <li className="survey-list-element">
            <h2>{"Por defecto"}</h2>
            <p>Esta versión de la pregunta se mostrará por defecto a todos los usuarios</p>
            <Button variant="secondary" disabled style={{marginRight: "10px"}}>Editar Información</Button>
            <a href={`/${surveyId}/question/${questionId}/version/default`}><Button variant="secondary">Editar Respuestas</Button></a>
            <Button variant="danger" style={{float: "right"}} disabled>Eliminar</Button>
        </li>

        {versions.map((version, i) =>
            <VersionListElement key={i} Version={version}></VersionListElement>
        )}
    </ul>
    </>;
}