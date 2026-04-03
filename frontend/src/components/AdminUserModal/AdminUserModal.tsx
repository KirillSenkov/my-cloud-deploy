import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './AdminUserModal.css';
import type { AdminUserDTO, UserLevel, UserRank } from '../../api/types';
import { humanizeLevel, formatBytes , ALL_LEVELS, LEVEL_TO_RANK } from '../../utils/utils';

export type AdminUserModalUser = Pick<
  AdminUserDTO,
  ('id' | 'username' | 'fullName' | 'email' | 'level'
  | 'rank' | 'storageRelPath' | 'filesCount' | 'totalStorageBytes')
>;

type Props = {
  user: AdminUserModalUser | null;
  isOpen: boolean;
  actorLevel: UserLevel;
  actorRank: UserRank;
  isChangingLevel: boolean;
  isDeleting: boolean;
  changeLevelError: string | null;
  deleteError: string | null;

  onClose: () => void;

  onGoToFiles: (userId: number) => void;
  onChangeLevel: (userId: number, level: UserLevel) => void;
  onDeleteRequest: (userId: number) => void;
};

function canActorChangeLevel(actorRank: UserRank, targetRank: UserRank, newRank: UserRank): boolean {
  if (newRank === targetRank) return false;

  if (actorRank === 0) return true;

  if (actorRank === 1) {
    return Math.min(targetRank, newRank) > 1;
  }

  return false;
}

export default function AdminUserModal({
  user,
  isOpen,

  //actorLevel,
  actorRank,

  isChangingLevel,
  isDeleting,
  changeLevelError,
  deleteError,

  onClose,
  onGoToFiles,
  onChangeLevel,
  onDeleteRequest,
}: Props) {
  const { t } = useTranslation();
  const [nextLevel, setNextLevel] = useState<UserLevel | ''>('');

  // useEffect(() => {
  //   if (!isOpen || !user) return;

  //   setNextLevel('');
  // }, [isOpen, user?.id, user?.level]);

  const isBusy = isChangingLevel || isDeleting;

  const levelOptions = useMemo(() => {
    if (!user) return [];

    const allPermittedLevels = ALL_LEVELS.filter((lvl) =>
      lvl !== user.level 
      && canActorChangeLevel(actorRank, user.rank, LEVEL_TO_RANK[lvl])
    );

    return allPermittedLevels;
  }, [actorRank, user]);

  const canChangeLevelAny = useMemo(() => {
    if (!user) return false;

    return levelOptions.some((lvl) => LEVEL_TO_RANK[lvl] !== user.rank && canActorChangeLevel(actorRank, user.rank, LEVEL_TO_RANK[lvl]));
  }, [levelOptions, actorRank, user]);

  const canApplyLevel = useMemo(() => {
    if (!user) return false;

    return canActorChangeLevel(actorRank, user.rank, LEVEL_TO_RANK[nextLevel as UserLevel]);
  }, [actorRank, user, nextLevel]);

  if (!isOpen || !user) return null;

  return (
    <div className='adminUserModal' role='dialog' aria-modal='true'>
      <div className='adminUserModal__backdrop' aria-hidden='true' />

      <div className='adminUserModal__panel'>
        <div className='adminUserModal__titleRow'>
          <div className='adminUserModal__title'>{t('adminUserModal.title')}</div>

          <button
            className='adminUserModal__closeBtn'
            type='button'
            onClick={onClose}
            disabled={isBusy}
            aria-label={t('adminUserModal.close')}
            title={t('adminUserModal.close')}
          >
            ✕
          </button>
        </div>

        <div className='adminUserModal__username'>{user.username}</div>

        <div className='adminUserModal__section'>
          <div className='adminUserModal__line'>
            <span className='adminUserModal__label'>{t('adminUserModal.fullName')}</span>
            <span className='adminUserModal__value'>{user.fullName}</span>
          </div>

          <div className='adminUserModal__line'>
            <span className='adminUserModal__label'>E-mail</span>
            <a className='adminUserModal__link' href={`mailto:${user.email}`}>
              {user.email}
            </a>
          </div>

          {'storageRelPath' in user && user.storageRelPath ? (
            <div className='adminUserModal__line'>
              <span className='adminUserModal__label'>{t('adminUserModal.storage')}</span>
              <span className='adminUserModal__value adminUserModal__mono'>{user.storageRelPath}</span>
            </div>
          ) : null}

          {'filesCount' in user ? (
            <div className='adminUserModal__line'>
              <span className='adminUserModal__label'>{t('adminUserModal.files')}</span>
              <span className='adminUserModal__value'>
                <strong>{user.filesCount}</strong>
              </span>
            </div>
          ) : null}

          {'totalStorageBytes' in user ? (
            <div className='adminUserModal__line'>
              <span className='adminUserModal__label'>{t('adminUserModal.storageSize')}</span>
              <span className='adminUserModal__value'>
                <strong>{formatBytes(user.totalStorageBytes)}</strong>
              </span>
            </div>
          ) : null}
        </div>

        <div className='adminUserModal__section'>
          <div className='adminUserModal__line'>
            <span className='adminUserModal__label'>{t('adminUserModal.currentLevel')}</span>
            <span className='adminUserModal__value'>
              <strong>{humanizeLevel(user.level)}</strong>
            </span>
          </div>

          {canChangeLevelAny ? (
            <div className='adminUserModal__levelRow'>
              <select
                className='adminUserModal__select'
                value={nextLevel}
                onChange={(e) => setNextLevel(e.target.value as UserLevel)}
                disabled={isBusy}
              >
                <option value="" disabled>
                  {t('adminUserModal.selectLevel')}
                </option>
                
                {levelOptions.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {humanizeLevel(lvl)}
                  </option>
                ))}
              </select>

              <button
                className='adminUserModal__btn adminUserModal__btn--primary'
                type='button'
                onClick={() => onChangeLevel(user.id, nextLevel as UserLevel)}
                disabled={!canApplyLevel || isBusy}
                title={!canApplyLevel ? t('adminUserModal.applyDisabled') : t('filesEditModal.submit')}
              >
                {isChangingLevel ? t('adminUserModal.applying') : t('adminUserModal.apply')}
              </button>
            </div>
          ) : (
            <div className='adminUserModal__hint'>
              {t('adminUserModal.noRights')}
            </div>
          )}

          {changeLevelError ? (
            <div className='adminUserModal__error' role='alert'>
              {changeLevelError}
            </div>
          ) : null}
        </div>

        <div className='adminUserModal__actions'>
          <button
            className='adminUserModal__btn'
            type='button'
            onClick={() => onGoToFiles(user.id)}
            disabled={isBusy}
          >
            {t('adminUserModal.fileList')}
          </button>

          <button
            className='adminUserModal__btn adminUserModal__btn--danger'
            type='button'
            onClick={() => onDeleteRequest(user.id)}
            disabled={isBusy}
          >
            {t('adminUserModal.deleteUser')}
          </button>

          {deleteError ? (
            <div className='adminUserModal__error adminUserModal__error--inline' role='alert'>
              {deleteError}
            </div>
          ) : null}
        </div>

        <div className='adminUserModal__footer'>
          <button className='adminUserModal__btn' type='button' onClick={onClose} disabled={isBusy}>
            {t('adminUserModal.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
