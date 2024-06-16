import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageTemplate } from "../../../../components/editPageTemplate";
import { ProfileDetailsForm } from "../../../../components/forms/profileDetails";
import { EditSurveyPageLayout } from "../../../../components/pageLayout";
import { Profile } from "../../../../models/Profile";
import { GetVariable, StorageVariable } from "../../../../utils/localStorage";
import { CheckUserLoggedIn } from "../../../../components/checkUser";

function EditProfile() {
    const params = useParams();
    const profileId = params.profileId!;

    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const profilesData = GetVariable(StorageVariable.PROFILES);

        if (profilesData) {
            const foundProfile = profilesData.find(x => x.ID === profileId);
            setProfile(foundProfile ?? null);
        }
    }, [profileId]);

    if (!profile) {
        return <></>;
    }

    return <CheckUserLoggedIn>
        <EditSurveyPageLayout SelectedProfile={params.profileId}>
            <PageTemplate Title="Información Perfil">
                <ProfileDetailsForm Profile={profile}></ProfileDetailsForm>
            </PageTemplate>
        </EditSurveyPageLayout>
    </CheckUserLoggedIn>;
}

export default EditProfile;