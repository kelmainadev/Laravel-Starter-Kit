import AuthenticatedLayout from './AuthenticatedLayout';

export default function AppLayout({ children }) {
    return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
} 