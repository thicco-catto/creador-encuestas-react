import { GetQuestionTypeName, Question } from "../../models/Question";
import { DeleteQuestion } from "../../repositories/questionRepo";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

interface QuestionListElementProps {
    SurveyId: string,
    Question: Question
}

function QuestionListElement(props: QuestionListElementProps) {
    const question = props.Question;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const confirmDelete = async () => {
        await DeleteQuestion(props.SurveyId, props.Question.ID!);
        handleClose();

        // TODO: Find alternative
        // router.refresh();
    };

    return <li className="survey-list-element">
        <h2>{question.InternalTitle}</h2>
        <p><strong>Tipo:</strong> Pregunta de {GetQuestionTypeName(question.QuestionType)}</p>
        <br></br>
        <a href={`/edit/${props.SurveyId}/question/${question.ID}`} className="me-2"><Button variant="secondary">Editar Detalles</Button></a>
        <a href={`/edit/${props.SurveyId}/question/${question.ID}/version/default`} className="me-2"><Button variant="secondary">Editar Respuestas</Button></a>
        <a href={`/edit/${props.SurveyId}/question/${question.ID}/version`}><Button variant="secondary">Versiones</Button></a>
        <Button onClick={handleShow} variant="danger" style={{ float: "right" }}>Eliminar</Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>¿Eliminar pregunta {question.InternalTitle}?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Eliminar esta pregunta es una acción permanente. ¿Continuar?</Modal.Body>
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

interface QuestionListProps {
    SurveyID: string,
    Questions: Question[],
    QuestionOrder: string[]
}

/**
 * Displays a list of questions
 * @param props 
 */
export function QuestionList(props: QuestionListProps) {
    const questions = props.Questions;
    return <>
        <a href={`/edit/${props.SurveyID}/question/new`} style={{ textDecoration: "none", color: "white" }}><button className="btn btn-secondary mb-3">Añadir</button></a>
        <ul className="survey-list">
            {props.QuestionOrder.map((id) =>
                <QuestionListElement key={id} SurveyId={props.SurveyID} Question={questions.find(x => x.ID === id)!}></QuestionListElement>
            )}
        </ul>
    </>;
}