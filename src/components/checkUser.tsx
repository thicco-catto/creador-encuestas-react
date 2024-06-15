import { PropsWithChildren, useEffect, useState } from "react";
import { OnAuthStateChanged } from "../repositories/auth";
import { Spinner } from "react-bootstrap";

/**
 * Only displays the children if the user is logged in. If there is no user,
 * redirects them to home.
 */
export function CheckUserLoggedIn(props: PropsWithChildren) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        OnAuthStateChanged((user) => {
            if(!user) {
                window.location.href = "/";
            } else {
                setLoading(false);
            }
        });
    }, []);

    return <>
        {
            loading?
            <Spinner></Spinner>
            :
            <>
                {props.children}
            </>
        }
    </>;
}