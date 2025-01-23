import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { UserProvider } from './contexts/UserContext';
import RouteGuard from './components/guards/RouteGuard';
import { routes, publicRoutes } from './routes/routes';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import Layout from './components/Layout/Layout';
import { LayoutProvider } from './context/LayoutContext';
import './styles/theme.css';

function App() {
  return (
    <UserProvider>
    <LayoutProvider>
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          {publicRoutes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={<Component />}
            />
          ))}

          {/* Protected Routes with Layout */}
          <Route element={<Layout />}>
            {routes.map(({ path, component: Component, allowedRoles }) => (
              <Route
                key={path}
                path={path}
                element={
                  <RouteGuard allowedRoles={allowedRoles}>
                    <Component />
                  </RouteGuard>
                }
              />
            ))}
          </Route>
        </Routes>
      </Suspense>
      </Router>
    </LayoutProvider>
    </UserProvider>

  );
}

export default App;
