import { useEffect, useState } from "react";
import { SurveyList } from "../components/lists/surveyList";
import { NavBar } from "../components/navigation/navbar";
import { Survey } from "../models/Survey";
import { GetAllSurveys } from "../repositories/surveyRepo";
import { Spinner } from "react-bootstrap";
import { User } from "firebase/auth";
import { OnAuthStateChanged } from "../repositories/auth";
import { LogInForm } from "../components/forms/login";
import { PageTemplate } from "../components/editPageTemplate";

function Home() {
    const [loading, setLoading] = useState(true);
    const [surveys, setSurveys] = useState<Survey[] | undefined>(undefined);
    const [user, setUser] = useState<User | null>(null);

    async function LoadSurveys() {
        const fetchedSurveys = await GetAllSurveys()
        setSurveys(fetchedSurveys);
    }

    useEffect(() => {
        OnAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);

            LoadSurveys();
        });
    }, []);

    return <>
        <NavBar User={user}></NavBar>

        <main>
            {
                loading ?
                    <Spinner></Spinner>
                    :
                    <>
                        {
                            user ?
                                    <PageTemplate Title="Lista de Encuestas">
                                    {
                                        surveys?
                                        <SurveyList Surveys={surveys}></SurveyList>
                                        :
                                        <Spinner></Spinner>
                                    }
                                    </PageTemplate>
                                :
                                <PageTemplate Title="Para acceder a la lista de encuestas y poder editarlas, inicia sesión">
                                    <LogInForm></LogInForm>
                                </PageTemplate>
                        }
                    </>
            }
        </main>
    </>;
}

export default Home;