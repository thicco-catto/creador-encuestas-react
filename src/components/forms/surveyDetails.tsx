import { Survey } from "../../models/Survey";
import { UpdateSurvey } from "../../repositories/surveyRepo";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Floppy2 } from "react-bootstrap-icons";

interface SurveyDetailsFormProps {
    Survey: Survey,
    FirstQuestionID: string
}

/**
 * Displays the form that shows when editing a survey's details.
 * @param props 
 * @returns 
 */
export function SurveyDetailsForm(props: SurveyDetailsFormProps) {
    const survey: Survey = props.Survey;

    const [buttonClicked, setButtonClicked] = useState("None");

    async function onSubmit(data: FormData) {
        const newSurvey: Survey = {
            ID: survey.ID,
            Title: data.get("title")!.toString(),
            PublicDescription: data.get("publicDescription")!.toString(),
            PrivateDescription: data.get("privateDescription")!.toString(),
            QuestionOrder: survey.QuestionOrder
        };

        await UpdateSurvey(survey.ID, newSurvey);

        if(buttonClicked === "Questions") {
            window.location.href = `/edit/${survey.ID}/question/${props.FirstQuestionID}`;
        } else {
            window.location.href = `/edit/${survey.ID}/profile`;
        }
    }

    return <Form>
        <Form.Group className="mb-3">
            <Form.Label htmlFor="title">Título de la encuesta:</Form.Label>
            <Form.Control id="title" name="title" style={{width: "40%"}} required type="text" defaultValue={survey.Title} placeholder="Titulo de la encuesta"></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label htmlFor="privateDescription">Descripción privada:</Form.Label>
            <Form.Control id="privateDescription" name="privateDescription" as="textarea" rows={4} style={{resize: "none"}} defaultValue={survey.PrivateDescription} placeholder="Esta descripción no se mostrará al encuestado, solo es visible dentro de la aplicación"></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label htmlFor="publicDescription">Descripción publica:</Form.Label>
            <Form.Control id="publicDescription" name="publicDescription" as="textarea" rows={4} style={{resize: "none"}} defaultValue={survey.PublicDescription} placeholder="Esta descripción se mostrará al encuestado antes de comenzar"></Form.Control>
        </Form.Group>

        <Button onClick={() => setButtonClicked("Profiles")} variant="secondary" className="me-3" type="submit">
            <Floppy2></Floppy2> Continuar a Perfiles
        </Button>
        <Button onClick={() => setButtonClicked("Questions")} variant="secondary" type="submit">
            <Floppy2></Floppy2> Continuar a Preguntas
        </Button>
    </Form>;
}