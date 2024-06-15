import { User } from "firebase/auth";
import { useState, useEffect } from "react";
import { EditPageTemplate } from "../components/editPageTemplate";
import { NewSurveyForm } from "../components/forms/newSurvey";
import { NavBar } from "../components/navigation/navbar";
import { OnAuthStateChanged } from "../repositories/auth";

function NewSurvey() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    OnAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return <>
    <NavBar User={user}></NavBar>

    <main>
      <EditPageTemplate Title="Nueva Encuesta">
        <NewSurveyForm></NewSurveyForm>
      </EditPageTemplate>
    </main>
  </>;
}

export default NewSurvey;