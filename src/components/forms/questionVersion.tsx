import { Profile } from "../../models/Profile";
import { QuestionVersion } from "../../models/QuestionVersion";
import { AddVersion, UpdateVersion } from "../../repositories/versionRepo";
import { Button, Form } from "react-bootstrap";
import { Floppy2 } from "react-bootstrap-icons";

interface QuestionDetailsFormProps {
    SurveyID: string,
    QuestionID: string,
    Version: QuestionVersion,
    Profiles: Profile[]
}

/**
 * Displays the form that shows when editing a question version.
 * 
 * If the provided Version doesn't have an ID set, it will show
 * options related to creating a new version.
 * @param props 
 */
export function QuestionVersionForm(props: QuestionDetailsFormProps) {
    const version: QuestionVersion = props.Version;

    async function onSubmit(data: FormData) {
        const selectedProfiles = props.Profiles.filter(x => {
            return data.get(`profile-${x.ID}`);
        }).map(x => x.ID!);

        const newVersion: QuestionVersion = {
            Title: data.get("title")!.toString(),
            Description: data.get("description")!.toString(),
            Profiles: selectedProfiles,
            Details: version.Details
        };

        let id: string = version.ID!;

        if(version.ID) {
            await UpdateVersion(props.SurveyID, props.QuestionID, version.ID, newVersion);
        } else {
            const addedVersion = await AddVersion(props.SurveyID, props.QuestionID, newVersion);

            if(!addedVersion) { return; }

            id = addedVersion.ID!;
        }
        
        window.location.href = `/edit/${props.SurveyID}/question/${props.QuestionID}/version/${id}/details`;
    }

    return <Form>
        <Form.Group className="mb-3">
            <Form.Label>Título interno:</Form.Label>
            <Form.Control name="title" style={{width: "40%"}} required type="text" defaultValue={version.Title} placeholder="Este titulo solo se muestra en la aplicacion"></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>Descripción:</Form.Label>
            <Form.Control name="description" as="textarea" rows={4} style={{resize: "none"}} defaultValue={version.Description} placeholder="Esta descripción no se mostrará al encuestado, solo es visible dentro de la aplicación"></Form.Control>
        </Form.Group>

        <Form.Label htmlFor="private-description-input">Perfiles a los que aplica:</Form.Label>
        <br></br>
        {
            props.Profiles.map((profile) =>
                <>
                    <Form.Check name={`profile-${profile.ID}`} type="checkbox" key={profile.ID} id={profile.Title} label={profile.Title} defaultChecked={version.Profiles.includes(profile.ID!)}></Form.Check>
                </>
            )
        }
        <a href={`/edit/${props.SurveyID}/profile`} style={{fontSize: "larger"}}>Gestionar perfiles...</a>
        <br></br>

        <Button className="btn-secondary" type="submit" style={{marginTop: "20px"}}>
            <Floppy2></Floppy2> Continuar a Respuestas
        </Button>
        {
            version.ID?
            <Button className="btn-danger" type="button" style={{float: "right", marginTop: "20px"}}>Eliminar</Button> :
            <></>
        }
    </Form>;
}