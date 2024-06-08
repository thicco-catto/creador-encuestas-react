import { Profile } from "../../models/Profile";
import { AddProfile, DeleteProfile, UpdateProfile } from "../../repositories/profilesRepo";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Floppy2 } from "react-bootstrap-icons";

interface ProfileDetailsFormProps {
    SurveyID: string,
    Profile: Profile
}

/**
 * Displays the form that shows when editing a profile.
 * 
 * If the given profile doesn't have an ID set, it will show options
 * related to creating a new one.
 * @param props 
 * @returns 
 */
export function ProfileDetailsForm(props: ProfileDetailsFormProps) {
    const profile: Profile = props.Profile;

    const [show, setShow] = useState(false);

    async function onSubmit(data: FormData) {
        const newProfile: Profile = {
            Title: data.get("title")!.toString(),
            Description: data.get("description")!.toString()
        };

        if(profile.ID) {
            //Has ID, so we want to update
            await UpdateProfile(props.SurveyID, profile.ID, newProfile);
        } else {
            //Doesn't have id, we want to create a new one
            await AddProfile(props.SurveyID, newProfile);
        }

        window.location.href = `/edit/${props.SurveyID}/profile`;
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const confirmDelete = async () => {
        await DeleteProfile(props.SurveyID, props.Profile.ID!);

        window.location.href = `/edit/${props.SurveyID}/profile`;
    };

    return <Form>
        <Form.Group className="mb-3">
            <Form.Label htmlFor="title">Nombre del perfil:</Form.Label>
            <Form.Control id="title" name="title" style={{width: "40%"}} required type="text" defaultValue={profile.Title} placeholder="Nombre del perfil"></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label htmlFor="description">Descripción privada:</Form.Label>
            <Form.Control id="description" name="description" as="textarea" rows={4} style={{resize: "none"}} defaultValue={profile.Description} placeholder="Esta descripción no se mostrará al encuestado, solo es visible dentro de la aplicación"></Form.Control>
        </Form.Group>

        <Button variant="secondary" type="submit">
            <Floppy2></Floppy2> Volver a Perfiles
        </Button>

        {profile.ID?
            <Button onClick={handleShow} variant="danger" type="button" style={{float: "right"}}>Eliminar</Button>:
            <></>
        }

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
    </Form>;
}