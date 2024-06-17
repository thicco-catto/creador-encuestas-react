import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QuestionVersionForm } from "../../../../../../components/forms/questionVersion";
import { QuestionVersion } from "../../../../../../models/QuestionVersion";
import { Profile } from "../../../../../../models/Profile";
import { PageTemplate } from "../../../../../../components/editPageTemplate";
import { EditSurveyPageLayout } from "../../../../../../components/pageLayout";
import { GetVariable, StorageVariable } from "../../../../../../utils/localStorage";
import { CheckUserLoggedIn } from "../../../../../../components/checkUser";


function EditVersion() {
    const params = useParams();
    const surveyId = params.surveyId!;
    const questionId = params.questionId!;
    const versionId = params.versionId!;

    const [version, setVersion] = useState<QuestionVersion | null>(null);
    const [profiles, setProfiles] = useState<Profile[] | null>(null);

    useEffect(() => {
        const versionsData = GetVariable(StorageVariable.QUESTION_VERSIONS);
        const profilesData = GetVariable(StorageVariable.PROFILES);

        if(versionsData && profilesData) {
            const versions = versionsData[questionId] ?? [];
            setVersion(versions.find(x => x.ID === versionId) ?? null);

            setProfiles(profilesData);
        } else {
            window.location.href = `/${surveyId}/loading`;
        }
    }, [questionId, versionId, surveyId]);

    if(!version || !profiles) {
        return <></>;
    }

    return <CheckUserLoggedIn>
        <EditSurveyPageLayout QuestionId={questionId} AffectedProfiles={version.Profiles}>
            <PageTemplate Title="Información Versión">
                <QuestionVersionForm Version={version} Profiles={profiles}></QuestionVersionForm>
            </PageTemplate>
        </EditSurveyPageLayout>
    </CheckUserLoggedIn>;
}

export default EditVersion;