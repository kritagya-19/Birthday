import React, { useRef, useState } from 'react';
import { Type, ImagePlus, X, RotateCcw, Check, Upload, Images } from 'lucide-react';
import { ColorTheme, THEMES } from '../theme/colorThemes';
import { sounds } from '../utils/audio';
import { readImageFileAsUrl } from '../utils/pageContentStore';

export interface TextFieldConfig<T extends { [K in keyof T]: string }> {
  key: keyof T;
  label: string;
  placeholder?: string;
}

export interface PhotoSlotConfig<K extends string = string> {
  key: K;
  label: string;
  aspectClass?: string;
  fitClass?: 'object-cover' | 'object-contain';
}

interface PageActionButtonsProps {
  onOpenTextEditor: () => void;
  onOpenPhotoEditor?: () => void;
  photoCount?: number;
  theme?: ColorTheme;
}

export const PageActionButtons: React.FC<PageActionButtonsProps> = ({
  onOpenTextEditor,
  onOpenPhotoEditor,
  photoCount,
  theme = THEMES[0],
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          sounds.playPop();
          onOpenTextEditor();
        }}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white font-semibold border shadow-xs transition-all hover:scale-103 active:scale-97 cursor-pointer"
        style={{
          color: theme.accentColor,
          borderColor: theme.borderHeader,
        }}
        title="Edit all text on this page"
      >
        <Type className="w-3.5 h-3.5 shrink-0" />
        <span>Edit Text</span>
      </button>

      {onOpenPhotoEditor && (
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            onOpenPhotoEditor();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold border shadow-xs transition-all hover:scale-103 active:scale-97 cursor-pointer"
          style={{
            backgroundColor: theme.btnBg,
            color: theme.btnText,
            borderColor: theme.accentColor,
            boxShadow: `0 3px 10px ${theme.btnShadow}`,
          }}
          title="Upload or replace photos on this page"
        >
          <ImagePlus className="w-3.5 h-3.5 shrink-0" />
          <span>{photoCount && photoCount > 1 ? `Photos (${photoCount})` : 'Upload Photo'}</span>
        </button>
      )}
    </div>
  );
};

interface PageTextEditorModalProps<T extends { [K in keyof T]: string }> {
  isOpen: boolean;
  onClose: () => void;
  pageTitle: string;
  fields: TextFieldConfig<T>[];
  values: T;
  defaultValues: T;
  onChange: (next: T) => void;
  theme?: ColorTheme;
}

