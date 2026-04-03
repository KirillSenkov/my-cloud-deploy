import { useMemo, useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './RegisterPage.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { register, resetAuthError } from '../../features/auth/authSlice';
import { selectAuthError, selectAuthStatus } from '../../features/auth/selectors';

type FieldErrors = Record<string, string[]>;

function validate(values: {
  username: string,
  full_name: string,
  email: string,
  password: string,
}, t: (key: string) => string): FieldErrors {
  const errors: FieldErrors = {};

  const username = values.username.trim();
  const fullName = values.full_name.trim();
  const email = values.email.trim();
  const password = values.password;

  if (!username) {
    errors.username = [t('register.errors.usernameRequired')];
  } else if (!/^[A-Za-z][A-Za-z0-9]{3,19}$/.test(username)) {
    errors.username = [t('register.errors.usernameFormat')];
  }

  if (!fullName) {
    errors.full_name = [t('register.errors.fullNameRequired')];
  }

  if (!email) {
    errors.email = [t('register.errors.emailRequired')];
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    errors.email = [t('register.errors.emailFormat')];
  }

  const pwErrors: string[] = [];

  if (!password) {
    pwErrors.push(t('register.errors.passwordRequired'));
  } else {
    if (password.length < 6) pwErrors.push(t('register.errors.passwordLength'));
    if (!/[A-Z]/.test(password)) pwErrors.push(t('register.errors.passwordUppercase'));
    if (!/\d/.test(password)) pwErrors.push(t('register.errors.passwordDigit'));
    if (!/[^A-Za-z0-9]/.test(password)) pwErrors.push(t('register.errors.passwordSpecial'));
  }

  if (pwErrors.length) {
    errors.password = pwErrors;
  }

  return errors;
}

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(resetAuthError());
  }, [dispatch]);

  const status = useAppSelector(selectAuthStatus);
  const apiError = useAppSelector(selectAuthError);

  const [username, setUsername] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const localErrors = useMemo(() => {
    return validate({
      username,
      full_name: fullName,
      email,
      password,
    }, t);
  }, [username, fullName, email, password, t]);

  const isLoading = status === 'loading';
  const hasLocalErrors = Object.keys(localErrors).length > 0;

  const renderFieldErrors = (errs: FieldErrors, key: string) => {
    const list = errs[key];

    if (!list || list.length === 0) {
      return null;
    }

    return (
      <ul className='register__errors'>
        {list.map((msg, idx) => (
          <li className='register__error' key={`${key}-${idx}`}>
            {msg}
          </li>
        ))}
      </ul>
    );
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(resetAuthError());

    const action = await dispatch(register({
      username: username.trim(),
      full_name: fullName.trim(),
      email: email.trim(),
      password: password,
    }));

    if (register.fulfilled.match(action)) {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className='register'>
      <h1 className='register__title'>{t('register.title')}</h1>

      <form className='register__form' onSubmit={onSubmit}>
        <label className='register__label'>
          {t('register.username')}
          <input
            className='register__input'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete='username'
          />
        </label>
        {renderFieldErrors(localErrors, 'username')}

        <label className='register__label'>
          {t('register.fullName')}
          <input
            className='register__input'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete='name'
          />
        </label>
        {renderFieldErrors(localErrors, 'full_name')}

        <label className='register__label'>
          {t('register.email')}
          <input
            className='register__input'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete='email'
          />
        </label>
        {renderFieldErrors(localErrors, 'email')}

        <label className='register__label'>
          {t('register.password')}
          <input
            className='register__input'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='new-password'
          />
        </label>
        {renderFieldErrors(localErrors, 'password')}

        <button className='register__button' type='submit' disabled={isLoading || hasLocalErrors}>
          {isLoading ? t('register.loading') : t('register.submit')}
        </button>

        {apiError && <div className='register__apiError'>{apiError}</div>}
      </form>
    </div>
  );
}
