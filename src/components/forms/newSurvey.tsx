import { Question, QuestionType } from "../../models/Question";
import { Survey } from "../../models/Survey";
import { AddQuestion } from "../../repositories/questionRepo";
import { AddSurvey } from "../../repositories/surveyRepo";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";


/**
 * Displays the form that shows when creating a new survey.
 * @returns 
 */
export function NewSurveyForm() {
    const [buttonClicked, setButtonClicked] = useState("None");

    async function onSubmit(data: FormData) {
        const newSurvey: Survey = {
            ID: "1",
            Title: data.get("title")!.toString(),
            PublicDescription: data.get("publicDescription")!.toString(),
            PrivateDescription: data.get("privateDescription")!.toString(),
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
            }
        };

        await AddQuestion(addedSurvey.ID, sampleQuestion);

        if(buttonClicked === "Profiles") {
            window.location.href = `/edit/${addedSurvey.ID}/profile`;
        } else {
            window.location.href = `/edit/${addedSurvey.ID}/question`;
        }
    }

    return <Form>
        <Form.Group className="mb-3">
            <Form.Label htmlFor="title">Título de la encuesta:</Form.Label>
            <Form.Control id="title" name="title" style={{width: "40%"}} required type="text" placeholder="Titulo de la encuesta"></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label htmlFor="privateDescription">Descripción privada:</Form.Label>
            <Form.Control required id="privateDescription" name="privateDescription" as="textarea" rows={4} style={{resize: "none"}} placeholder="Esta descripción no se mostrará al encuestado, solo es visible dentro de la aplicación"></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label htmlFor="publicDescription">Descripción publica:</Form.Label>
            <Form.Control required id="publicDescription" name="publicDescription" as="textarea" rows={4} style={{resize: "none"}} placeholder="Esta descripción se mostrará al encuestado antes de comenzar"></Form.Control>
        </Form.Group>

        <Button onClick={() => setButtonClicked("Profiles")} variant="secondary" className="me-3" type="submit">Continuar a Perfiles</Button>
        <Button onClick={() => setButtonClicked("Questions")} variant="secondary" type="submit">Continuar a Preguntas</Button>
    </Form>;
}