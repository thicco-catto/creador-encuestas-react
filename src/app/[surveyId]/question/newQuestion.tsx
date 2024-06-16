import { CheckUserLoggedIn } from "../../../components/checkUser";
import { PageTemplate } from "../../../components/editPageTemplate";
import { QuestionForm } from "../../../components/forms/questionForm";
import { EditSurveyPageLayout } from "../../../components/pageLayout";
import { Question, QuestionType } from "../../../models/Question";


function NewQuestion() {
    const question: Question = {
        InternalTitle: "",
        QuestionType: QuestionType.SINGLE_CHOICE,
        HasVersions: false,
        DefaultDetails: {
            Title: "Pregunta",
            Answers: [
              "Pregunta 1",
              "Pregunta 2",
              "Pregunta 3"
            ],
            First: "",
            Last: ""
        }
    } 

    return <CheckUserLoggedIn>
        <EditSurveyPageLayout>
            <PageTemplate Title="Nueva Pregunta">
                <QuestionForm Question={question}></QuestionForm>
            </PageTemplate>
        </EditSurveyPageLayout>
    </CheckUserLoggedIn>;
}

export default NewQuestion;