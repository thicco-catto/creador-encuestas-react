import { Profile } from "../../models/Profile";
import { AddProfile, DeleteProfile, UpdateProfile } from "../../repositories/profilesRepo";
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Floppy2 } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";

interface ProfileDetailsFormProps {
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
    const params = useParams();
    const surveyId = params.surveyId!;

    const profile: Profile = props.Profile;

    const [title, setTitle] = useState(profile.Title);
    const [description, setDescription] = useState(profile.Description);
    const [show, setShow] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        const newProfile: Profile = {
            Title: title,
            Description: description
        };

        if(profile.ID) {
            //Has ID, so we want to update
            await UpdateProfile(surveyId, profile.ID, newProfile);
        } else {
            //Doesn't have id, we want to create a new one
            await AddProfile(surveyId, newProfile);
        }

        window.location.href = `/${surveyId}/profile`;
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const confirmDelete = async () => {
        await DeleteProfile(surveyId, props.Profile.ID!);

        window.location.href = `/${surveyId}/profile`;
    };

    return <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
            <Form.Label htmlFor="title">Nombre del perfil:</Form.Label>
            <Form.Control
                id="title"
                name="title"
                style={{width: "40%"}}
                required
                type="text"
                defaultValue={title}
                placeholder="Nombre del perfil"
                onChange={(e) => setTitle(e.target.value)}
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label htmlFor="description">Descripción privada:</Form.Label>
            <Form.Control
                id="description"
                name="description"
                as="textarea"
                rows={4}
                style={{resize: "none"}}
                defaultValue={description}
                placeholder="Esta descripción no se mostrará al encuestado, solo es visible dentro de la aplicación"
                onChange={(e) => setDescription(e.target.value)}
            />
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