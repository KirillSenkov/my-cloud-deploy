import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './LoginPage.css'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { login, resetAuthError } from '../../features/auth/authSlice'
import {
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
} from '../../features/auth/selectors'

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation()

  useEffect(() => {
    dispatch(resetAuthError());
  }, [dispatch]);

  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(resetAuthError());

    await dispatch(
      login({
        username: username.trim(),
        password: password,
      })
    );
  };

  const isLoading = status === 'loading';

  return (
    <div className='login'>
      <h1 className='login__title'>{t('login.title')}</h1>

      <form className='login__form' onSubmit={onSubmit}>
        <label className='login__label'>
          {t('login.username')}
          <input
            className='login__input'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete='username'
          />
        </label>

        <label className='login__label'>
          {t('login.password')}
          <input
            className='login__input'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='current-password'
          />
        </label>

        <button className='login__button' type='submit' disabled={isLoading}>
          {isLoading ? t('login.loading') : t('login.submit')}
        </button>

        <div className="login__info">
          <p className="login__infoText">
            <strong>My Cloud</strong> {t('login.infoLead')}
          </p>
          <ul className="login__infoList">
            <li>— {t('login.item1')}</li>
            <li>— {t('login.item2')}</li>
            <li>— {t('login.item3')}</li>
          </ul>
          <p className="login__infoHint">
            {t('login.noAccount')}{' '}
            <Link className='login__regLink' to='/register'>
              {t('login.registerLink')}
            </Link>{' '}
            {t('login.noAccountTail')}
          </p>
        </div>

        {error && <div className='login__error'>{error}</div>}
      </form>
    </div>
  );
}
