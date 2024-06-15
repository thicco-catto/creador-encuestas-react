import { GetCurrentUser } from "./auth";

const backendUri = process.env["REACT_APP_BACKEND_URL"] as string;
if (!backendUri) {
    console.log("You need to specify REACT_APP_BACKEND_URL in .env");
}

export async function Get(path: string) {
    try {
        const response = await fetch(backendUri + path);

        if(response.status < 200 || response.status > 299) {
            return;
        }

        const jsonResponse = await response.json();

        return jsonResponse;
    } catch {
        return;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function Post(path: string, data: any) {
    try {
        const response = await fetch(backendUri + path, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data)
        });

        if(response.status < 200 || response.status > 299) {
            return;
        }

        const jsonResponse = await response.json();

        return jsonResponse;
    } catch {
        return;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function Put(path: string, data: any) {
    try {
        const token = GetCurrentUser()?.getIdToken() ?? "";

        const response = await fetch(backendUri + path, {
            method: "PUT",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data)
        });

        if(response.status < 200 || response.status > 299) {
            return;
        }

        const jsonResponse = await response.json();

        return jsonResponse;
    } catch {
        return;
    }
}

export async function Delete(path: string) {
    try {
        const response = await fetch(backendUri + path, {
            method: "DELETE",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        });

        if(response.status < 200 || response.status > 299) {
            return;
        }

        const jsonResponse = await response.json();

        return jsonResponse;
    } catch {
        return;
    }
}