export function PageTextEditorModal<T extends { [K in keyof T]: string }>({
  isOpen,
  onClose,
  pageTitle,
  fields,
  values,
  defaultValues,
  onChange,
  theme = THEMES[0],
}: PageTextEditorModalProps<T>) {
  if (!isOpen) return null;

  const hasChanges = fields.some((f) => values[f.key] !== defaultValues[f.key]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#faf5e8] rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-[#efe6d2] my-auto select-text"
        style={{
          boxShadow: '0 25px 60px -15px rgba(27, 60, 110, 0.38)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-[#e5ddc7]">
          <div className="flex items-center gap-2.5">
            <Type className="w-5 h-5 shrink-0" style={{ color: theme.accentColor }} />
            <h3
              className="font-bubble text-lg sm:text-xl font-black tracking-wide"
              style={{ color: theme.accentColor }}
            >
              Edit Text · {pageTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Close text editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Editable Fields */}
        <div className="mt-4 space-y-3.5">
          {fields.map((field) => {
            const keyStr = String(field.key);
            return (
              <div key={keyStr} className="flex flex-col gap-1">
                <label
                  htmlFor={`text-field-${keyStr}`}
                  className="text-xs font-bold text-slate-700 tracking-wide"
                >
                  {field.label}
                </label>
                <input
                  id={`text-field-${keyStr}`}
                  type="text"
                  value={values[field.key]}
                  placeholder={field.placeholder || defaultValues[field.key]}
                  onChange={(e) =>
                    onChange({
                      ...values,
                      [field.key]: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd5be] text-slate-800 text-sm font-medium shadow-2xs focus:outline-none focus:ring-2 transition-shadow"
                  style={{
                    ['--tw-ring-color' as string]: theme.accentColor,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-3.5 border-t border-[#e5ddc7] flex flex-wrap items-center justify-between gap-3">
          {hasChanges ? (
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onChange({ ...defaultValues });
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-[#dacfb7] shadow-2xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          ) : (
            <span className="text-xs text-slate-500">Changes appear live on the page</span>
          )}

          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-transform hover:scale-103 active:scale-97 cursor-pointer ml-auto"
            style={{
              backgroundColor: theme.btnBg,
              color: theme.btnText,
              boxShadow: `0 4px 12px ${theme.btnShadow}`,
            }}
          >
            <Check className="w-4 h-4" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface PagePhotosModalProps<T extends { [K in keyof T]: string }> {
  isOpen: boolean;
  onClose: () => void;
  pageTitle: string;
  slots: PhotoSlotConfig<Extract<keyof T, string>>[];
  photos: T;
  defaultPhotos: T;
  onChange: (next: T) => void;
  theme?: ColorTheme;
}

const IMAGE_ACCEPT = 'image/*,.png,.jpg,.jpeg,.webp,.gif,.avif';

export function PagePhotosModal<T extends { [K in keyof T]: string }>({
  isOpen,
  onClose,
  pageTitle,
  slots,
  photos,
  defaultPhotos,
  onChange,
  theme = THEMES[0],
}: PagePhotosModalProps<T>) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const photosRef = useRef<T>(photos);
  photosRef.current = photos;

  if (!isOpen) return null;

  const hasCustomPhotos = slots.some((s) => photos[s.key] !== defaultPhotos[s.key]);

  const handleSlotFileChange = async (
    slotKey: Extract<keyof T, string>,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputEl = e.currentTarget;
    const file = inputEl.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadingSlot(String(slotKey));
    try {
      const dataUrl = await readImageFileAsUrl(file);
      onChange({
        ...photosRef.current,
        [slotKey]: dataUrl,
      });
      sounds.playPop();
    } finally {
      setIsUploading(false);
      setUploadingSlot(null);
      inputEl.value = '';
    }
  };

  const handleMultiFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const fileList = inputEl.files;
    if (!fileList || fileList.length === 0) return;

    setIsUploading(true);
    setUploadingSlot('__multi__');
    try {
      const selectedFiles = Array.from(fileList).slice(0, slots.length);
      const urls = await Promise.all(selectedFiles.map((f) => readImageFileAsUrl(f)));
      const next = { ...photosRef.current };
      urls.forEach((url, index) => {
        const slot = slots[index];
        if (slot) {
          next[slot.key] = url as T[Extract<keyof T, string>];
        }
      });
      onChange(next);
      sounds.playChime();
    } finally {
      setIsUploading(false);
      setUploadingSlot(null);
      inputEl.value = '';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#faf5e8] rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-[#efe6d2] my-auto"
        style={{
          boxShadow: '0 25px 60px -15px rgba(27, 60, 110, 0.38)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[#e5ddc7]">
          <div className="flex items-center gap-2.5">
            <ImagePlus className="w-5 h-5 shrink-0" style={{ color: theme.accentColor }} />
            <h3
              className="font-bubble text-lg sm:text-xl font-black tracking-wide"
              style={{ color: theme.accentColor }}
            >
              Manage Photos · {pageTitle}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {slots.length > 1 && (
              <label
                onClick={() => sounds.playClick()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 font-semibold text-xs border border-[#dacfb7] shadow-2xs transition-colors ${
                  isUploading ? 'opacity-60 pointer-events-none' : 'cursor-pointer'
                }`}
                style={{ color: theme.accentColor }}
                title="Select multiple photos at once to fill slots in order"
              >
                <input
                  type="file"
                  accept={IMAGE_ACCEPT}
                  multiple
                  onChange={handleMultiFileChange}
                  disabled={isUploading}
                  className="sr-only"
                />
                <Images className="w-3.5 h-3.5" />
                <span>{uploadingSlot === '__multi__' ? 'Uploading...' : 'Upload Multiple'}</span>
              </label>
            )}
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Close photo manager"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Photo Slots Grid */}
        <div
          className={`mt-4 grid gap-4 ${
            slots.length === 1
              ? 'grid-cols-1 max-w-sm mx-auto'
              : slots.length <= 4
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-2 sm:grid-cols-3'
          }`}
        >
          {slots.map((slot) => {
            const isCustom = photos[slot.key] !== defaultPhotos[slot.key];
            const isSlotBusy = uploadingSlot === String(slot.key);
            return (
              <div
                key={slot.key}
                className="bg-white rounded-2xl p-3 border border-[#e5ddc7] shadow-xs flex flex-col justify-between gap-2.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-700 truncate">
                      {slot.label}
                    </span>
                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playPop();
                          onChange({
                            ...photosRef.current,
                            [slot.key]: defaultPhotos[slot.key],
                          });
                        }}
                        className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer shrink-0"
                        title="Reset this photo to default"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>

                  <label
                    className={`relative block w-full ${
                      slot.aspectClass || 'aspect-[4/3]'
                    } rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group ${
                      isUploading ? 'pointer-events-none opacity-80' : 'cursor-pointer'
                    }`}
                  >
                    <input
                      type="file"
                      accept={IMAGE_ACCEPT}
                      onChange={(e) => handleSlotFileChange(slot.key, e)}
                      disabled={isUploading}
                      className="sr-only"
                    />
                    <img
                      src={photos[slot.key]}
                      alt={slot.label}
                      className={`w-full h-full ${
                        slot.fitClass || 'object-cover'
                      } transition-transform duration-300 group-hover:scale-105`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-lg bg-white text-slate-800 text-xs font-bold shadow-md flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isSlotBusy ? 'Uploading...' : 'Replace'}</span>
                      </span>
                    </div>
                  </label>
                </div>

                <label
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-colors ${
                    isUploading ? 'opacity-60 pointer-events-none' : 'cursor-pointer hover:bg-slate-50'
                  }`}
                  style={{
                    color: theme.accentColor,
                    borderColor: theme.borderHeader,
                  }}
                >
                  <input
                    type="file"
                    accept={IMAGE_ACCEPT}
                    onChange={(e) => handleSlotFileChange(slot.key, e)}
                    disabled={isUploading}
                    className="sr-only"
                  />
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {isSlotBusy
                      ? 'Uploading...'
                      : isCustom
                      ? 'Change Photo'
                      : 'Upload Photo'}
                  </span>
                </label>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-3.5 border-t border-[#e5ddc7] flex flex-wrap items-center justify-between gap-3">
          {hasCustomPhotos ? (
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onChange({ ...defaultPhotos });
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-[#dacfb7] shadow-2xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Photos</span>
            </button>
          ) : (
            <span className="text-xs text-slate-500">
              {isUploading ? 'Processing photo...' : 'Click Upload Photo or any preview to choose from your device'}
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-transform hover:scale-103 active:scale-97 cursor-pointer ml-auto"
            style={{
              backgroundColor: theme.btnBg,
              color: theme.btnText,
              boxShadow: `0 4px 12px ${theme.btnShadow}`,
            }}
          >
            <Check className="w-4 h-4" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders words with alternating playful -rotate-1 / rotate-1 scrapbook tilts
 * (preserving the exact look of Pages 1 and 8 while supporting any custom user text).
 */
export function renderTiltedWords(text: string): React.ReactNode {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;
  return words.map((word, index) => {
    const tiltClass =
      index % 2 === 0
        ? 'inline-block transform -rotate-1 hover:rotate-1 transition-transform'
        : 'inline-block transform rotate-1 hover:-rotate-1 transition-transform';
    return (
      <React.Fragment key={`${word}-${index}`}>
        {index > 0 ? ' ' : ''}
        <span className={tiltClass}>{word}</span>
      </React.Fragment>
    );
  });
}

/**
 * Preserves the cute slightly lifted lowercase 'i' when mixed inside uppercase bubble headlines
 * (such as "SURPRiSE?" or "HAPPY BiRTHDAY MY") while supporting any custom user text cleanly.
 */
export function renderStylizedBubbleLine(text: string): React.ReactNode {
  if (!text.includes('i')) return text;
  const hasUppercase = /[A-Z]/.test(text);
  if (!hasUppercase) return text;
  return text.split('').map((ch, idx) =>
    ch === 'i' ? (
      <span key={idx} className="inline-block lowercase text-[1.05em] -translate-y-0.5">
        i
      </span>
    ) : (
      <React.Fragment key={idx}>{ch}</React.Fragment>
    )
  );
}
