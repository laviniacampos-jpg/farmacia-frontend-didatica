import { type ComponentType } from 'react';
import AuthRequests from '../../fetch/AuthRequests';

interface ProtectedRouteProps {
    element: ComponentType<any>;
    props?: Record<string, unknown>;
}
const ProtectedRoute = ({
    element: Element,
    props,
}: ProtectedRouteProps) => {
    const isAuthenticated = !!(
        localStorage.getItem('isAuth') === 'true' &&
        localStorage.getItem('token') &&
        AuthRequests.checkTokenExpiry()
    );

    if (!isAuthenticated) {
        window.location.replace('/login');
        return null;
    }

    return props ? <Element {...props} /> : <Element />;
};

export default ProtectedRoute;