import { User } from "firebase/auth";
import { useState, useEffect } from "react";
import { OnAuthStateChanged } from "../repositories/auth";
import { NavBar } from "../components/navigation/navbar";
import { PageTemplate } from "../components/editPageTemplate";

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
                        <li><strong>Barra de navegación.</strong> En esta barra aparecen atajos a diversas páginas. Siempre contiene un enlace a esta ayuda, a la lista de encuesta. Si se está editando una encuesta también aparecerá el nombre de la encuesta, que lleva a la ventana de edición de la información de la encuesta, y atajos a las listas de preguntas y perfiles. Además, si se está editando una pregunta, o una versión de una pregunta, aparecerán atajos a la página de edición de la pregunta y a la lista de perfiles.</li>
                        <li><strong>Pestaña lateral de navegación.</strong> En esta pestaña aparecen las preguntas y los perfiles que existen actualmente en la aplicación. Clicar en cada elemento navega hasta la ventana de edición del respectivo elemento. Cuando se edita un perfil o una pregunta, estos aparecen resaltados con un borde más grueso y de color negro. Además, si se edita una versión, aparecerán resaltados los perfiles a los que afecta, de manera más sútil.</li>
                    </ol>

                    <h2>Crear una nueva encuesta</h2>
                    <ol>
                        <li>Inicia sesión.</li>
                        <li>Navega a la lista de encuestas.</li>
                        <li>Clica en el botón "Crear Nueva".</li>
                        <li>Introduce los datos de la nueva encuesta y elige "Continuar a Perfiles" o "Continuar a Preguntas", según lo que quieras editar a continuación.</li>
                    </ol>

                    <h2>Crear un nuevo perfil</h2>
                    <ol>
                        <li>En la pestaña de navegación lateral, clica en "Gestionar Perfiles".</li>
                        <li>Clica en el botón "Añadir", en lo alto de la lista de perfiles.</li>
                        <li>Introduce los datos del nuevo perfil y elige "Volver a Perfiles".</li>
                    </ol>

                    <h2>Crear una nueva pregunta</h2>
                    <ol>
                        <li>En la pestaña de navegación lateral, clica en "Gestionar Preguntas".</li>
                        <li>Clica en el botón "Añadir", en lo alto de la lista de preguntas.</li>
                        <li>Elige las opciones que desees para la nueva pregunta y clica en "Editar Respuestas" o "Gestionar Versiones".</li>
                        <li>Si clicas "Editar Respuestas", navegarás a la página donde se pueden editar la pregunta y las respuestas.</li>
                    </ol>

                    <h2>Crear una nueva versión para una pregunta</h2>
                    <ol>
                        <li>En la pestaña de navegación lateral, clica en la pregunta a la que quieras añadir una versión.</li>
                        <li>Clica en el botón "Gestionar Versiones".</li>
                        <li>Clica en el botón "Añadir", en lo alto de la lista de versiones.</li>
                        <li>Introduce los datos de la nueva versión, elige los perfiles a los que quieres que se aplique y clica en "Continuar a Respuestas".</li>
                        <li>Cambia la pregunta y las respuestas por defecto para que se ajusten al perfil escogido.</li>
                    </ol>
                </div>
            </PageTemplate>
        </main>
    </>;
}

export default Help;