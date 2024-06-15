import { useEffect, useState } from "react";
import { QuestionForm } from "../../../../components/forms/questionForm";
import { EditPageTemplate } from "../../../../components/editPageTemplate";
import { PageLayout } from "../../../../components/pageLayout";
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
        <PageLayout QuestionId={questionId}>
            <EditPageTemplate Title="Información Pregunta">
                <QuestionForm Question={question}></QuestionForm>
            </EditPageTemplate>
        </PageLayout>
    </CheckUserLoggedIn>;
}

export default EditQuestion;