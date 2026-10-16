import { createElement, type ComponentType, useEffect } from "react";
import AuthRequests from "../../fetch/AuthRequests";

interface ProtectedRouteProps {
    element: ComponentType;
    props?: Record<string, unknown>;
}

const ProtectedRoute = ({ element: Element, props }: ProtectedRouteProps) => {
    const isAuthenticated = AuthRequests.isAuthenticated();

    useEffect(() => {
        if (!isAuthenticated) {
            window.location.replace("/login");
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return null;
    }

    return createElement(Element, props);
};

export default ProtectedRoute;