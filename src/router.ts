import { createBrowserRouter } from "react-router-dom";
import Home from "./app/home";
import LoadingSurvey from "./app/[surveyId]/loading";
import EditSurvey from "./app/[surveyId]/editSurvey";
import ProfileListPage from "./app/[surveyId]/profile/profileList";
import NewProfile from "./app/[surveyId]/profile/newProfile";
import EditProfile from "./app/[surveyId]/profile/[profileId]/editProfile";
import QuestionListPage from "./app/[surveyId]/question/questionList";
import EditQuestion from "./app/[surveyId]/question/[questionId]/editQuestion";
import NewQuestion from "./app/[surveyId]/question/newQuestion";

const browserRouter = createBrowserRouter([
    {
        path: "/",
        Component: Home
    },

    // Survey
    {
        path: "/:surveyId/loading",
        Component: LoadingSurvey
    },
    {
        path: "/:surveyId",
        Component: EditSurvey
    },

    // Profiles
    {
        path: "/:surveyId/profile",
        Component: ProfileListPage
    },
    {
        path: "/:surveyId/profile/new",
        Component: NewProfile
    },
    {
        path: "/:surveyId/profile/:profileId",
        Component: EditProfile
    },

    // Questions
    {
        path: "/:surveyId/question",
        Component: QuestionListPage
    },
    {
        path: "/:surveyId/question/:questionId",
        Component: EditQuestion
    },
    {
        path: "/:surveyId/question/new",
        Component: NewQuestion
    }
]);

export default browserRouter;