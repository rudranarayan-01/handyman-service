import { withAuthenticationRequired } from '@auth0/auth0-react';

export const ProtectedRoute = ({ component }: { component: React.ComponentType }) => {
    const Component = withAuthenticationRequired(component, {
        onRedirecting: () => <div className="h-screen flex items-center justify-center font-black uppercase tracking-tighter text-4xl">Loading...</div>,
    });

    return <Component />;
};