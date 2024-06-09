import { useEffect, useState } from "react";
import { GetVariable, StorageVariable } from "../../../utils/localStorage";
import { EditPageTemplate } from "../../../components/editPageTemplate";
import { PageLayout } from "../../../components/pageLayout";
import { QuestionList } from "../../../components/lists/questionList";
import { Question } from "../../../models/Question";

function QuestionListPage() {
    const [questions, setQuestions] = useState<Question[] | null>(null);
    const [questionOrder, setQuestionOrder] = useState<string[] | null>(null);

    useEffect(() => {
        const surveyData = GetVariable(StorageVariable.SURVEY_INFO);
        const questionsData = GetVariable(StorageVariable.QUESTIONS);

        if(surveyData && questionsData) {
            setQuestionOrder(surveyData.QuestionOrder);
            setQuestions(questionsData)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(questionOrder)]);

    if(!questions || !questionOrder) {
        return <></>;
    }

    return (
        <PageLayout>
            <EditPageTemplate Title="Lista de Preguntas">
                <QuestionList Questions={questions} QuestionOrder={questionOrder}></QuestionList>
            </EditPageTemplate>
        </PageLayout>
    );
}

export default QuestionListPage;