import { Profile } from "../../models/Profile";
import { GetQuestionTypeName, Question, QuestionType } from "../../models/Question";
import { QuestionDetails } from "../../models/QuestionDetails";
import { QuestionVersion } from "../../models/QuestionVersion";
import { QuestionEditorNoAnswers } from "./questionEditors/noAnswers";
import { QuestionEditorWithAnswers } from "./questionEditors/withAnswers";
import { Button } from "react-bootstrap";
import { QuestionEditorFirstAndLast } from "./questionEditors/firstAndLast";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetVariable, StorageVariable } from "../../utils/localStorage";

interface QuestionAndVersionInfoProps {
    Question: Question,
    Version?: QuestionVersion,
}

function QuestionAndVersionInfo(props: QuestionAndVersionInfoProps) {
    const params = useParams();
    const surveyId = params.surveyId!;

    const question = props.Question;
    const version = props.Version;

    const [profiles, setProfiles] = useState<Profile[] | null>();

    useEffect(() => {
        const profilesData = GetVariable(StorageVariable.PROFILES);

        if(profilesData) {
            setProfiles(profilesData);
        }
    }, []);

    if(!profiles) {
        return <></>;
    }

    return <>
        <div className="survey-list-element mb-4">
                <h2>{question.InternalTitle}</h2>
                <p><strong>Tipo:</strong> Pregunta de {GetQuestionTypeName(question.QuestionType)}</p>

                <a href={`/${surveyId}/question/${question.ID}`} className="me-2"><Button variant="secondary">Información</Button></a>
                <a href={`/${surveyId}/question/${question.ID}/version`}><Button variant="secondary">Versiones</Button></a>
            </div>

            {version ?
                <div className="survey-list-element mb-4">
                    <h2>{version.Title}</h2>
                    <p><strong>Descripción:</strong> {version.Description}</p>
                    <p><strong>Perfiles:</strong> {version.Profiles.map(id => profiles.find(p => p.ID === id)?.Title).join()}</p>

                    <a href={`/${surveyId}/question/${props.Question.ID}/version/${version.ID}`} className="me-2"><Button variant="secondary">Información</Button></a>
                </div> :
                <></>
            }
    </>;
}


interface QuestionEditorProps {
    Question: Question,
    Version?: QuestionVersion,
    DefaultQuestionDetails?: QuestionDetails,
    QuestionDetails: QuestionDetails
}

/**
 * Displays the editor for editing a question's answers. If `Version` and
 * `DefaultQuestionDetails` are supplied it will show options related to
 * editing a question version's answers.
 * 
 * Will change dinamically depending on the question type.
 * @param props 
 * @returns 
 */
export function QuestionEditor(props: QuestionEditorProps) {
    const question = props.Question;
    const questionType = question.QuestionType;

    function GetCorrespondingQuestionEditor() {
        if (questionType === QuestionType.SINGLE_CHOICE
            || questionType === QuestionType.MULTIPLE_CHOICE) {
            return <QuestionEditorWithAnswers
                Question={props.Question}
                QuestionDetails={props.QuestionDetails}
                DefaultQuestionDetails={props.DefaultQuestionDetails}
                Version={props.Version}
            />;
        } else if (questionType === QuestionType.DATE
            || questionType === QuestionType.FREE_TEXT) {
            return <QuestionEditorNoAnswers
                Question={props.Question}
                QuestionDetails={props.QuestionDetails}
                DefaultQuestionDetails={props.DefaultQuestionDetails}
                Version={props.Version}
            />;
        } else if(questionType === QuestionType.RANGE) {
            return <QuestionEditorFirstAndLast
                Question={props.Question}
                QuestionDetails={props.QuestionDetails}
                DefaultQuestionDetails={props.DefaultQuestionDetails}
                Version={props.Version}
            />;
        }

        return <></>
    }

    return <>
        <QuestionAndVersionInfo
            Question={props.Question}
            Version={props.Version}
        />

        {GetCorrespondingQuestionEditor()}
    </>;
}