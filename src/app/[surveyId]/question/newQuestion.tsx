import { EditPageTemplate } from "../../../components/editPageTemplate";
import { QuestionForm } from "../../../components/forms/questionForm";
import { PageLayout } from "../../../components/pageLayout";
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

    return (
        <PageLayout>
            <EditPageTemplate Title="Información Pregunta">
                <QuestionForm Question={question}></QuestionForm>
            </EditPageTemplate>
        </PageLayout>
    );
}

export default NewQuestion;