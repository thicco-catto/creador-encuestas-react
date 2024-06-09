import { useParams } from "react-router-dom";
import { Question } from "../../../models/Question";
import { QuestionDetails } from "../../../models/QuestionDetails";
import { QuestionVersion } from "../../../models/QuestionVersion";
import { UpdateQuestion } from "../../../repositories/questionRepo";
import { UpdateVersion } from "../../../repositories/versionRepo";
import { ChangeEvent, useState } from "react";
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";

type FormControlElement = HTMLInputElement | HTMLTextAreaElement;

interface QuestionEditorNoAnswersProps {
    Question: Question,
    Version?: QuestionVersion,
    DefaultQuestionDetails?: QuestionDetails,
    QuestionDetails: QuestionDetails,
}

enum SavingChangesState {
    NONE,
    SAVING,
    SAVED
}

export function QuestionEditorNoAnswers(props: QuestionEditorNoAnswersProps) {
    const params = useParams();
    const surveyId = params.surveyId!;

    const defaultDetails: QuestionDetails | undefined = props.DefaultQuestionDetails;
    const questionDetails: QuestionDetails = props.QuestionDetails;
    const question = props.Question;
    const version = props.Version;

    const [baseTitle, setBaseTitle] = useState(questionDetails.Title);

    const [title, setTitle] = useState(questionDetails.Title);

    const [madeChanges, setMadeChanges] = useState(false);
    const [savingState, setSavingState] = useState(SavingChangesState.NONE);

    const hasDefault = defaultDetails !== undefined;

    function MadeChanges(newTitle: string) {
        const sameTitle = baseTitle === newTitle;
        const isActuallyTheSame = sameTitle;

        if (isActuallyTheSame && madeChanges) {
            setMadeChanges(false);
        } else if (!isActuallyTheSame && !madeChanges) {
            setSavingState(SavingChangesState.NONE);
            setMadeChanges(true);
        }
    }

    function ChangeTitle(e: ChangeEvent<FormControlElement>) {
        setTitle(e.target.value);

        MadeChanges(e.target.value);
    }

    function FinishSaving() {
        setBaseTitle(title);
        setMadeChanges(false);
        setSavingState(SavingChangesState.SAVED);
    }

    async function SaveChanges() {
        const newDetails: QuestionDetails = {
            Title: title,
            Answers: questionDetails.Answers,
            First: questionDetails.First,
            Last: questionDetails.Last
        };

        setSavingState(SavingChangesState.SAVING);

        if (version) {
            version.Details = newDetails;
            await UpdateVersion(surveyId, question.ID!, version.ID!, version);
        } else {
            question.DefaultDetails = newDetails;
            await UpdateQuestion(surveyId, question.ID!, question);
        }

        FinishSaving();
    }

    function GetChangesMessage() {
        if (savingState === SavingChangesState.SAVING) {
            return <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>;
        } else if (savingState === SavingChangesState.SAVED) {
            return <Alert className="m-0" variant="success">
                ¡Cambios guardados con éxito!
            </Alert>;
        } else if (madeChanges) {
            return <Alert variant="danger">
                ¡Hay cambios sin guardar!
            </Alert>;
        }

        return <></>;
    }

    return <>
        <Form>
            <Row>
                <Form.Label htmlFor="title-input"><strong>Pregunta:</strong></Form.Label>
            </Row>
            {
                hasDefault ?
                    <Row><label>{defaultDetails?.Title}</label><br></br></Row> :
                    <></>
            }
            <Row className="mb-3">
                <Col>
                    <Form.Control id="title-input" onChange={ChangeTitle} required spellCheck="false" type="text" defaultValue={title} disabled={savingState === SavingChangesState.SAVING}></Form.Control>
                </Col>
            </Row>

            <br></br>

            <div className="my-3" style={{ minHeight: "30px" }}>
                {GetChangesMessage()}
            </div>
            <br></br>

            <Button onClick={SaveChanges} variant="secondary">Guardar cambios</Button>
        </Form>
    </>;
}