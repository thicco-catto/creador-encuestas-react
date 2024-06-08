import { useEffect, useState } from "react";
import { SurveyList } from "../components/lists/surveyList";
import { NavBar } from "../components/navigation/navbar";
import { Survey } from "../models/Survey";
import { GetAllSurveys } from "../repositories/surveyRepo";
import { Spinner } from "react-bootstrap";

function Home() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [errorLoading, setErrorLoading] = useState(false);

    async function LoadSurveys() {
        const fetchedSurveys = await GetAllSurveys();

        if (!fetchedSurveys) {
            setErrorLoading(true);
        } else {
            setSurveys(fetchedSurveys);
        }

        setLoaded(true);
    }

    useEffect(() => {
        LoadSurveys();
    });

    return <>
        <NavBar></NavBar>

        <main>
            <h1>Mis Encuestas:</h1>
            {
                loaded ?
                    <>
                        {
                            errorLoading ?
                                <h2>Ha occurido un error al cargar el listado de encuestas. Vuelva a intentarlo más tarde.</h2>
                                :
                                <SurveyList Surveys={surveys}></SurveyList>
                        }
                    </>
                    :
                    <>
                        <h2>Cargando encuestas...</h2>
                        <Spinner></Spinner>
                    </>
            }
        </main>
    </>;
}

export default Home;