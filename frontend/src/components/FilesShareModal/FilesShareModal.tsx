import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './FilesShareModal.css';
import type { FileDTO, Status } from '../../features/types';

type FilesShareModalProps = {
  file: FileDTO | null;
  status: Status;
  error: string | null;

  onClose: () => void;
  onEnable: () => Promise<void>;
  onDisable: () => Promise<void>;
};

export default function FilesShareModal({
  file,
  status,
  error,

  onClose,
  onEnable,
  onDisable,
}: FilesShareModalProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  if (!file) return null;

  const isBusy = status === 'loading';
  const isEnabled = Boolean(file.share_url);

  const copy = async () => {
    if (!file.share_url) return;

    try {
      await navigator.clipboard.writeText(file.share_url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    }
    catch (err) {
      console.warn('Clipboard copy failed', err);
    }
  };

  return (
    <div className='filesShareModal' role='dialog' aria-modal='true'>
      <button
        className='filesShareModal__backdrop'
        type='button'
        aria-label={t('filesShareModal.close')}
        onClick={onClose}
        disabled={isBusy}
      />

      <div className='filesShareModal__panel'>
        <div className='filesShareModal__title'>{t('filesShareModal.title')}</div>

        <div className='filesShareModal__hint'>
          {t('filesShareModal.file')} <span className='filesShareModal__file'>{file.original_name}</span>
        </div>

        <div className='filesShareModal__field'>
          <div className='filesShareModal__label'>{t('filesShareModal.link')}</div>

          <div className='filesShareModal__row'>
            <input
              className='filesShareModal__input'
              value={file.share_url ?? ''}
              readOnly
              placeholder={isEnabled ? '' : t('filesShareModal.placeholder')}
            />

            <div className='filesShareModal__copyWrap'>
              <button
                className='filesShareModal__copyBtn'
                type='button'
                title={isEnabled ? t('filesShareModal.copy') : t('filesShareModal.copyDisabled')}
                onClick={copy}
                disabled={!isEnabled || isBusy}
              >
                ⧉
              </button>

              {copied && (
                <div className='filesShareModal__toast' role='status' aria-live='polite'>
                  {t('filesShareModal.copied')}
                </div>
              )}
            </div>
          </div>

          {isEnabled && file.share_created && (
            <div className='filesShareModal__meta'>
              {t('filesShareModal.created', { date: new Date(file.share_created).toLocaleString() })}
            </div>
          )}
        </div>

        {status === 'failed' && error && (
          <div className='filesShareModal__error'>{error}</div>
        )}

        <div className='filesShareModal__actions'>
          {isEnabled ? (
            <>
              <button
                className='filesShareModal__btn'
                type='button'
                onClick={onClose}
                disabled={isBusy}
              >
                {t('filesShareModal.close')}
              </button>

              <button
                className='filesShareModal__btn filesShareModal__btn--danger'
                type='button'
                onClick={onDisable}
                disabled={isBusy}
              >
                {isBusy ? t('filesShareModal.disabling') : t('filesShareModal.disable')}
              </button>
            </>
          ) : (
            <>
              <button
                className='filesShareModal__btn'
                type='button'
                onClick={onClose}
                disabled={isBusy}
              >
                {t('filesShareModal.cancel')}
              </button>

              <button
                className='filesShareModal__btn filesShareModal__btn--primary'
                type='button'
                onClick={onEnable}
                disabled={isBusy}
              >
                {isBusy ? t('filesShareModal.creating') : t('filesShareModal.create')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
