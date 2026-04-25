import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';

export default function WorkspaceLayout() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navigation />
      <Outlet />
    </div>
  );
}
