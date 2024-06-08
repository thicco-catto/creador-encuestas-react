import { createBrowserRouter } from "react-router-dom";
import Home from "./app/home";
import LoadingSurvey from "./app/[surveyId]/loading";
import EditSurvey from "./app/[surveyId]/editSurvey";

const browserRouter = createBrowserRouter([
    {
        path: "/",
        Component: Home
    },
    {
        path: "/:surveyId/loading",
        Component: LoadingSurvey
    },
    {
        path: "/:surveyId",
        Component: EditSurvey
    }
]);

export default browserRouter;