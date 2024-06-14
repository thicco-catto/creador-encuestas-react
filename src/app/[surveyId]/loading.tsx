import { useParams } from "react-router-dom";
import { GetVariable, RemoveVariable, SetVariable, StorageVariable } from "../../utils/localStorage";
import { PageLayoutLoading } from "../../components/pageLayoutLoading";
import { EditPageTemplate } from "../../components/editPageTemplate";
import { useCallback, useEffect, useState } from "react";
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

    const LoadQuestions = useCallback(async function (signal: AbortSignal) {
        const order = survey.QuestionOrder;

        const questions: Question[] = [];
        const versions: { [key: string]: QuestionVersion[] } = {};

        for (let i = 0; i < order.length; i++) {
            if (signal.aborted) { return; }

            const questionId = order[i];

            const fetchedQuestion = await GetQuestion(surveyId, questionId)

            if (fetchedQuestion) {
                const fetchedVersions = await GetAllVersions(surveyId, questionId);

                if (fetchedVersions) {
                    versions[questionId] = fetchedVersions;
                    questions.push(fetchedQuestion);
                }
            }

            setNumQuestionsLoaded(i + 1);
        }

        SetVariable(StorageVariable.QUESTIONS, questions);
        SetVariable(StorageVariable.QUESTION_VERSIONS, versions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(survey.QuestionOrder), surveyId]);

    const LoadProfiles = useCallback(async function (signal: AbortSignal) {
        if (signal.aborted) { return; }

        const profiles = await GetAllProfiles(surveyId);

        if (profiles) {
            setLoadedProfiles(true);

            SetVariable(StorageVariable.PROFILES, profiles);
        }
    }, [surveyId])

    const LoadSurveyStuff = useCallback(async function (signal: AbortSignal) {
        await LoadQuestions(signal);
        await LoadProfiles(signal);

        if (signal.aborted) { return; }

        window.location.href = `/${surveyId}`
    }, [LoadProfiles, LoadQuestions, surveyId]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        RemoveVariable(StorageVariable.QUESTIONS);
        RemoveVariable(StorageVariable.PROFILES);
        RemoveVariable(StorageVariable.QUESTION_VERSIONS);

        LoadSurveyStuff(signal);

        return () => {
            controller.abort();
        }
    }, [LoadSurveyStuff]);

    return <>
        <PageLayoutLoading Disabled={true} Survey={survey}>
            <EditPageTemplate Title="Cargando Encuesta">
                {
                    numQuestionsLoaded === survey.QuestionOrder.length ?
                        <h4>¡Preguntas cargadas!</h4>
                        :
                        <div>
                            <h4>{numQuestionsLoaded}/{survey.QuestionOrder.length} preguntas cargadas...</h4>
                            <Spinner></Spinner>
                        </div>
                }

                <div className="mt-4"></div>

                {
                    loadedProfiles ?
                        <h4>¡Perfiles cargados!</h4>
                        :
                        <div>
                            <h4>Cargando perfiles...</h4>
                            <Spinner></Spinner>
                        </div>
                }

                <p className="mt-5">Este proceso no debería tomar mucho tiempo. Cuando termine, se le redigirá automáticamente.</p>
            </EditPageTemplate>
        </PageLayoutLoading>
    </>;
}


export default LoadingSurvey;