import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'
import './NavBar.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { selectAuthUser, selectIsAuthenticated } from '../../features/auth/selectors';

export default function NavBar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation()

  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const isAdmin = Boolean(user?.is_admin);
  const isInAdmin = location.pathname.startsWith('/admin');

  const onLogoutClick = async () => {
    const action = await dispatch(logout());
    if (logout.fulfilled.match(action)) {
      navigate('/login');
    }
  };

  const setLanguage = (lang: 'en' | 'ru') => {
    void i18n.changeLanguage(lang)
  }

  const currentLang = i18n.resolvedLanguage?.startsWith('ru') ? 'ru' : 'en'

  return (
    <header className='nav'>
      <div className='nav__inner'>
        <div className='nav__left'>
          <Link className='nav__brand' to='/'>
            My Cloud
          </Link>

          {isAuthenticated && isAdmin && (
            <Link
              className={`nav__adminBtn ${isInAdmin ? 'nav__adminBtn--active' : ''}`}
              to={isInAdmin ? '/' : '/admin/users'}
              title={isInAdmin ? t('nav.backToFiles') : t('nav.goToAdmin')}
            >
              {isInAdmin ? t('nav.leaveAdmin') : t('nav.admin')}
            </Link>
          )}
        </div>

        <div className='nav__meta'>
          <nav className='nav__right'>
            {!isAuthenticated && (
              <>
                <Link className='nav__link' to='/login'>{t('nav.login')}</Link>
                <Link className='nav__link' to='/register'>{t('nav.register')}</Link>
              </>
            )}

            {isAuthenticated && (
              <>
                <span className='nav__user'>{user?.username}</span>
                <button className='nav__button' type='button' onClick={onLogoutClick}>
                  {t('nav.logout')}
                </button>
              </>
            )}
          </nav>

          <div className='nav__lang' aria-label={t('nav.languageSwitch')}>
            <button
              type='button'
              className={`nav__langBtn ${currentLang === 'en' ? 'is-active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              En
            </button>
            <span className='nav__langSep'>|</span>
            <button
              type='button'
              className={`nav__langBtn ${currentLang === 'ru' ? 'is-active' : ''}`}
              onClick={() => setLanguage('ru')}
            >
              Ru
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
