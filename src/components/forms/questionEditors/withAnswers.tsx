import { useParams } from "react-router-dom";
import { Question } from "../../../models/Question";
import { QuestionDetails } from "../../../models/QuestionDetails";
import { QuestionVersion } from "../../../models/QuestionVersion";
import { UpdateQuestion } from "../../../repositories/questionRepo";
import { UpdateVersion } from "../../../repositories/versionRepo";
import { ChangeEvent, useState } from "react";
import { Alert, Button, ButtonGroup, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { ArrowDown, ArrowUp, Plus, Trash } from "react-bootstrap-icons";
import { GetVariable, StorageVariable } from "../../../utils/localStorage";

type FormControlElement = HTMLInputElement | HTMLTextAreaElement;

interface QuestionEditorWithAnswersProps {
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

export function QuestionEditorWithAnswers(props: QuestionEditorWithAnswersProps) {
    const params = useParams();
    const surveyId = params.surveyId!;

    const defaultDetails: QuestionDetails | undefined = props.DefaultQuestionDetails;
    const questionDetails: QuestionDetails = props.QuestionDetails;
    const question = props.Question;
    const version = props.Version;

    const [defaultAnswers, setDefaultAnswers] = useState(defaultDetails?.Answers ?? []);

    const [baseTitle, setBaseTitle] = useState(questionDetails.Title);
    const [baseAnswers, setBaseAnswers] = useState(questionDetails.Answers);

    const [title, setTitle] = useState(questionDetails.Title);
    const [answers, setAnswers] = useState(questionDetails.Answers);

    const [madeChanges, setMadeChanges] = useState(false);
    const [savingState, setSavingState] = useState(SavingChangesState.NONE);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const hasDefault = defaultDetails !== undefined;

    function GetAllVersions() {
        const versionsPerQuestion = GetVariable(StorageVariable.QUESTION_VERSIONS);

        if(!versionsPerQuestion) {
            return [];
        }

        return versionsPerQuestion[question.ID!] ?? []
    }

    function AreAnswersTheSame(a: string[], b: string[]) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;

        for (let i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }

        return true;
    }

    function MadeChanges(newTitle: string, newAnswers: string[]) {
        const sameTitle = baseTitle === newTitle;
        const sameAnswers = AreAnswersTheSame(baseAnswers, newAnswers);
        const isActuallyTheSame = sameTitle && sameAnswers;

        if (isActuallyTheSame && madeChanges) {
            setMadeChanges(false);
        } else if (!isActuallyTheSame && !madeChanges) {
            setSavingState(SavingChangesState.NONE);
            setMadeChanges(true);
        }
    }

    function ChangeTitle(e: ChangeEvent<FormControlElement>) {
        setTitle(e.target.value);

        MadeChanges(e.target.value, answers);
    }

    function ChangeAnswer(e: ChangeEvent<FormControlElement>, index: number) {
        const newAnswers = answers.map((x, i) => {
            if (i === index) {
                return e.target.value;
            } else {
                return x;
            }
        });

        setAnswers(newAnswers);

        MadeChanges(title, newAnswers);
    }

    function FinishSaving() {
        setBaseTitle(title);
        setBaseAnswers([...answers]);
        setMadeChanges(false);
        setSavingState(SavingChangesState.SAVED);
    }

    async function SaveChanges() {
        const newDetails: QuestionDetails = {
            Title: title,
            Answers: answers,
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

    async function AddAnswer() {
        const answerText = `Respuesta ${answers.length + 1}`;

        const newDetails: QuestionDetails = {
            Title: title,
            Answers: [...answers, answerText],
            First: questionDetails.First,
            Last: questionDetails.Last
        };

        setSavingState(SavingChangesState.SAVING);

        if (version) {
            //We're editing a version
            const newQuestion: Question = {
                HasVersions: true,
                InternalTitle: question.InternalTitle,
                QuestionType: question.QuestionType,
                DefaultDetails: {
                    Title: question.DefaultDetails.Title,
                    Answers: [...question.DefaultDetails.Answers, answerText],
                    First: question.DefaultDetails.First,
                    Last: question.DefaultDetails.Last
                }
            };
            setDefaultAnswers(question.DefaultDetails.Answers);
            await UpdateQuestion(surveyId, question.ID!, newQuestion);

            const versions = GetAllVersions();
            if (versions) {
                for (let i = 0; i < versions.length; i++) {
                    const otherVersion = versions[i];

                    if (otherVersion.ID === version.ID) {
                        otherVersion.Details = newDetails;
                    } else {
                        otherVersion.Details.Answers.push(answerText);
                    }

                    await UpdateVersion(surveyId, question.ID!, otherVersion.ID!, otherVersion);
                }
            }
        } else {
            //We're editing the default
            const newQuestion: Question = {
                HasVersions: true,
                InternalTitle: question.InternalTitle,
                QuestionType: question.QuestionType,
                DefaultDetails: newDetails
            };
            await UpdateQuestion(surveyId, question.ID!, newQuestion);

            const versions = GetAllVersions();
            if (versions) {
                for (let i = 0; i < versions.length; i++) {
                    const version = versions[i];
                    version.Details.Answers.push(answerText);

                    await UpdateVersion(surveyId, question.ID!, version.ID!, version);
                }
            }
        }

        setAnswers([...answers, answerText]);

        FinishSaving();
    }

    async function RemoveAnswer(index: number) {
        setSavingState(SavingChangesState.SAVING);
        handleClose();

        const newAnswers = answers.filter((_, i) => i !== index);

        const newDetails: QuestionDetails = {
            Title: title,
            Answers: newAnswers,
            First: questionDetails.First,
            Last: questionDetails.Last
        };

        if (version) {
            const newQuestion: Question = {
                HasVersions: true,
                InternalTitle: question.InternalTitle,
                QuestionType: question.QuestionType,
                DefaultDetails: {
                    Title: question.DefaultDetails.Title,
                    Answers: question.DefaultDetails.Answers.filter((_, i) => i !== index),
                    First: question.DefaultDetails.First,
                    Last: question.DefaultDetails.Last
                }
            };
            setDefaultAnswers(question.DefaultDetails.Answers);
            await UpdateQuestion(surveyId, question.ID!, newQuestion);

            const versions = GetAllVersions();
            if (versions) {
                for (let i = 0; i < versions.length; i++) {
                    const otherVersion = versions[i];

                    if (otherVersion.ID === version.ID) {
                        otherVersion.Details = newDetails;
                    } else {
                        otherVersion.Details.Answers.splice(index);
                    }

                    await UpdateVersion(surveyId, question.ID!, otherVersion.ID!, otherVersion);
                }
            }
        } else {
            const newQuestion: Question = {
                HasVersions: true,
                InternalTitle: question.InternalTitle,
                QuestionType: question.QuestionType,
                DefaultDetails: newDetails
            };
            await UpdateQuestion(surveyId, question.ID!, newQuestion);

            const versions = GetAllVersions();
            if (versions) {
                for (let i = 0; i < versions.length; i++) {
                    const version = versions[i];
                    version.Details.Answers.splice(index, 1);

                    await UpdateVersion(surveyId, question.ID!, version.ID!, version);
                }
            }
        }

        setAnswers(newAnswers);
        FinishSaving();
    }

    async function MoveAnswer(index: number, offset: number) {
        setSavingState(SavingChangesState.SAVING);

        const newIndex = index + offset;

        const newAnswers = answers.map((x, i) => {
            if (i === newIndex) {
                return answers[index];
            } else if(i === index) {
                return answers[newIndex];
            } else {
                return x;
            }
        });

        const newDetails: QuestionDetails = {
            Title: title,
            Answers: newAnswers,
            First: questionDetails.First,
            Last: questionDetails.Last
        };

        if (version) {
            const newDefaultAnswers = question.DefaultDetails.Answers;
            [newDefaultAnswers[index], newDefaultAnswers[newIndex]] = [newDefaultAnswers[newIndex], newDefaultAnswers[index]];
            
            const newQuestion: Question = {
                HasVersions: true,
                InternalTitle: question.InternalTitle,
                QuestionType: question.QuestionType,
                DefaultDetails: {
                    Title: question.DefaultDetails.Title,
                    Answers: newDefaultAnswers,
                    First: question.DefaultDetails.First,
                    Last: question.DefaultDetails.Last
                }
            };
            setDefaultAnswers(newDefaultAnswers);
            await UpdateQuestion(surveyId, question.ID!, newQuestion);

            const versions = GetAllVersions();
            if (versions) {
                for (let i = 0; i < versions.length; i++) {
                    const otherVersion = versions[i];

                    if (otherVersion.ID === version.ID) {
                        otherVersion.Details = newDetails;
                    } else {
                        const versionAnswers = version.Details.Answers;
                        [versionAnswers[index], versionAnswers[newIndex]] = [versionAnswers[newIndex], versionAnswers[index]];
                    }

                    await UpdateVersion(surveyId, question.ID!, otherVersion.ID!, otherVersion);
                }
            }
        } else {
            const newQuestion: Question = {
                HasVersions: true,
                InternalTitle: question.InternalTitle,
                QuestionType: question.QuestionType,
                DefaultDetails: newDetails
            };
            await UpdateQuestion(surveyId, question.ID!, newQuestion);

            const versions = GetAllVersions();
            if (versions) {
                for (let i = 0; i < versions.length; i++) {
                    const version = versions[i];
                    const versionAnswers = version.Details.Answers;
                    [versionAnswers[index], versionAnswers[newIndex]] = [versionAnswers[newIndex], versionAnswers[index]];

                    await UpdateVersion(surveyId, question.ID!, version.ID!, version);
                }
            }
        }

        console.log("NEW", newAnswers);
        setAnswers([...newAnswers]);
        setBaseAnswers([...newAnswers]);
        FinishSaving();
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
                <Form.Label><strong>Respuestas:</strong></Form.Label>
            </Row>
            {
                answers.map((x, i) =>
                    <Form.Group key={`${i}-form-group`}>
                        {
                            hasDefault ?
                                <Row key={`${i}-label-row`}><Form.Label key={`${i}-label`}>{defaultAnswers[i]}</Form.Label><br key={`${i}-br-label`}></br></Row> :
                                <></>
                        }
                        <Row className="mb-3" key={`${i}-input-row`}>
                            <Col md="auto" key={`${i}-button-group-col`}>
                                <ButtonGroup key={`${i}-button-group`}>
                                    <Button onClick={() => MoveAnswer(i, -1)} key={`${i}-button-up`} variant="secondary" className="icon-btn" disabled={savingState === SavingChangesState.SAVING || i === 0}>
                                        <ArrowUp size={20}></ArrowUp>
                                    </Button>

                                    <Button onClick={() => MoveAnswer(i, 1)} key={`${i}-button-down`} variant="secondary" className="icon-btn" disabled={savingState === SavingChangesState.SAVING || i === answers.length-1}>
                                        <ArrowDown size={20}></ArrowDown>
                                    </Button>
                                </ButtonGroup>
                            </Col>
                            <Col key={`${i}-input-col`}>
                                <Form.Control onChange={e => ChangeAnswer(e, i)} key={`${i}-input`} required type="text" defaultValue={x} disabled={savingState === SavingChangesState.SAVING}></Form.Control>
                            </Col>
                            <Col md="auto" key={`${i}-del-btn-col`}>
                                <Button onClick={handleShow} key={`${i}-button`} variant="secondary" className="icon-btn" disabled={savingState === SavingChangesState.SAVING || answers.length <= 1}>
                                    <Trash size={30}></Trash>
                                </Button>

                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>¿Eliminar esta respuesta?</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>Eliminar esta respuesta la eliminará también de todas las versiones. ¿Continuar?</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>
                                            Cancelar
                                        </Button>
                                        <Button variant="danger" onClick={() => RemoveAnswer(i)}>
                                            Eliminar
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </Col>
                        </Row>
                    </Form.Group>
                )
            }

            <Button onClick={AddAnswer} variant="secondary" className="icon-btn" disabled={savingState === SavingChangesState.SAVING}>
                <Plus size={30}></Plus>
            </Button>

            <br></br>

            <div className="my-3" style={{ minHeight: "30px" }}>
                {GetChangesMessage()}
            </div>
            <br></br>

            <Button onClick={SaveChanges} variant="secondary">Guardar cambios</Button>
        </Form>
    </>;
}