import './FilesEditModal.css';
import { useTranslation } from 'react-i18next';

type FilesEditModalProps = {
  isOpen: boolean;

  name: string;
  comment: string;

  isBusy: boolean;
  errors: string[];

  onClose: () => void;
  onNameChange: (value: string) => void;
  onCommentChange: (value: string) => void;
  onSubmit: () => void;
};

export default function FilesEditModal({
  isOpen,
  name,
  comment,
  isBusy,
  errors,
  onClose,
  onNameChange,
  onCommentChange,
  onSubmit,
}: FilesEditModalProps) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className='filesEditModal' role='dialog' aria-modal='true'>
      <button
        className='filesEditModal__backdrop'
        type='button'
        aria-label={t('filesEditModal.close')}
        onClick={onClose}
        disabled={isBusy}
      />

      <div className='filesEditModal__panel'>
        <div className='filesEditModal__title'>{t('filesEditModal.title')}</div>

        <label className='filesEditModal__field'>
          <div className='filesEditModal__label'>{t('filesEditModal.fileName')}</div>
          <input
            className='filesEditModal__input'
            type='text'
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            disabled={isBusy}
          />
        </label>

        <label className='filesEditModal__field'>
          <div className='filesEditModal__label'>{t('filesEditModal.comment')}</div>
          <textarea
            className='filesEditModal__textarea'
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            rows={4}
            disabled={isBusy}
          />
        </label>

        {errors.length > 0 && (
          <div className='filesEditModal__error'>
            <div className='filesEditModal__errorTitle'>{t('filesEditModal.errorsTitle')}</div>
            <ul className='filesEditModal__errorList'>
              {errors.map((msg, i) => (
                <li key={`${i}-${msg}`}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <div className='filesEditModal__actions'>
          <button
            className='filesEditModal__btn'
            type='button'
            onClick={onClose}
            disabled={isBusy}
          >
            {t('filesEditModal.cancel')}
          </button>

          <button
            className='filesEditModal__btn filesEditModal__btn--primary'
            type='button'
            onClick={onSubmit}
            disabled={isBusy}
          >
            {isBusy ? t('filesEditModal.loading') : t('filesEditModal.submit')}
          </button>
        </div>
      </div>
    </div>
  );
}
