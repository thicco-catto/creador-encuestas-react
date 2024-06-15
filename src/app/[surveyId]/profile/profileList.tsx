import { useEffect, useState } from "react";
import { ProfileList } from "../../../components/lists/profileList";
import { Profile } from "../../../models/Profile";
import { GetVariable, StorageVariable } from "../../../utils/localStorage";
import { EditPageTemplate } from "../../../components/editPageTemplate";
import { PageLayout } from "../../../components/pageLayout";
import { CheckUserLoggedIn } from "../../../components/checkUser";

function ProfileListPage() {
    const [profiles, setProfiles] = useState<Profile[] | null>(null);

    useEffect(() => {
        const profilesData = GetVariable(StorageVariable.PROFILES);

        if(profilesData) {
            setProfiles(profilesData)
        }
    }, []);

    if(!profiles) {
        return <></>;
    }

    return <CheckUserLoggedIn>
        <PageLayout>
            <EditPageTemplate Title="Lista de Perfiles">
                <ProfileList Profiles={profiles}></ProfileList>
            </EditPageTemplate>
        </PageLayout>
    </CheckUserLoggedIn>;
}

export default ProfileListPage;