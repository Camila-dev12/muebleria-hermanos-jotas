import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <section className="auth-page">
        <p className="catalog-message" aria-busy="true">
          Verificando sesión…
        </p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && user?.rol !== requiredRole) {
    return (
      <section className="auth-page">
        <div className="catalog-message catalog-message--error" role="alert">
          <h1>Acceso restringido</h1>
          <p>No tenés permisos para ingresar a esta sección.</p>
          <Link className="button" to="/">
            Volver al inicio
          </Link>
        </div>
      </section>
    );
  }

  return children;
}

export default ProtectedRoute;
