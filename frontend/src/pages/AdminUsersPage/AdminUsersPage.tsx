import { useEffect, useMemo, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './AdminUsersPage.css';

import { useAppDispatch, useAppSelector } from '../../app/hooks';

import { selectAuthUser, selectIsAuthenticated } from '../../features/auth/selectors';

import {
  selectFetchStatus,
  selectFetchError,
  selectAdminUsersItems,
 } from '../../features/adminUsers/selectors';

import {
  fetchUsers,
  clearUsersErrors,
} from '../../features/adminUsers/adminUsersSlice';

import type { AdminUserDTO } from '../../api/types';
import { humanizeLevel, formatBytes } from '../../utils/utils';

import UserBadge, { type UserInfo }  from '../../components/UserBadge/UserBadge';
import useAdminUserModals from '../../features/adminUsers/useAdminUserModals';
import AdminUserModal from '../../components/AdminUserModal/AdminUserModal';
import AdminUserDeleteModal from '../../components/AdminUserDeleteModal/AdminUserDeleteModal';

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const actorUser = useAppSelector(selectAuthUser);
  const users = useAppSelector(selectAdminUsersItems);

  const fetchStatus = useAppSelector(selectFetchStatus);
  const fetchError = useAppSelector(selectFetchError);

  const isAdmin = Boolean(actorUser?.is_admin);

  useEffect(() => {
    dispatch(fetchUsers());

    return () => {
      dispatch(clearUsersErrors());
    };
  }, [dispatch]);

  const goToFiles = useCallback((userId: number) => {
    navigate(`/?userId=${userId}`);
  }, [navigate]);

  const { openUserModal, userModalProps, deleteModalProps } = useAdminUserModals({
    onGoToFiles: goToFiles,
  });

  const list = useMemo(() => {
    return users.map((u: AdminUserDTO, idx) => {
      const badgeUser: UserInfo = {
        id: u.id,
        username: u.username,
        fullName: u.fullName,
        email: u.email,
      };

      return (
        <li key={u.id} className='adminUsers__row adminUsersGrid'>
          <div className='adminUsers__num'>{idx + 1}</div>

          <div className='adminUsers__user'>
            <UserBadge
              user={badgeUser}
              onUsernameClick={() => openUserModal(u.id)}
            />
          </div>

          <div className='adminUsers__meta'>{humanizeLevel(u.level)}</div>
          <div className='adminUsers__meta'>{u.filesCount}</div>
          <div className='adminUsers__meta'>{formatBytes(u.totalStorageBytes)}</div>
        </li>
      );
    });
  }, [users, openUserModal]);

  if (!isAdmin) {
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return <Navigate to="/" replace />;
  }

  return (
    <div className='adminUsers'>
      <div className='adminUsers__topBar'>
        <h1 className='adminUsers__title'>{t('adminUsers.title')}</h1>
      </div>

      {fetchStatus === 'failed' && fetchError && (
        <div className='adminUsers__error' role='alert'>
          {fetchError}
        </div>
      )}

      {fetchStatus === 'loading' && (
        <div className='adminUsers__hint'>{t('adminUsers.loading')}</div>
      )}

      <AdminUserModal {...userModalProps} />

      <AdminUserDeleteModal {...deleteModalProps} />

      {fetchStatus === 'succeeded' && (
        <div className='adminUsers__box'>
          <div className='adminUsers__header adminUsersGrid'>
            <div className='adminUsers__h adminUsers__hNum'>#</div>
            <div className='adminUsers__h'>{t('adminUsers.headerUser')}</div>
            <div className='adminUsers__h adminUsers__metaHeader'>{t('adminUsers.headerLevel')}</div>
            <div className='adminUsers__h adminUsers__metaHeader'>{t('adminUsers.headerFiles')}</div>
            <div className='adminUsers__h adminUsers__metaHeader'>{t('adminUsers.headerStorage')}</div>
          </div>

          <ol className='adminUsers__list'>{list}</ol>
        </div>
      )}
    </div>
  );
}
