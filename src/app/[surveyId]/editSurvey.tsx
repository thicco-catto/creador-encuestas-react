import { GetVariable, StorageVariable } from "../../utils/localStorage";
import { PageTemplate } from "../../components/editPageTemplate";
import { SurveyDetailsForm } from "../../components/forms/surveyDetails";
import { Survey } from "../../models/Survey";
import { Question } from "../../models/Question";
import { useEffect, useState } from "react";
import { CheckUserLoggedIn } from "../../components/checkUser";
import { EditSurveyPageLayout } from "../../components/pageLayout";
import { useParams } from "react-router-dom";

function EditSurvey() {
    const params = useParams();
    const surveyId = params.surveyId!;

    const [survey, setSurvey] = useState<Survey | null>(null);
    const [firstQuestion, setFirstQuestion] = useState<Question | null>(null);

    useEffect(() => {
        const surveyData = GetVariable(StorageVariable.SURVEY_INFO);
        const questionsData = GetVariable(StorageVariable.QUESTIONS);

        if(surveyData && questionsData) {
            setSurvey(surveyData);
            setFirstQuestion(questionsData[0]);
        } else {
            window.location.href = `/${surveyId}/loading`;
        }
    }, [surveyId]);

    if(!survey || !firstQuestion) {
        return <></>;
    }

    return <CheckUserLoggedIn>
        <EditSurveyPageLayout>
            <PageTemplate Title="Información Encuesta">
                <SurveyDetailsForm Survey={survey} FirstQuestionID={firstQuestion.ID!}></SurveyDetailsForm>
            </PageTemplate>
        </EditSurveyPageLayout>
    </CheckUserLoggedIn>;
}

export default EditSurvey;