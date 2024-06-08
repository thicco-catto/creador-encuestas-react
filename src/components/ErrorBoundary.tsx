import React, { ReactNode, useState, useEffect } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
    const [hasError, setHasError] = useState(false);

    const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
        console.error("Uncaught error:", error, errorInfo);
        setHasError(true);
    };

    useEffect(() => {
        const errorHandler = (event: ErrorEvent) => {
            handleError(event.error, { componentStack: "" });
        };

        window.addEventListener("error", errorHandler);

        return () => {
            window.removeEventListener("error", errorHandler);
        };
    }, []);

    if (hasError) {
        return <h1>Something went wrong.</h1>;
    }

    return <>{children}</>;
};

export default ErrorBoundary;