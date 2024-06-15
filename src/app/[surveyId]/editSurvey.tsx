import { GetVariable, StorageVariable } from "../../utils/localStorage";
import { EditPageTemplate } from "../../components/editPageTemplate";
import { SurveyDetailsForm } from "../../components/forms/surveyDetails";
import { Survey } from "../../models/Survey";
import { Question } from "../../models/Question";
import { useEffect, useState } from "react";
import { CheckUserLoggedIn } from "../../components/checkUser";
import { PageLayout } from "../../components/pageLayout";

function EditSurvey() {
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [firstQuestion, setFirstQuestion] = useState<Question | null>(null);

    useEffect(() => {
        const surveyData = GetVariable(StorageVariable.SURVEY_INFO);
        const questionsData = GetVariable(StorageVariable.QUESTIONS);

        if(surveyData && questionsData) {
            setSurvey(surveyData);
            setFirstQuestion(questionsData[0]);
        }
    }, []);

    if(!survey || !firstQuestion) {
        return <></>;
    }

    return <CheckUserLoggedIn>
        <PageLayout>
            <EditPageTemplate Title="Información Encuesta">
                <SurveyDetailsForm Survey={survey} FirstQuestionID={firstQuestion.ID!}></SurveyDetailsForm>
            </EditPageTemplate>
        </PageLayout>
    </CheckUserLoggedIn>;
}

export default EditSurvey;