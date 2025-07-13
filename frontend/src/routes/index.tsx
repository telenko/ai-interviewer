import { createFileRoute } from '@tanstack/react-router';
import '../App.css';
import { Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: () => <Navigate to="/vacancies" />,
});
