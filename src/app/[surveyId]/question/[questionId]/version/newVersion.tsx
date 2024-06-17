import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Question } from "../../../../../models/Question";
import { PageTemplate } from "../../../../../components/editPageTemplate";
import { QuestionVersionForm } from "../../../../../components/forms/questionVersion";
import { EditSurveyPageLayout } from "../../../../../components/pageLayout";
import { Profile } from "../../../../../models/Profile";
import { QuestionVersion } from "../../../../../models/QuestionVersion";
import { GetVariable, StorageVariable } from "../../../../../utils/localStorage";
import { CheckUserLoggedIn } from "../../../../../components/checkUser";


function NewVersion() {
    const params = useParams();
    const surveyId = params.surveyId!;
    const questionId = params.questionId!;

    const [question, setQuestion] = useState<Question | null>(null);
    const [profiles, setProfiles] = useState<Profile[] | null>(null);

    useEffect(() => {
        const questionsData = GetVariable(StorageVariable.QUESTIONS);
        const profilesData = GetVariable(StorageVariable.PROFILES);

        if(questionsData && profilesData) {
            setQuestion(questionsData.find(x => x.ID === questionId) ?? null);
            setProfiles(profilesData);
        } else {
            window.location.href = `/${surveyId}/loading`;
        }
    }, [questionId, surveyId]);

    if(!question || !profiles) {
        return <></>;
    }

    const version: QuestionVersion = {
        Title: "",
        Description: "",
        Profiles: [],
        Details: {
            Title: question.DefaultDetails.Title,
            Answers: [...question.DefaultDetails.Answers],
            First: question.DefaultDetails.First,
            Last: question.DefaultDetails.Last
        }
    };

    return <CheckUserLoggedIn>
        <EditSurveyPageLayout QuestionId={questionId}>
            <PageTemplate Title="Nueva Versión">
                <QuestionVersionForm Version={version} Profiles={profiles}></QuestionVersionForm>
            </PageTemplate>
        </EditSurveyPageLayout>
    </CheckUserLoggedIn>;
}

export default NewVersion;