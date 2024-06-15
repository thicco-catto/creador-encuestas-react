import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QuestionVersionForm } from "../../../../../../components/forms/questionVersion";
import { QuestionVersion } from "../../../../../../models/QuestionVersion";
import { Profile } from "../../../../../../models/Profile";
import { EditPageTemplate } from "../../../../../../components/editPageTemplate";
import { PageLayout } from "../../../../../../components/pageLayout";
import { GetVariable, StorageVariable } from "../../../../../../utils/localStorage";
import { CheckUserLoggedIn } from "../../../../../../components/checkUser";


function EditVersion() {
    const params = useParams();
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
        }
    }, [questionId, versionId]);

    if(!version || !profiles) {
        return <></>;
    }

    return <CheckUserLoggedIn>
        <PageLayout QuestionId={questionId} AffectedProfiles={version.Profiles}>
            <EditPageTemplate Title="Información Versión">
                <QuestionVersionForm Version={version} Profiles={profiles}></QuestionVersionForm>
            </EditPageTemplate>
        </PageLayout>
    </CheckUserLoggedIn>;
}

export default EditVersion;