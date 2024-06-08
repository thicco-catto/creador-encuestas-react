import { useParams } from "react-router-dom";
import { PageLayout } from "../../components/pageLayout";
import { GetVariable, StorageVariable } from "../../utils/localStorage";

function LoadingSurvey() {
    const params = useParams();
    const surveyId = params.surveyId!;

    const survey = GetVariable(StorageVariable.SURVEY_INFO);
    if(!survey) {
        return <h1>ERROR</h1>;
    }

    return <>
        <h1>{survey.Title}</h1>
    </>;
}


export default LoadingSurvey;