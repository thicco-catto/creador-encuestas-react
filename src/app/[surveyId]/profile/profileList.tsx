import { useEffect, useState } from "react";
import { ProfileList } from "../../../components/lists/profileList";
import { Profile } from "../../../models/Profile";
import { GetVariable, StorageVariable } from "../../../utils/localStorage";
import { EditPageTemplate } from "../../../components/editPageTemplate";
import { PageLayout } from "../../../components/pageLayout";

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

    return (
        <PageLayout>
            <EditPageTemplate Title="Lista de Perfiles">
                <ProfileList Profiles={profiles}></ProfileList>
            </EditPageTemplate>
        </PageLayout>
    );
}

export default ProfileListPage;