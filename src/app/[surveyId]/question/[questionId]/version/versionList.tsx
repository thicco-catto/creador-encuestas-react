import { useEffect, useState } from "react";
import { VersionList } from "../../../../../components/lists/versionsList";
import { EditPageTemplate } from "../../../../../components/editPageTemplate";
import { PageLayout } from "../../../../../components/pageLayout";
import { GetVariable, StorageVariable } from "../../../../../utils/localStorage";
import { QuestionVersion } from "../../../../../models/QuestionVersion";
import { useParams } from "react-router-dom";

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

    return (
        <PageLayout>
            <EditPageTemplate Title="Lista de Versiones">
                <VersionList Versions={versions}></VersionList>
            </EditPageTemplate>
        </PageLayout>
    );
}

export default VersionListPage;