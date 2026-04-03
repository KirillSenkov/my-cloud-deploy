import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './AdminUserDeleteModal.css';

export type Props = {
  isOpen: boolean;
  username: string;
  isBusy: boolean;
  error: string | null;

  onClose: () => void;
  onConfirm: (deleteFiles: boolean) => void;
};

export default function AdminUserDeleteModal({
  isOpen,
  username,
  isBusy,
  error,
  onClose,
  onConfirm,
}: Props) {
  const { t } = useTranslation();
  const [deleteFiles, setDeleteFiles] = useState(true);

  useEffect(() => {
    if (isOpen) setDeleteFiles(true);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='adminUserDeleteModal' role='dialog' aria-modal='true'>
      <button
        className='adminUserDeleteModal__backdrop'
        type='button'
        aria-label={t('adminUserDeleteModal.close')}
        onClick={onClose}
        disabled={isBusy}
      />

      <div className='adminUserDeleteModal__panel'>
        <div className='adminUserDeleteModal__title'>{t('adminUserDeleteModal.title')}</div>

        <div className='adminUserDeleteModal__text'>
          {t('adminUserDeleteModal.text')}
          <span className='adminUserDeleteModal__username'> {username}</span>?
        </div>

        <label className='adminUserDeleteModal__check'>
          <input
            type='checkbox'
            checked={deleteFiles}
            onChange={(e) => setDeleteFiles(e.target.checked)}
            disabled={isBusy}
          />
          <span>{t('adminUserDeleteModal.deleteFiles')}</span>
        </label>

        <div className='adminUserDeleteModal__warning'>{t('adminUserDeleteModal.warning')}</div>

        {error ? <div className='adminUserDeleteModal__error'>{error}</div> : null}

        <div className='adminUserDeleteModal__actions'>
          <button
            className='adminUserDeleteModal__btn'
            type='button'
            onClick={onClose}
            disabled={isBusy}
          >
            {t('adminUserDeleteModal.cancel')}
          </button>

          <button
            className='adminUserDeleteModal__btn adminUserDeleteModal__btn--danger'
            type='button'
            onClick={() => onConfirm(deleteFiles)}
            disabled={isBusy}
          >
            {isBusy ? t('adminUserDeleteModal.loading') : t('adminUserDeleteModal.submit')}
          </button>
        </div>
      </div>
    </div>
  );
}
