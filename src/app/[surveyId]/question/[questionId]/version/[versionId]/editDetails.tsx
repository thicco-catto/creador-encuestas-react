import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QuestionVersion } from "../../../../../../models/QuestionVersion";
import { PageTemplate } from "../../../../../../components/editPageTemplate";
import { QuestionEditor } from "../../../../../../components/forms/questionEditor";
import { EditSurveyPageLayout } from "../../../../../../components/pageLayout";
import { Question } from "../../../../../../models/Question";
import { GetVariable, StorageVariable } from "../../../../../../utils/localStorage";
import { CheckUserLoggedIn } from "../../../../../../components/checkUser";



function EditVersionDetails() {
    const params = useParams();
    const surveyId = params.surveyId!;
    const questionId = params.questionId!;
    const versionId = params.versionId!;

    const [question, setQuestion] = useState<Question | null>(null);
    const [version, setVersion] = useState<QuestionVersion | null>(null);

    useEffect(() => {
        const questionsData = GetVariable(StorageVariable.QUESTIONS);
        const versionsData = GetVariable(StorageVariable.QUESTION_VERSIONS);

        if(questionsData && versionsData) {
            const question = questionsData.find(x => x.ID === questionId);
            setQuestion(question ?? null);

            const versions = versionsData[questionId] ?? [];
            const version = versions.find(x => x.ID === versionId);
            setVersion(version ?? null);
        } else {
            window.location.href = `/${surveyId}/loading`;
        }
    }, [questionId, versionId, surveyId]);

    if(!question || !version) {
        return <></>;
    }

    return <CheckUserLoggedIn>
        <EditSurveyPageLayout QuestionId={questionId} AffectedProfiles={version.Profiles}>
            <PageTemplate Title="Editar Respuestas Versión">
                <QuestionEditor
                    Question={question}
                    QuestionDetails={version.Details}
                    Version={version}
                    DefaultQuestionDetails={question.DefaultDetails}
                />
            </PageTemplate>
        </EditSurveyPageLayout>
    </CheckUserLoggedIn>;
}

export default EditVersionDetails;