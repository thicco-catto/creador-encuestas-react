import { User } from "firebase/auth";
import { useState, useEffect } from "react";
import { OnAuthStateChanged } from "../repositories/auth";
import { NavBar } from "../components/navigation/navbar";
import { PageTemplate } from "../components/editPageTemplate";
import { Calendar, Check2Circle, Collection, Icon1Circle, PencilSquare, UiChecksGrid } from "react-bootstrap-icons";

function Help() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        OnAuthStateChanged((user) => {
            setUser(user);
        });
    }, []);

    return <>
        <NavBar User={user}></NavBar>

        <main>
            <PageTemplate Title="Ayuda">
                <div className="help-container">
                    <h2>Funcionamiento de la aplicación</h2>
                    <p>Esta aplicación te permite crear encuestas que cuentan con diversos perfiles para los encuestados, de forma que las preguntas se adapten dinámicamente.</p>
                    <p>Por ejemplo, si tenemos una pregunta como "¿De dónde eres?", podríamos crear un perfil para usuarios que hablen inglés, de forma que cuando ellos rellenen la encuesta, la pregunta aparecerá como "Where are you from?".</p>
                    <p>Cada pregunta puede tener varias versiones, o ninguna, y cada versión puede tener asociados uno o más perfiles.</p>

                    <h2>Descripción de la interfaz</h2>
                    <ol>
                        <li><strong>Barra de navegación.</strong> En esta barra aparecen atajos a diversas páginas. Siempre contiene un enlace a esta ayuda, a la lista de encuestas y para cerrar la sesión. Si se está editando una encuesta también aparecerá el nombre de la encuesta, que lleva a la ventana de edición de la información de la encuesta, y atajos a las listas de preguntas y perfiles. Además, si se está editando una pregunta, o una versión de una pregunta, aparecerán atajos a la página de edición de la pregunta y a la lista de perfiles.</li>
                        <li><strong>Pestaña lateral de navegación.</strong> En esta pestaña aparecen las preguntas y los perfiles que existen actualmente en la aplicación. Clicar en cada elemento navega hasta la ventana de edición del respectivo elemento. Cuando se edita un perfil o una pregunta, estos aparecen resaltados con un borde más grueso y de color negro. Además, si se edita una versión, aparecerán resaltados los perfiles a los que afecta, de manera más sútil.</li>
                    </ol>

                    En la pestaña lateral de navegación las preguntas aparecen con iconos asociados:
                    <ul>
                        <li><Check2Circle /> Este icono indica que la pregunta es de elección única.</li>
                        <li><UiChecksGrid /> Este icono indica que la pregunta es de elección múltiple.</li>
                        <li><PencilSquare /> Este icono indica que la pregunta es de texto libre.</li>
                        <li><Calendar /> Este icono indica que la pregunta es de elección de fecha.</li>
                        <li><Icon1Circle /> Este icono indica que la pregunta es de rango numérico.</li>
                        <li><Collection /> Este icono indica que la pregunta tiene versiones.</li>
                    </ul>

                    <h2>Operaciones básicas</h2>

                    <div className="help-subcontainer">
                        <h3>Cuenta y Sesión</h3>

                        <div className="help-subcontainer">
                            <h4>Crear Cuenta</h4>
                            <ol>
                                <li>En la barra de navegación, clica en "Crear Cuenta".</li>
                                <li>Introduce tu correo y una contraseña.</li>
                                <li>Clica en "Crear Cuenta".</li>
                            </ol>

                            <h4>Iniciar Sesión</h4>
                            <ol>
                                <li>En la barra de navegación, clica en "Iniciar Sesión".</li>
                                <li>Introduce tu correo y tu contraseña.</li>
                                <li>Clica en "Iniciar Sesión"</li>
                            </ol>

                            <h4>Cerrar Sesión</h4>
                            <ol>
                                <li>En la barra de navegación, clica en "Cerrar Sesión"</li>
                            </ol>
                        </div>

                        <h3>Encuestas</h3>

                        <div className="help-subcontainer">
                            <h4>Crear una nueva encuesta</h4>
                            <ol>
                                <li>En la barra de navegación, clica en "Mis Encuestas" para navegar a la lista de encuestas.</li>
                                <li>Clica en el botón "Crear Nueva".</li>
                                <li>Introduce los datos de la nueva encuesta.</li>
                                <li>Clica "Continuar a Perfiles" o "Continuar a Preguntas", según lo que quieras editar a continuación.</li>
                            </ol>

                            <h4>Editar los datos de una encuesta existente</h4>
                            <ol>
                                <li>En la barra de navegación, clica en el nombre de la encuesta.</li>
                                <li>Actualiza los datos que desees.</li>
                                <li>Clica "Continuar a Perfiles" o "Continuar a Preguntas", según lo que quieras editar a continuación.</li>
                            </ol>

                            <h4>Eliminar una encuesta</h4>
                            <ol>
                                <li>En la barra de navegación, clica en "Mis Encuestas" para navegar a la lista de encuestas.</li>
                                <li>Busca la encuesta que desees eliminar.</li>
                                <li>Clica el botón "Eliminar" a la derecha.</li>
                                <li>Aparecerá un mensaje de confirmación. Asegúrate que es la encuesta correcta y clica "Eliminar".</li>
                            </ol>
                        </div>

                        <h3>Perfiles</h3>

                        <div className="help-subcontainer">
                            <h4>Crear un nuevo perfil</h4>
                            <ol>
                                <li>En la pestaña de navegación lateral, clica en "Gestionar Perfiles".</li>
                                <li>Clica en el botón "Añadir", en lo alto de la lista de perfiles.</li>
                                <li>Introduce los datos del nuevo perfil y elige "Volver a Perfiles".</li>
                            </ol>

                            <h4>Editar un perfil existente</h4>
                            <ol>
                                <li>En la pestaña de navegación lateral, clica en el perfil que quieras editar.</li>
                                <li>Actualiza los datos que desees.</li>
                                <li>Clica "Volver a Perfiles" para guardar los cambios.</li>
                            </ol>

                            <h4>Eliminar un perfil</h4>
                            <ol>
                                <li>En la pestaña de navegación lateral, clica en el perfil que quieras eliminar.</li>
                                <li>Clica en el botón eliminar.</li>
                                <li>Aparecerá un mensaje de confirmación. Asegúrate que es el perfil correcto y clica "Eliminar".</li>
                            </ol>
                        </div>

                        <h3>Preguntas</h3>

                        <div className="help-subcontainer">
                            <h4>Crear una nueva pregunta</h4>
                            <ol>
                                <li>En la pestaña de navegación lateral, clica en "Gestionar Preguntas".</li>
                                <li>Clica en el botón "Añadir", en lo alto de la lista de preguntas.</li>
                                <li>Elige las opciones que desees para la nueva pregunta y clica en "Editar Respuestas" o "Gestionar Versiones".</li>
                                <li>Si clicas "Editar Respuestas", navegarás a la página donde se pueden editar la pregunta y las respuestas.</li>
                            </ol>

                            <h4>Editar la información de una pregunta</h4>
                            <ol>
                                <li>En la pestaña de navegación lateral, clica en la pregunta que quieras editar.</li>
                                <li>Actualiza los datos que desees.</li>
                                <li>Clica en "Editar Respuestas" o "Gestionar Versiones", según lo que quieras editar a continuación.</li>
                            </ol>

                            <h4>Editar las respuestas de una pregunta</h4>
                            <ol>
                                <li>En la pestaña de navegación lateral, clica en la pregunta que quieras editar.</li>
                                <li>Clica en "Editar Respuestas".</li>
                                <li>Edita las respuestas que desees.</li>
                                <li>Clica en "Guardar Cambios".</li>
                            </ol>

                            <h4>Eliminar una pregunta</h4>
                            <ol>
                                <li>En la pestaña de navegación lateral, clica en la pregunta que quieras eliminar.</li>
                                <li>Clica en "Eliminar"</li>
                                <li>Aparecerá un mensaje de confirmación. Asegúrate que es la pregunta correcta y clica "Eliminar".</li>
                            </ol>
                        </div>

                        <h3>Versiones</h3>

                        <div className="help-subcontainer">
                            <h4>Crear una nueva versión para una pregunta</h4>
                            <ol>
                                <li>En la pestaña de navegación lateral, clica en la pregunta a la que quieras añadir una versión.</li>
                                <li>Clica en el botón "Gestionar Versiones".</li>
                                <li>Clica en el botón "Añadir", en lo alto de la lista de versiones.</li>
                                <li>Introduce los datos de la nueva versión, elige los perfiles a los que quieres que se aplique y clica en "Continuar a Respuestas".</li>
                                <li>Cambia la pregunta y las respuestas por defecto para que se ajusten al perfil escogido.</li>
                            </ol>

                            <h4>Editar la información de una versión</h4>
                            <ol>
                                <li>En la pestaña de navegación lateral, clica en la pregunta a la que pertenezca la versión.</li>
                                <li>Clica en el botón "Gestionar Versiones".</li>
                                <li>Busca la versión que quieras editar y clica en "Editar Información".</li>
                                <li>Actualiza los datos que desees.</li>
                                <li>Clica en "Continuar a Respuestas" para guardar los cambios.</li>
                            </ol>

                            <h4>Editar las respuestas de una versión</h4>
                            <ol>
                                <li>En la pestaña de navegación lateral, clica en la pregunta a la que pertenezca la versión.</li>
                                <li>Clica en el botón "Gestionar Versiones".</li>
                                <li>Busca la versión que quieras editar y clica en "Editar Respuestas".</li>
                                <li>Actualiza las respuestas que desees.</li>
                                <li>Clica en "Guardar Cambios".</li>
                            </ol>

                            <h4>Eliminar una versión</h4>
                            <ol>
                                <li>En la pestaña de navegación lateral, clica en la pregunta a la que pertenezca la versión.</li>
                                <li>Clica en el botón "Gestionar Versiones".</li>
                                <li>Busca la versión que quieras eliminar y clica en "Eliminar".</li>
                                <li>Aparecerá un mensaje de confirmación. Asegúrate que es la versión correcta y clica "Eliminar".</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </PageTemplate>
        </main>
    </>;
}

export default Help;