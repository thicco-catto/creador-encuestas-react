import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QuestionVersion } from "../../../../../../models/QuestionVersion";
import { EditPageTemplate } from "../../../../../../components/editPageTemplate";
import { QuestionEditor } from "../../../../../../components/forms/questionEditor";
import { PageLayout } from "../../../../../../components/pageLayout";
import { Question } from "../../../../../../models/Question";
import { GetVariable, StorageVariable } from "../../../../../../utils/localStorage";
import { CheckUserLoggedIn } from "../../../../../../components/checkUser";



function EditVersionDetails() {
    const params = useParams();
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
        }
    }, [questionId, versionId]);

    if(!question || !version) {
        return <></>;
    }

    return <CheckUserLoggedIn>
        <PageLayout QuestionId={questionId} AffectedProfiles={version.Profiles}>
            <EditPageTemplate Title="Editar Respuestas Versión">
                <QuestionEditor
                    Question={question}
                    QuestionDetails={version.Details}
                    Version={version}
                    DefaultQuestionDetails={question.DefaultDetails}
                />
            </EditPageTemplate>
        </PageLayout>
    </CheckUserLoggedIn>;
}

export default EditVersionDetails;