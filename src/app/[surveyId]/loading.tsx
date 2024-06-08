import { useParams } from "react-router-dom";
import { GetVariable, RemoveVariable, SetVariable, StorageVariable } from "../../utils/localStorage";
import { PageLayoutLoading } from "../../components/pageLayoutLoading";
import { EditPageTemplate } from "../../components/editPageTemplate";
import { useEffect, useState } from "react";
import { GetQuestion } from "../../repositories/questionRepo";
import { GetAllVersions } from "../../repositories/versionRepo";
import { Question } from "../../models/Question";
import { QuestionVersion } from "../../models/QuestionVersion";
import { Spinner } from "react-bootstrap";
import { GetAllProfiles } from "../../repositories/profilesRepo";

function LoadingSurvey() {
    const params = useParams();
    const surveyId = params.surveyId!;

    const survey = GetVariable(StorageVariable.SURVEY_INFO)!;

    const [numQuestionsLoaded, setNumQuestionsLoaded] = useState(0);
    const [loadedProfiles, setLoadedProfiles] = useState(false);

    async function LoadQuestions() {
        const order = survey.QuestionOrder;

        const questions: Question[] = [];
        const versions: {[key: string]: QuestionVersion[]} = {};

        for (let i = 0; i < order.length; i++) {
            const questionId = order[i];
            
            const fetchedQuestion = await GetQuestion(surveyId, questionId)

            if(fetchedQuestion) {
                const fetchedVersions = await GetAllVersions(surveyId, questionId);

                if(fetchedVersions) {
                    versions[questionId] = fetchedVersions;
                    questions.push(fetchedQuestion);
                }
            }

            setNumQuestionsLoaded(numQuestionsLoaded + 1);
        }

        SetVariable(StorageVariable.QUESTIONS, questions);
        SetVariable(StorageVariable.QUESTION_VERSIONS, versions);
    }

    async function LoadProfiles() {
        const profiles = await GetAllProfiles(surveyId);

        if(profiles) {
            setLoadedProfiles(true);

            SetVariable(StorageVariable.PROFILES, profiles);
        }
    }

    async function LoadSurveyStuff() {
        await LoadQuestions();
        await LoadProfiles();
    }

    useEffect(() => {
        RemoveVariable(StorageVariable.QUESTIONS);
        RemoveVariable(StorageVariable.PROFILES);
        RemoveVariable(StorageVariable.QUESTION_VERSIONS);

        LoadSurveyStuff();
    });

    return <>
        <PageLayoutLoading Survey={survey}>
            <EditPageTemplate Title="Cargando Encuesta">
                <p>Este proceso no debería tomar mucho tiempo. Cuando termine, se le redigirá automáticamente.</p>

                {
                    numQuestionsLoaded === survey.QuestionOrder.length?
                    <p>¡Preguntas cargadas!</p>
                    :
                    <p>{numQuestionsLoaded}/{survey.QuestionOrder.length} preguntas cargadas. <Spinner></Spinner></p>
                }

                {
                    loadedProfiles?
                    <p>¡Perfiles cargados!</p>
                    :
                    <p>Cargando perfiles... <Spinner></Spinner></p>
                }
            </EditPageTemplate>
        </PageLayoutLoading>
    </>;
}


export default LoadingSurvey;