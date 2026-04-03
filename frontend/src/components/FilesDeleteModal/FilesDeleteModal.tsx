import './FilesDeleteModal.css';
import { useTranslation } from 'react-i18next';

type FilesDeleteModalProps = {
  isOpen: boolean;
  fileName: string;
  isBusy: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

export default function FilesDeleteModal({
  isOpen,
  fileName,
  isBusy,
  error,
  onClose,
  onConfirm,
}: FilesDeleteModalProps) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className='filesDeleteModal' role='dialog' aria-modal='true'>
      <button
        className='filesDeleteModal__backdrop'
        type='button'
        aria-label={t('filesDeleteModal.close')}
        onClick={onClose}
        disabled={isBusy}
      />

      <div className='filesDeleteModal__panel'>
        <div className='filesDeleteModal__title'>{t('filesDeleteModal.title')}</div>

        <div className='filesDeleteModal__text'>
          {t('filesDeleteModal.text')}
          <span className='filesDeleteModal__fileName'> {fileName}</span>?
        </div>

        <div className='filesDeleteModal__warning'>
          {t('filesDeleteModal.warning')}
        </div>

        {error && (
          <div className='filesDeleteModal__error'>{error}</div>
        )}

        <div className='filesDeleteModal__actions'>
          <button
            className='filesDeleteModal__btn'
            type='button'
            onClick={onClose}
            disabled={isBusy}
          >
            {t('filesDeleteModal.cancel')}
          </button>

          <button
            className='filesDeleteModal__btn filesDeleteModal__btn--danger'
            type='button'
            onClick={onConfirm}
            disabled={isBusy}
          >
            {isBusy ? t('filesDeleteModal.loading') : t('filesDeleteModal.submit')}
          </button>
        </div>
      </div>
    </div>
  );
}
