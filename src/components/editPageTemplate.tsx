interface EditPageTemplateProps {
    Title: string,
}

export function PageTemplate(props: React.PropsWithChildren<EditPageTemplateProps>) {
    return <>
        <h1>{props.Title}</h1>
        <hr style={{border: "2px solid"}}></hr>
        {props.children}
    </>;
}