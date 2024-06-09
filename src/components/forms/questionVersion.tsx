import { useParams } from "react-router-dom";
import { Profile } from "../../models/Profile";
import { QuestionVersion } from "../../models/QuestionVersion";
import { AddVersion, UpdateVersion } from "../../repositories/versionRepo";
import { Button, Form } from "react-bootstrap";
import { Floppy2 } from "react-bootstrap-icons";
import { ChangeEvent, FormEvent, useState } from "react";

interface QuestionDetailsFormProps {
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
    const params = useParams();
    const surveyId = params.surveyId!;
    const questionId = params.questionId!;

    const version: QuestionVersion = props.Version;

    const [title, setTitle] = useState(version.Title);
    const [description, setDescription] = useState(version.Description);
    const [selectedProfiles, setSelectedProfiles] = useState(version.Profiles);

    function onProfileCheckChange(e: ChangeEvent<HTMLInputElement>) {
        const target = e.target
        const value = target.name;
        const checked = target.checked;

        const newProfiles = selectedProfiles.filter(x => x !== value || checked);
        setSelectedProfiles(newProfiles);
    }

    async function onSubmit(e: FormEvent) {
        e.preventDefault();

        const newVersion: QuestionVersion = {
            Title: title,
            Description: description,
            Profiles: selectedProfiles,
            Details: version.Details
        };

        let id: string = version.ID!;

        if (version.ID) {
            await UpdateVersion(surveyId, questionId, version.ID, newVersion);
        } else {
            const addedVersion = await AddVersion(surveyId, questionId, newVersion);

            if (!addedVersion) { return; }

            id = addedVersion.ID!;
        }

        window.location.href = `/${surveyId}/question/${questionId}/version/${id}/details`;
    }

    return <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
            <Form.Label>Título interno:</Form.Label>
            <Form.Control
                name="title"
                style={{ width: "40%" }}
                required
                type="text"
                defaultValue={title}
                placeholder="Este titulo solo se muestra en la aplicacion"
                onChange={e => setTitle(e.target.value)}
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>Descripción:</Form.Label>
            <Form.Control
                name="description"
                as="textarea"
                rows={4}
                style={{ resize: "none" }}
                defaultValue={description}
                placeholder="Esta descripción no se mostrará al encuestado, solo es visible dentro de la aplicación"
                onChange={e => setDescription(e.target.value)}
            />
        </Form.Group>

        <Form.Label htmlFor="private-description-input">Perfiles a los que aplica:</Form.Label>
        <br></br>
        {
            props.Profiles.map((profile) =>
                <Form.Check
                    name={`${profile.ID}`}
                    type="checkbox"
                    key={profile.ID}
                    id={profile.Title}
                    label={profile.Title}
                    defaultChecked={selectedProfiles.includes(profile.ID!)}
                    onChange={onProfileCheckChange}
                />
            )
        }
        <a href={`/${surveyId}/profile`} style={{ fontSize: "larger" }}>Gestionar perfiles...</a>
        <br></br>

        <Button className="btn-secondary" type="submit" style={{ marginTop: "20px" }}>
            <Floppy2></Floppy2> Continuar a Respuestas
        </Button>
        {
            version.ID ?
                <Button className="btn-danger" type="button" style={{ float: "right", marginTop: "20px" }}>Eliminar</Button> :
                <></>
        }
    </Form>;
}