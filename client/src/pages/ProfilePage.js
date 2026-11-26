import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/', { replace: true });
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Mi perfil</p>
        <h1>{user?.nombre}</h1>

        <dl className="profile-details">
          <div>
            <dt>Email</dt>
            <dd>{user?.email}</dd>
          </div>
          <div>
            <dt>Tipo de cuenta</dt>
            <dd>{isAdmin ? 'Administrador' : 'Cliente'}</dd>
          </div>
        </dl>

        <div className="profile-actions">
          {isAdmin && (
            <Link className="button button--secondary" to="/admin">
              Ir a administración
            </Link>
          )}
          <button type="button" className="link-button link-button--danger" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
