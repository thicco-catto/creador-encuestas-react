import { Profile } from "../../models/Profile";
import { DeleteProfile } from "../../repositories/profilesRepo";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

interface ProfileListElementProps {
    SurveyId: string,
    Profile: Profile
}

function ProfileListElement(props: ProfileListElementProps) {
    const profile = props.Profile;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const confirmDelete = async () => {
        await DeleteProfile(props.SurveyId, props.Profile.ID!);
        handleClose();

        // TODO: Find alternative
        // router.refresh();
    };

    return <li className="survey-list-element">
        <h2>{profile.Title}</h2>
        <p>{profile.Description}</p>
        <br></br>
        <a href={`/edit/${props.SurveyId}/profile/${profile.ID}`}><Button variant="secondary">Editar</Button></a>
        <Button onClick={handleShow} variant="danger" style={{ float: "right" }}>Eliminar</Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>¿Eliminar perfil {profile.Title}?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Eliminar este perfil es una acción permanente. ¿Continuar?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={confirmDelete}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    </li>;
}

interface ProfileListProps {
    SurveyID: string,
    Profiles: Profile[]
}

/**
 * Displays a list of profiles
 * @param props
 */
export function ProfileList(props: ProfileListProps) {
    const profiles = props.Profiles;
    profiles.sort((a, b) => a.Title.localeCompare(b.Title));
    return <>
        <a href={`/edit/${props.SurveyID}/profile/new`} style={{ textDecoration: "none", color: "white" }}><button className="btn btn-secondary mb-3">Añadir</button></a>
        <ul className="survey-list">
            {profiles.map((profile) =>
                <ProfileListElement key={profile.ID} SurveyId={props.SurveyID} Profile={profile}></ProfileListElement>
            )}
        </ul>
    </>;
}