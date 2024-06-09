import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QuestionEditor } from "../../../../../components/forms/questionEditor";
import { EditPageTemplate } from "../../../../../components/editPageTemplate";
import { PageLayout } from "../../../../../components/pageLayout";
import { Question } from "../../../../../models/Question";
import { GetVariable, StorageVariable } from "../../../../../utils/localStorage";
import { Profile } from "../../../../../models/Profile";


function EditDefaultDetails() {
    const params = useParams();
    const questionId = params.questionId!;

    const [question, setQuestion] = useState<Question | null>(null);
    const [profiles, setProfiles] = useState<Profile[] | null>(null);

    useEffect(() => {
        const questionsData = GetVariable(StorageVariable.QUESTIONS);
        const profilesData = GetVariable(StorageVariable.PROFILES);

        if(questionsData && profilesData) {
            const question = questionsData.find(x => x.ID === questionId);
            setQuestion(question ?? null);

            setProfiles(profilesData);
        }
    }, [questionId]);

    if(!question || !profiles) {
        return <></>;
    }

    return (
        <PageLayout QuestionId={questionId}>
            <EditPageTemplate Title="Información Pregunta">
                <QuestionEditor
                    Question={question}
                    QuestionDetails={question.DefaultDetails}
                />
            </EditPageTemplate>
        </PageLayout>
    );
}

export default EditDefaultDetails;