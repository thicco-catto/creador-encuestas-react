import { useEffect, useState } from "react";
import { VersionList } from "../../../../../components/lists/versionsList";
import { PageTemplate } from "../../../../../components/editPageTemplate";
import { EditSurveyPageLayout } from "../../../../../components/pageLayout";
import { GetVariable, StorageVariable } from "../../../../../utils/localStorage";
import { QuestionVersion } from "../../../../../models/QuestionVersion";
import { useParams } from "react-router-dom";
import { CheckUserLoggedIn } from "../../../../../components/checkUser";

function VersionListPage() {
    const params = useParams();
    const questionId = params.questionId!;

    const [versions, setVersions] = useState<QuestionVersion[] | null>(null);

    useEffect(() => {
        const versionData = GetVariable(StorageVariable.QUESTION_VERSIONS);

        if(versionData) {
            setVersions(versionData[questionId] ?? []);
        }
    }, [questionId]);

    if(!versions) {
        return <></>;
    }

    return <CheckUserLoggedIn>
        <EditSurveyPageLayout QuestionId={questionId}>
            <PageTemplate Title="Lista de Versiones">
                <VersionList Versions={versions}></VersionList>
            </PageTemplate>
        </EditSurveyPageLayout>
    </CheckUserLoggedIn>;
}

export default VersionListPage;