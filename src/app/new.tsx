import { EditPageTemplate } from "../components/editPageTemplate";
import { NewSurveyForm } from "../components/forms/newSurvey";

function NewSurvey() {
    return <main>
    <EditPageTemplate Title="Nueva Encuesta">
      <NewSurveyForm></NewSurveyForm>
    </EditPageTemplate>
  </main>;
}

export default NewSurvey;