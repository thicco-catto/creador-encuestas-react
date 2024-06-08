import { createBrowserRouter } from "react-router-dom";
import Home from "./app/home";
import LoadingSurvey from "./app/[surveyId]/loading";

const browserRouter = createBrowserRouter([
    {
        path: "/",
        Component: Home
    },
    {
        path: "/:surveyId/loading",
        Component: LoadingSurvey
    }
]);

export default browserRouter;