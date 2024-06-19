import { useParams } from "react-router-dom";
import { Question } from "../../models/Question";
import { AddQuestion, DeleteQuestion, UpdateQuestion } from "../../repositories/questionRepo";
import { GetAllVersions, UpdateVersion } from "../../repositories/versionRepo";
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Floppy2 } from "react-bootstrap-icons";

interface QuestionDetailsFormProps {
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
    const params = useParams();
    const surveyId = params.surveyId!;

    const question: Question = props.Question;

    const [title, setTitle] = useState(question.InternalTitle);
    const [questionType, setQuestionType] = useState(question.QuestionType.toString());
    const [numAnswers, setNumAnswers] = useState(question.DefaultDetails.Answers.length);
    const [help, setHelp] = useState(question.Help);

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

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        const newQuestion: Question = {
            HasVersions: question.HasVersions,
            InternalTitle: title,
            QuestionType: parseInt(questionType),
            DefaultDetails: question.DefaultDetails,
            Help: help
        };
        const newNumAnswers = numAnswers;

        let newId: string = question.ID!;

        if (question.ID) {
            // Updating existing question
            AdjustAnswersLength(newQuestion.DefaultDetails.Answers, newNumAnswers);

            const versions = await GetAllVersions(surveyId, question.ID);
            if(versions) {
                for (let i = 0; i < versions.length; i++) {
                    const version = versions[i];
                    
                    AdjustAnswersLength(version.Details.Answers, newNumAnswers);

                    await UpdateVersion(surveyId, question.ID, version.ID!, version);
                }
            }

            await UpdateQuestion(surveyId, question.ID, newQuestion);
        } else {
            // Creating new question
            const newAnswers: string[] = [];

            for (let i = 0; i < newNumAnswers; i++) {
                newAnswers.push(`Respuesta ${i + 1}`);
            }

            newQuestion.DefaultDetails.Answers = newAnswers;

            const added = await AddQuestion(surveyId, newQuestion);
            if(added) {
                newId = added.ID!;
            }
        }

        if (buttonClicked === "ToVersions") {
            window.location.href = `/${surveyId}/question/${newId}/version`;
        } else {
            window.location.href = `/${surveyId}/question/${newId}/version/default`;
        }
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const confirmDelete = async () => {
        await DeleteQuestion(surveyId, props.QuestionID!);

        window.location.href = `/${surveyId}/question`;
    };

    return <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
            <Form.Label htmlFor="title">Título interno:</Form.Label>
            <Form.Control
                id="title"
                name="title"
                style={{ width: "40%" }}
                required
                type="text"
                defaultValue={title}
                placeholder="Este titulo solo se muestra en la aplicacion"
                onChange={e => setTitle(e.target.value)}
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label htmlFor="questionType">Tipo de pregunta:</Form.Label>
            <Form.Select
                id="questionType"
                name="questionType"
                style={{ width: "40%" }}
                defaultValue={questionType}
                onChange={e => setQuestionType(e.target.value)}
            >
                <option value="1">Elección Única</option>
                <option value="2">Elección Múltiple</option>
                <option value="3">Texto Libre</option>
                <option value="4">Fecha</option>
                <option value="5">Escala Numérica</option>
            </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label htmlFor="numAnswers">Número de respuestas:</Form.Label>
            <Form.Control
                id="numAnswers"
                name="numAnswers"
                style={{ width: "40%" }}
                required
                type="number"
                defaultValue={numAnswers}
                onChange={e => setNumAnswers(parseInt(e.target.value))}
            />
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Label htmlFor="help">Ayuda:</Form.Label>
            <Form.Control
                id="help"
                name="help"
                as="textarea"
                rows={4}
                style={{resize: "none"}}
                defaultValue={help}
                placeholder="Este mensaje se mostrará al usuario si necesita ayuda para entender la pregunta."
                onChange={(e) => setHelp(e.target.value)}
            />
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