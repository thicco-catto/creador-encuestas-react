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
import VersionListPage from "./app/[surveyId]/question/[questionId]/version/versionList";
import EditVersion from "./app/[surveyId]/question/[questionId]/version/[versionId]/editVersion";
import NewVersion from "./app/[surveyId]/question/[questionId]/version/newVersion";
import EditDefaultDetails from "./app/[surveyId]/question/[questionId]/version/editDefaultDetails";
import EditVersionDetails from "./app/[surveyId]/question/[questionId]/version/[versionId]/editDetails";
import NewSurvey from "./app/new";
import LogIn from "./app/login";
import SignUp from "./app/signup";

const browserRouter = createBrowserRouter([
    {
        path: "/",
        Component: Home
    },

    // Account
    {
        path: "/login",
        Component: LogIn
    },
    {
        path: "/signup",
        Component: SignUp
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
    {
        path: "/new",
        Component: NewSurvey
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
    },

    // Versions
    {
        path: "/:surveyId/question/:questionId/version",
        Component: VersionListPage
    },
    {
        path: "/:surveyId/question/:questionId/version/:versionId",
        Component: EditVersion
    },
    {
        path: "/:surveyId/question/:questionId/version/new",
        Component: NewVersion
    },
    {
        path: "/:surveyId/question/:questionId/version/default",
        Component: EditDefaultDetails
    },
    {
        path: "/:surveyId/question/:questionId/version/:versionId/details",
        Component: EditVersionDetails
    }
]);

export default browserRouter;