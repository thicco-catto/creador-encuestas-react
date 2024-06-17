import { useEffect, useState } from "react";
import { GetVariable, StorageVariable } from "../../../utils/localStorage";
import { PageTemplate } from "../../../components/editPageTemplate";
import { EditSurveyPageLayout } from "../../../components/pageLayout";
import { QuestionList } from "../../../components/lists/questionList";
import { Question } from "../../../models/Question";
import { CheckUserLoggedIn } from "../../../components/checkUser";
import { useParams } from "react-router-dom";

function QuestionListPage() {
    const params = useParams();
    const surveyId = params.surveyId!;

    const [questions, setQuestions] = useState<Question[] | null>(null);
    const [questionOrder, setQuestionOrder] = useState<string[] | null>(null);

    useEffect(() => {
        const surveyData = GetVariable(StorageVariable.SURVEY_INFO);
        const questionsData = GetVariable(StorageVariable.QUESTIONS);

        if(surveyData && questionsData) {
            setQuestionOrder(surveyData.QuestionOrder);
            setQuestions(questionsData)
        } else {
            window.location.href = `/${surveyId}/loading`;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(questionOrder), surveyId]);

    if(!questions || !questionOrder) {
        return <></>;
    }

    return <CheckUserLoggedIn>
        <EditSurveyPageLayout>
            <PageTemplate Title="Lista de Preguntas">
                <QuestionList Questions={questions} QuestionOrder={questionOrder}></QuestionList>
            </PageTemplate>
        </EditSurveyPageLayout>
    </CheckUserLoggedIn>;
}

export default QuestionListPage;