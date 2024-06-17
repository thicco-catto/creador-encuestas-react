import { useParams } from "react-router-dom";
import { RemoveVariable, SetVariable, StorageVariable } from "../../utils/localStorage";
import { PageLayoutLoading } from "../../components/pageLayoutLoading";
import { PageTemplate } from "../../components/editPageTemplate";
import { useCallback, useEffect, useState } from "react";
import { GetQuestion } from "../../repositories/questionRepo";
import { GetAllVersions } from "../../repositories/versionRepo";
import { Question } from "../../models/Question";
import { QuestionVersion } from "../../models/QuestionVersion";
import { Button, Spinner } from "react-bootstrap";
import { GetAllProfiles } from "../../repositories/profilesRepo";
import { CheckUserLoggedIn } from "../../components/checkUser";
import { GetSurvey } from "../../repositories/surveyRepo";
import { Survey } from "../../models/Survey";

function LoadingSurvey() {
    const params = useParams();
    const surveyId = params.surveyId!;

    const [survey, setSurvey] = useState<Survey | undefined>(undefined);
    const [numQuestionsLoaded, setNumQuestionsLoaded] = useState(0);
    const [loadedProfiles, setLoadedProfiles] = useState(false);

    const [errorLoading, setErrorLoading] = useState(false);

    const LoadSurvey = useCallback(async function (signal: AbortSignal) {
        if (signal.aborted) { return; }

        const survey = await GetSurvey(surveyId);
        return survey;
    }, [surveyId])

    const LoadQuestions = useCallback(async function (signal: AbortSignal, order: string[]) {
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
    }, [surveyId]);

    const LoadProfiles = useCallback(async function (signal: AbortSignal) {
        if (signal.aborted) { return; }

        const profiles = await GetAllProfiles(surveyId);

        return profiles;
    }, [surveyId])

    const LoadAllSurveyData = useCallback(async function (signal: AbortSignal) {
        //Load survey
        const survey = await LoadSurvey(signal);
        if (signal.aborted) { return; }

        if (!survey) {
            setErrorLoading(true);
            return;
        } else {
            setSurvey(survey);
            SetVariable(StorageVariable.SURVEY_INFO, survey);
        }

        //Load questions and versions
        await LoadQuestions(signal, survey.QuestionOrder);
        if (signal.aborted) { return; }

        //Load profiles
        const profiles = await LoadProfiles(signal);
        if (signal.aborted) { return; }

        if (!profiles) {
            setErrorLoading(true);
            return;
        } else {
            setLoadedProfiles(true);
    
            SetVariable(StorageVariable.PROFILES, profiles);
        }

        if (signal.aborted) { return; }

        window.location.href = `/${surveyId}`
    }, [LoadProfiles, LoadQuestions, LoadSurvey, surveyId]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        RemoveVariable(StorageVariable.QUESTIONS);
        RemoveVariable(StorageVariable.PROFILES);
        RemoveVariable(StorageVariable.QUESTION_VERSIONS);

        LoadAllSurveyData(signal);

        return () => {
            controller.abort();
        }
    }, [LoadAllSurveyData]);

    return <CheckUserLoggedIn>
        <PageLayoutLoading Disabled={true} Survey={survey}>
            <PageTemplate Title="Cargando Encuesta">
                {
                    errorLoading ?
                        <>
                            <p>Ocurrió un error cargando la encuesta. Es posible que esta encuesta haya sido eliminada y no exista.</p>
                            <Button variant="secondary" as="a" href="/">Volver a la lista de encuestas</Button>
                        </>
                        :
                        <>
                            {
                                survey && numQuestionsLoaded === survey.QuestionOrder.length ?
                                    <h4>¡Preguntas cargadas!</h4>
                                    :
                                    <div>
                                        <h4>{numQuestionsLoaded}/{survey?.QuestionOrder.length ?? "??"} preguntas cargadas...</h4>
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
                        </>
                }
            </PageTemplate>
        </PageLayoutLoading>
    </CheckUserLoggedIn>;
}


export default LoadingSurvey;