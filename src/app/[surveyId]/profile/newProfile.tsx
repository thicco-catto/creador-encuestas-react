import { EditPageTemplate } from "../../../components/editPageTemplate";
import { ProfileDetailsForm } from "../../../components/forms/profileDetails";
import { PageLayout } from "../../../components/pageLayout";
import { Profile } from "../../../models/Profile";

function NewProfile() {
    const profile: Profile = {
        Title: "",
        Description: ""
    };

    return (
        <PageLayout>
            <EditPageTemplate Title="Nuevo Perfil">
                <ProfileDetailsForm Profile={profile}></ProfileDetailsForm>
            </EditPageTemplate>
        </PageLayout>
    );
}

export default NewProfile;