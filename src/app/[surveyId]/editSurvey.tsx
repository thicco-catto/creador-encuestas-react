import { useParams } from "react-router-dom";
import { GetVariable, StorageVariable } from "../../utils/localStorage";
import { EditPageTemplate } from "../../components/editPageTemplate";
import { SurveyDetailsForm } from "../../components/forms/surveyDetails";
import { PageLayout } from "../../components/pageLayout";
import { Survey } from "../../models/Survey";
import { Question } from "../../models/Question";
import { Profile } from "../../models/Profile";
import { useEffect, useState } from "react";

function EditSurvey() {
    const params = useParams();
    const surveyId = params.surveyId!;

    const [survey, setSurvey] = useState<Survey | null>(null);
    const [questions, setQuestions] = useState<Question[] | null>(null);
    const [profiles, setProfiles] = useState<Profile[] | null>(null);

    useEffect(() => {
        const surveyData = GetVariable(StorageVariable.SURVEY_INFO);
        const questionsData = GetVariable(StorageVariable.QUESTIONS);
        const profilesData = GetVariable(StorageVariable.PROFILES);

        if(!survey || !questions || !profiles || survey.ID !== surveyId) {
            window.location.href = `/${surveyId}/loading`;
        } else {
            setSurvey(surveyData);
            setQuestions(questionsData);
            setProfiles(profilesData);
        }
    }, [survey, questions, profiles, surveyId]);

    if(!survey || !questions || !profiles) {
        return <></>;
    }

    return (
        <PageLayout Survey={survey} Questions={questions} Profiles={profiles}>
            <EditPageTemplate Title="Información Encuesta">
                <SurveyDetailsForm Survey={survey} FirstQuestionID={questions[0].ID!}></SurveyDetailsForm>
            </EditPageTemplate>
        </PageLayout>
    );
}

export default EditSurvey;