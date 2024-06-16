import { CheckUserLoggedIn } from "../../../components/checkUser";
import { PageTemplate } from "../../../components/editPageTemplate";
import { ProfileDetailsForm } from "../../../components/forms/profileDetails";
import { EditSurveyPageLayout } from "../../../components/pageLayout";
import { Profile } from "../../../models/Profile";

function NewProfile() {
    const profile: Profile = {
        Title: "",
        Description: ""
    };

    return <CheckUserLoggedIn>
        <EditSurveyPageLayout>
            <PageTemplate Title="Nuevo Perfil">
                <ProfileDetailsForm Profile={profile}></ProfileDetailsForm>
            </PageTemplate>
        </EditSurveyPageLayout>
    </CheckUserLoggedIn>;
}

export default NewProfile;