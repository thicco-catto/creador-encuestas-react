import { useEffect, useState } from "react";
import { ProfileList } from "../../../components/lists/profileList";
import { Profile } from "../../../models/Profile";
import { GetVariable, StorageVariable } from "../../../utils/localStorage";
import { PageTemplate } from "../../../components/editPageTemplate";
import { EditSurveyPageLayout } from "../../../components/pageLayout";
import { CheckUserLoggedIn } from "../../../components/checkUser";
import { useParams } from "react-router-dom";

function ProfileListPage() {
    const params = useParams();
    const surveyId = params.surveyId!;

    const [profiles, setProfiles] = useState<Profile[] | null>(null);

    useEffect(() => {
        const profilesData = GetVariable(StorageVariable.PROFILES);

        if(profilesData) {
            setProfiles(profilesData)
        } else {
            window.location.href = `/${surveyId}/loading`;
        }
    }, [surveyId]);

    if(!profiles) {
        return <></>;
    }

    return <CheckUserLoggedIn>
        <EditSurveyPageLayout>
            <PageTemplate Title="Lista de Perfiles">
                <ProfileList Profiles={profiles}></ProfileList>
            </PageTemplate>
        </EditSurveyPageLayout>
    </CheckUserLoggedIn>;
}

export default ProfileListPage;