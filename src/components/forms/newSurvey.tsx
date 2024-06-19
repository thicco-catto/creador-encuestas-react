import { Question, QuestionType } from "../../models/Question";
import { Survey } from "../../models/Survey";
import { AddQuestion } from "../../repositories/questionRepo";
import { AddSurvey } from "../../repositories/surveyRepo";
import { FormEvent, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { RemoveVariable, SetVariable, StorageVariable } from "../../utils/localStorage";


/**
 * Displays the form that shows when creating a new survey.
 * @returns 
 */
export function NewSurveyForm() {
    const [buttonClicked, setButtonClicked] = useState("None");

    const [title, setTitle] = useState("");
    const [publicDesc, setPublicDesc] = useState("");
    const [privateDesc, setPrivateDesc] = useState("");

    async function onSubmit(e: FormEvent) {
        e.preventDefault();

        const newSurvey: Survey = {
            ID: "1",
            Title: title,
            PublicDescription: publicDesc,
            PrivateDescription: privateDesc,
            QuestionOrder: []
        };

        const addedSurvey: Survey = await AddSurvey(newSurvey);

        const sampleQuestion: Question = {
            HasVersions: false,
            InternalTitle: "Pregunta 1",
            QuestionType: QuestionType.SINGLE_CHOICE,
            DefaultDetails: {
                Title: "¿Cuál es su género?",
                Answers: [
                    "Hombre",
                    "Mujer",
                    "Otro"
                ],
                First: "",
                Last: ""
            },
            Help: ""
        };

        const addedQuestion = await AddQuestion(addedSurvey.ID, sampleQuestion);

        RemoveVariable(StorageVariable.SURVEY_INFO);
        RemoveVariable(StorageVariable.QUESTIONS);
        RemoveVariable(StorageVariable.PROFILES);
        RemoveVariable(StorageVariable.QUESTION_VERSIONS);

        addedSurvey.QuestionOrder = [addedQuestion?.ID!]
        SetVariable(StorageVariable.SURVEY_INFO, addedSurvey);
        SetVariable(StorageVariable.PROFILES, []);
        if(addedQuestion) {
            SetVariable(StorageVariable.QUESTIONS, [addedQuestion])
            SetVariable(StorageVariable.QUESTION_VERSIONS, {
                [addedQuestion.ID!]: []
            });
        }

        if(buttonClicked === "Profiles") {
            window.location.href = `/${addedSurvey.ID}/profile`;
        } else {
            window.location.href = `/${addedSurvey.ID}/question`;
        }
    }

    return <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
            <Form.Label htmlFor="title">Título de la encuesta:</Form.Label>
            <Form.Control
                id="title"
                name="title"
                style={{width: "40%"}}
                required
                type="text"
                placeholder="Titulo de la encuesta"
                onChange={e => setTitle(e.target.value)}
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label htmlFor="privateDescription">Descripción privada:</Form.Label>
            <Form.Control
                required
                id="privateDescription"
                name="privateDescription"
                as="textarea"
                rows={4}
                style={{resize: "none"}}
                placeholder="Esta descripción no se mostrará al encuestado, solo es visible dentro de la aplicación"
                onChange={e => setPrivateDesc(e.target.value)}
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label htmlFor="publicDescription">Descripción publica:</Form.Label>
            <Form.Control
                required
                id="publicDescription"
                name="publicDescription"
                as="textarea"
                rows={4}
                style={{resize: "none"}}
                placeholder="Esta descripción se mostrará al encuestado antes de comenzar"
                onChange={e => setPublicDesc(e.target.value)}
            />
        </Form.Group>

        <Button onClick={() => setButtonClicked("Profiles")} variant="secondary" className="me-3" type="submit">Continuar a Perfiles</Button>
        <Button onClick={() => setButtonClicked("Questions")} variant="secondary" type="submit">Continuar a Preguntas</Button>
    </Form>;
}