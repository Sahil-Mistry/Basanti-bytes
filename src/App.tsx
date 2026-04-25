import { Navigate, Route, Routes } from 'react-router-dom';
import About from './pages/About';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import WorkspaceLayout from './pages/WorkspaceLayout';
import PropertyExplorer from './components/PropertyExplorer';
import NeighborhoodIntel from './components/NeighborhoodIntel';
import RemoteMonitor from './components/RemoteMonitor';
import TrustVault from './components/TrustVault';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/property-explorer" replace />} />

      <Route element={<WorkspaceLayout />}>
        <Route path="/property-explorer" element={<PropertyExplorer />} />
        <Route path="/neighborhood-intel" element={<NeighborhoodIntel />} />
        <Route path="/remote-monitor" element={<RemoteMonitor />} />
        <Route path="/trust-vault" element={<TrustVault />} />
      </Route>

      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/property-explorer" replace />} />
    </Routes>
  );
}
