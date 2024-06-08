import { Question } from "../../models/Question";
import { AddQuestion, DeleteQuestion, UpdateQuestion } from "../../repositories/questionRepo";
import { GetAllVersions, UpdateVersion } from "../../repositories/versionRepo";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Floppy2 } from "react-bootstrap-icons";

interface QuestionDetailsFormProps {
    SurveyID: string,
    QuestionID?: string,
    Question: Question
}

/**
 * Displays the form that shows when editing a question's properties.
 * 
 * If the `QuestionID` is not supplied it will show options related to
 * creating a new question.
 * @param props 
 */
export function QuestionForm(props: QuestionDetailsFormProps) {
    const question: Question = props.Question;
    const defaultVersion = question.DefaultDetails;

    const [buttonClicked, setButtonClicked] = useState("None");

    function AdjustAnswersLength(answers: string[], targetAnswerNum: number) {
        const currentLength = answers.length;

        if(currentLength > targetAnswerNum) {
            answers.length = targetAnswerNum;
        } else if (currentLength < targetAnswerNum) {
            for (let i = currentLength; i < targetAnswerNum; i++) {
                answers.push(`Respuesta ${i + 1}`);
            }
        }
    }

    async function onSubmit(data: FormData) {
        const newQuestion: Question = {
            HasVersions: question.HasVersions,
            InternalTitle: data.get("title")!.toString(),
            QuestionType: parseInt(data.get("questionType")!.toString()),
            DefaultDetails: question.DefaultDetails
        };
        const numAnswers = parseInt(data.get("numAnswers")!.toString());

        let newId: string = question.ID!;

        if (question.ID) {
            // Updating existing question
            AdjustAnswersLength(newQuestion.DefaultDetails.Answers, numAnswers);

            const versions = await GetAllVersions(props.SurveyID, question.ID);
            if(versions) {
                for (let i = 0; i < versions.length; i++) {
                    const version = versions[i];
                    
                    AdjustAnswersLength(version.Details.Answers, numAnswers);

                    await UpdateVersion(props.SurveyID, question.ID, version.ID!, version);
                }
            }

            await UpdateQuestion(props.SurveyID, question.ID, newQuestion);
        } else {
            // Creating new question
            const newAnswers: string[] = [];

            for (let i = 0; i < numAnswers; i++) {
                newAnswers.push(`Respuesta ${i + 1}`);
            }

            newQuestion.DefaultDetails.Answers = newAnswers;

            const added = await AddQuestion(props.SurveyID, newQuestion);
            newId = added.ID!;
        }

        if (buttonClicked == "ToVersions") {
            window.location.href = `/edit/${props.SurveyID}/question/${newId}/version`;
        } else {
            window.location.href = `/edit/${props.SurveyID}/question/${newId}/version/default`;
        }
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const confirmDelete = async () => {
        await DeleteQuestion(props.SurveyID, props.QuestionID!);

        window.location.href = `/edit/${props.SurveyID}`;
    };

    return <Form>
        <Form.Group className="mb-3">
            <Form.Label htmlFor="title">Título interno:</Form.Label>
            <Form.Control id="title" name="title" style={{ width: "40%" }} required type="text" defaultValue={question.InternalTitle} placeholder="Este titulo solo se muestra en la aplicacion"></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label htmlFor="questionType">Tipo de pregunta:</Form.Label>
            <Form.Select id="questionType" name="questionType" style={{ width: "40%" }} defaultValue={question.QuestionType.toString()}>
                <option value="1">Elección Única</option>
                <option value="2">Elección Múltiple</option>
                <option value="3">Texto Libre</option>
                <option value="4">Fecha</option>
                <option value="5">Escala Numérica</option>
            </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label htmlFor="numAnswers">Número de respuestas:</Form.Label>
            <Form.Control id="numAnswers" name="numAnswers" style={{ width: "40%" }} required type="number" defaultValue={defaultVersion.Answers.length}></Form.Control>
        </Form.Group>

        <Button onClick={() => setButtonClicked("ToAnswers")} variant="secondary" className="me-3" type="submit">
            <Floppy2></Floppy2> Editar Respuestas
        </Button>
        <Button onClick={() => setButtonClicked("ToVersions")} variant="secondary" type="submit">
            <Floppy2></Floppy2> Gestionar Versiones
        </Button>
        {
            props.QuestionID ?
                <Button onClick={handleShow} variant="danger" type="button" style={{ float: "right" }}>Eliminar</Button> :
                <></>
        }

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
    </Form>;
}