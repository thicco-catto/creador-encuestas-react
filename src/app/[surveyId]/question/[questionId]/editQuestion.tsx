import { useEffect, useState } from "react";
import { QuestionForm } from "../../../../components/forms/questionForm";
import { PageTemplate } from "../../../../components/editPageTemplate";
import { EditSurveyPageLayout } from "../../../../components/pageLayout";
import { Question } from "../../../../models/Question";
import { GetVariable, StorageVariable } from "../../../../utils/localStorage";
import { useParams } from "react-router-dom";
import { CheckUserLoggedIn } from "../../../../components/checkUser";


function EditQuestion() {
    const params = useParams();
    const questionId = params.questionId!;

    const [question, setQuestion] = useState<Question | null>(null);

    useEffect(() => {
        const questionsData = GetVariable(StorageVariable.QUESTIONS);

        if(questionsData) {
            const question = questionsData.find(x => x.ID === questionId);
            setQuestion(question ?? null);
        }
    }, [questionId]);

    if(!question) {
        return <></>;
    }

    return <CheckUserLoggedIn>
        <EditSurveyPageLayout QuestionId={questionId}>
            <PageTemplate Title="Información Pregunta">
                <QuestionForm Question={question}></QuestionForm>
            </PageTemplate>
        </EditSurveyPageLayout>
    </CheckUserLoggedIn>;
}

export default EditQuestion;