import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QuestionEditor } from "../../../../../components/forms/questionEditor";
import { PageTemplate } from "../../../../../components/editPageTemplate";
import { EditSurveyPageLayout } from "../../../../../components/pageLayout";
import { Question } from "../../../../../models/Question";
import { GetVariable, StorageVariable } from "../../../../../utils/localStorage";
import { Profile } from "../../../../../models/Profile";
import { CheckUserLoggedIn } from "../../../../../components/checkUser";


function EditDefaultDetails() {
    const params = useParams();
    const surveyId = params.surveyId!;
    const questionId = params.questionId!;

    const [question, setQuestion] = useState<Question | null>(null);
    const [profiles, setProfiles] = useState<Profile[] | null>(null);

    useEffect(() => {
        const questionsData = GetVariable(StorageVariable.QUESTIONS);
        const profilesData = GetVariable(StorageVariable.PROFILES);

        if(questionsData && profilesData) {
            const question = questionsData.find(x => x.ID === questionId);
            setQuestion(question ?? null);

            setProfiles(profilesData);
        } else {
            window.location.href = `/${surveyId}/loading`;
        }
    }, [questionId, surveyId]);

    if(!question || !profiles) {
        return <></>;
    }

    return <CheckUserLoggedIn>
        <EditSurveyPageLayout QuestionId={questionId}>
            <PageTemplate Title="Editar Respuestas">
                <QuestionEditor
                    Question={question}
                    QuestionDetails={question.DefaultDetails}
                />
            </PageTemplate>
        </EditSurveyPageLayout>
    </CheckUserLoggedIn>;
}

export default EditDefaultDetails;