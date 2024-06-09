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
    QuestionDetails: QuestionDetails
}

enum SavingChangesState {
    NONE,
    SAVING,
    SAVED
}

export function QuestionEditorFirstAndLast(props: QuestionEditorNoAnswersProps) {
    const params = useParams();
    const surveyId = params.surveyId!;

    const defaultDetails: QuestionDetails | undefined = props.DefaultQuestionDetails;
    const questionDetails: QuestionDetails = props.QuestionDetails;
    const question = props.Question;
    const version = props.Version;

    const [baseTitle, setBaseTitle] = useState(questionDetails.Title);
    const [baseFirst, setBaseFirst] = useState(questionDetails.Title);
    const [baseLast, setBaseLast] = useState(questionDetails.Title);

    const [title, setTitle] = useState(questionDetails.Title);
    const [first, setFirst] = useState(questionDetails.First);
    const [last, setLast] = useState(questionDetails.Last);

    const [madeChanges, setMadeChanges] = useState(false);
    const [savingState, setSavingState] = useState(SavingChangesState.NONE);

    const hasDefault = defaultDetails !== undefined;

    function MadeChanges(newTitle: string, newFirst: string, newLast: string) {
        const sameTitle = baseTitle === newTitle;
        const sameFirst = baseFirst === newFirst;
        const sameLast = baseLast === newLast;
        const isActuallyTheSame = sameTitle && sameFirst && sameLast;

        if (isActuallyTheSame && madeChanges) {
            setMadeChanges(false);
        } else if (!isActuallyTheSame && !madeChanges) {
            setSavingState(SavingChangesState.NONE);
            setMadeChanges(true);
        }
    }

    function ChangeTitle(e: ChangeEvent<FormControlElement>) {
        setTitle(e.target.value);

        MadeChanges(e.target.value, first, last);
    }

    function ChangeFirst(e: ChangeEvent<FormControlElement>) {
        setFirst(e.target.value);

        MadeChanges(title, e.target.value, last);
    }

    function ChangeLast(e: ChangeEvent<FormControlElement>) {
        setLast(e.target.value);

        MadeChanges(first, last, e.target.value);
    }

    function FinishSaving() {
        setBaseTitle(title);
        setBaseFirst(first);
        setBaseLast(last);
        setMadeChanges(false);
        setSavingState(SavingChangesState.SAVED);
    }

    async function SaveChanges() {
        const newDetails: QuestionDetails = {
            Title: title,
            Answers: questionDetails.Answers,
            First: first,
            Last: last
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

            <Row>
                <Form.Label htmlFor="first-input"><strong>Mínimo:</strong></Form.Label>
            </Row>

            {
                hasDefault ?
                    <Row><label>{defaultDetails?.First}</label><br></br></Row> :
                    <></>
            }
            <Row className="mb-3">
                <Col>
                    <Form.Control id="first-input" onChange={ChangeFirst} required spellCheck="false" type="text" defaultValue={first} disabled={savingState === SavingChangesState.SAVING}></Form.Control>
                </Col>
            </Row>

            <Row>
                <Form.Label htmlFor="last-input"><strong>Máximo:</strong></Form.Label>
            </Row>
            {
                hasDefault ?
                    <Row><Form.Label>{defaultDetails?.Last}</Form.Label><br></br></Row> :
                    <></>
            }
            <Row className="mb-3">
                <Col>
                    <Form.Control id="last-input" onChange={ChangeLast} required spellCheck="false" type="text" defaultValue={last} disabled={savingState === SavingChangesState.SAVING}></Form.Control>
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