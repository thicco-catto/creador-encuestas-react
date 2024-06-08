import { Profile } from "../../models/Profile";
import { GetQuestionTypeName, Question, QuestionType } from "../../models/Question";
import { QuestionDetails } from "../../models/QuestionDetails";
import { QuestionVersion } from "../../models/QuestionVersion";
import { QuestionEditorNoAnswers } from "./questionEditors/noAnswers";
import { QuestionEditorWithAnswers } from "./questionEditors/withAnswers";
import { Button } from "react-bootstrap";
import { QuestionEditorFirstAndLast } from "./questionEditors/firstAndLast";

interface QuestionAndVersionInfoProps {
    Question: Question,
    SurveyId: string,
    Version?: QuestionVersion,
    Profiles: Profile[]
}

function QuestionAndVersionInfo(props: QuestionAndVersionInfoProps) {
    const question = props.Question;
    const version = props.Version;

    return <>
        <div className="survey-list-element mb-4">
                <h2>{question.InternalTitle}</h2>
                <p><strong>Tipo:</strong> Pregunta de {GetQuestionTypeName(question.QuestionType)}</p>

                <a href={`/edit/${props.SurveyId}/question/${question.ID}`} className="me-2"><Button variant="secondary">Información</Button></a>
                <a href={`/edit/${props.SurveyId}/question/${question.ID}/version`}><Button variant="secondary">Versiones</Button></a>
            </div>

            {version ?
                <div className="survey-list-element mb-4">
                    <h2>{version.Title}</h2>
                    <p><strong>Descripción:</strong> {version.Description}</p>
                    <p><strong>Perfiles:</strong> {version.Profiles.map(id => props.Profiles.find(p => p.ID === id)?.Title).join()}</p>

                    <a href={`/edit/${props.SurveyId}/question/${props.Question.ID}/version/${version.ID}`} className="me-2"><Button variant="secondary">Información</Button></a>
                </div> :
                <></>
            }
    </>;
}


interface QuestionEditorProps {
    SurveyId: string,
    Question: Question,
    Version?: QuestionVersion,
    DefaultQuestionDetails?: QuestionDetails,
    QuestionDetails: QuestionDetails,
    Profiles: Profile[]
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

    if (questionType === QuestionType.SINGLE_CHOICE
        || questionType === QuestionType.MULTIPLE_CHOICE) {
        return <>
            <QuestionAndVersionInfo Question={props.Question} Version={props.Version} Profiles={props.Profiles} SurveyId={props.SurveyId}></QuestionAndVersionInfo>

            <QuestionEditorWithAnswers Question={props.Question} Profiles={props.Profiles} QuestionDetails={props.QuestionDetails} SurveyId={props.SurveyId} DefaultQuestionDetails={props.DefaultQuestionDetails} Version={props.Version}></QuestionEditorWithAnswers>
        </>;
    } else if (questionType === QuestionType.DATE
        || questionType === QuestionType.FREE_TEXT) {
        return <>
            <QuestionAndVersionInfo Question={props.Question} Version={props.Version} Profiles={props.Profiles} SurveyId={props.SurveyId}></QuestionAndVersionInfo>

            <QuestionEditorNoAnswers Question={props.Question} Profiles={props.Profiles} QuestionDetails={props.QuestionDetails} SurveyId={props.SurveyId} DefaultQuestionDetails={props.DefaultQuestionDetails} Version={props.Version}></QuestionEditorNoAnswers>
        </>;
    } else if(questionType === QuestionType.RANGE) {
        return <>
            <QuestionAndVersionInfo Question={props.Question} Version={props.Version} Profiles={props.Profiles} SurveyId={props.SurveyId}></QuestionAndVersionInfo>

            <QuestionEditorFirstAndLast Question={props.Question} QuestionDetails={props.QuestionDetails} SurveyId={props.SurveyId} DefaultQuestionDetails={props.DefaultQuestionDetails} Version={props.Version}></QuestionEditorFirstAndLast>
        </>;
    }

    return <></>;
}