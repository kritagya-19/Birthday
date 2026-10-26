import React, { useState, useRef } from 'react';
import { sounds } from '../utils/audio';
import { ArrowLeft, Upload, ZoomIn, X, Check } from 'lucide-react';
import { ScrapbookPage7Camera } from './ScrapbookAssets';
import { ColorTheme, THEMES } from '../theme/colorThemes';
import {
  Page7Texts,
  Page7Photos,
  DEFAULT_ALL_PAGES_TEXTS,
  DEFAULT_ALL_PAGES_PHOTOS,
  readImageFileAsUrl,
} from '../utils/pageContentStore';
import {
  PageActionButtons,
  PageTextEditorModal,
  PagePhotosModal,
  TextFieldConfig,
  PhotoSlotConfig,
} from './PageCustomizationModals';

interface MemoryGalleryPageProps {
  onBack: () => void;
  onOpenMessage: (originX?: number, originY?: number) => void;
  theme?: ColorTheme;
  texts?: Page7Texts;
  onChangeTexts?: (next: Page7Texts) => void;
  photos?: Page7Photos;
  onChangePhotos?: (next: Page7Photos) => void;
  readOnly?: boolean;
}

const PAGE7_TEXT_FIELDS: TextFieldConfig<Page7Texts>[] = [
  { key: 'centerInitials', label: 'Center Divider Initials Badge' },
  { key: 'buttonText', label: 'Bottom-Right Action Button Text' },
];

const PAGE7_PHOTO_SLOTS: PhotoSlotConfig<keyof Page7Photos>[] = [
  { key: 'p1', label: 'Top Row · Left Photo', aspectClass: 'aspect-[223/142]' },
  { key: 'p2', label: 'Top Row · Center Photo', aspectClass: 'aspect-[223/142]' },
  { key: 'p3', label: 'Top Row · Right Photo', aspectClass: 'aspect-[223/142]' },
  { key: 'p4', label: 'Bottom Row · Left Photo', aspectClass: 'aspect-[196/172]' },
  { key: 'p5', label: 'Bottom Row · Center Photo', aspectClass: 'aspect-[196/172]' },
  { key: 'p6', label: 'Bottom Row · Right Photo', aspectClass: 'aspect-[196/172]' },
];

export const MemoryGalleryPage: React.FC<MemoryGalleryPageProps> = ({
  onBack,
  onOpenMessage,
  theme = THEMES[0],
  texts,
  onChangeTexts,
  photos,
  onChangePhotos,
  readOnly = false,
}) => {
  const [localTexts, setLocalTexts] = useState<Page7Texts>(DEFAULT_ALL_PAGES_TEXTS.page7);
  const [localPhotos, setLocalPhotos] = useState<Page7Photos>(DEFAULT_ALL_PAGES_PHOTOS.page7);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);
  const [isEditingInitials, setIsEditingInitials] = useState(false);

  const activeTexts = texts ?? localTexts;
  const activePhotos = photos ?? localPhotos;

  const handleUpdateTexts = (next: Page7Texts) => {
    if (onChangeTexts) onChangeTexts(next);
    else setLocalTexts(next);
  };

  const handleUpdatePhotos = (next: Page7Photos) => {
    if (onChangePhotos) onChangePhotos(next);
    else setLocalPhotos(next);
  };

  const activePhotosRef = useRef<Page7Photos>(activePhotos);
  activePhotosRef.current = activePhotos;

  const [activePhotoModal, setActivePhotoModal] = useState<keyof Page7Photos | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<keyof Page7Photos>('p1');

  const handleCelebrate = (e: React.MouseEvent) => {
    sounds.playPop();
    sounds.playChime();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    onOpenMessage(x, y);
  };

  const handleTriggerUpload = (targetKey: keyof Page7Photos) => {
    uploadTargetRef.current = targetKey;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const file = inputEl.files?.[0];
    if (file) {
      const targetKey = uploadTargetRef.current;
      const url = await readImageFileAsUrl(file);
      handleUpdatePhotos({ ...activePhotosRef.current, [targetKey]: url });
      sounds.playPop();
    }
    inputEl.value = '';
  };

  return (
    <div
      className={`relative w-full mx-auto px-4 select-none animate-in fade-in zoom-in-98 duration-300 ${
        readOnly ? 'max-w-[min(95vw,calc(84vh*1.79))]' : 'max-w-5xl'
      }`}
    >
      {/* Hidden file input */}
      {!readOnly && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      )}

      {/* Top back navigation & Text / Photos buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs">
        <button
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/85 hover:bg-white font-semibold border shadow-xs transition-all hover:-translate-x-0.5 cursor-pointer"
          style={{ color: theme.accentColor, borderColor: theme.borderHeader }}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        {!readOnly && (
          <PageActionButtons
            onOpenTextEditor={() => setIsTextModalOpen(true)}
            onOpenPhotoEditor={() => setIsPhotosModalOpen(true)}
            photoCount={6}
            theme={theme}
          />
        )}
      </div>

      {/* Main 16:9 Card Frame */}
      <div
        className="relative w-full aspect-[1024/572] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/70 transition-all duration-300"
        style={{
          boxShadow:
            '0 22px 50px -10px rgba(27, 60, 110, 0.32), 0 4px 18px rgba(27, 60, 110, 0.15)',
        }}
      >
        <div className={`relative w-full h-full overflow-hidden flex ${theme.ginghamClass}`}>
          <div className={`absolute inset-0 pointer-events-none ${theme.ginghamClass}`} />
          <div className="absolute inset-0 paper-texture pointer-events-none opacity-40" />

          {/* TOP-RIGHT SCRAPBOOK CAMERA */}
          <div className="absolute right-[2.5%] sm:right-[3.8%] -top-[1%] sm:top-[0.5%] z-30 pointer-events-auto">
            <ScrapbookPage7Camera theme={theme} rotate={14} />
          </div>

          {/* MAIN ARCHITECTURAL 6-PHOTO GALLERY GRID */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-15 px-8 pt-4">
            {/* TOP WHITE ARCHITECTURAL RULE WITH CHEVRON FINIAL */}
            <div className={`relative ${readOnly ? 'w-[84%] max-w-6xl' : 'w-[78%] max-w-4xl'} flex items-center justify-center mb-1`}>
              <div className="w-full h-[2px] bg-white/90 shadow-xs" />
              <div
                className="absolute -top-3 w-5 h-5 border-2 border-white transform rotate-45 z-10 flex items-center justify-center transition-colors duration-300"
                style={{ backgroundColor: theme.scallopColor }}
              />
            </div>

            {/* ROW 1: 3 HORIZONTAL PHOTOS */}
            <div className={`${readOnly ? 'w-[84%] max-w-6xl gap-3 sm:gap-4 my-1 sm:my-1.5' : 'w-[78%] max-w-4xl gap-2.5 my-1'} grid grid-cols-3`}>
              {(['p1', 'p2', 'p3'] as const).map((slotKey, idx) => (
                <div
                  key={slotKey}
                  className="relative aspect-[223/142] bg-slate-900 border-2 border-white/95 rounded-xs overflow-hidden shadow-md group cursor-pointer"
                >
                  <img
                    src={activePhotos[slotKey]}
                    alt={`Memory photo ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onClick={() => setActivePhotoModal(slotKey)}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoModal(slotKey);
                      }}
                      className="p-1.5 rounded-full bg-white/90 hover:bg-white text-[#183664] cursor-pointer"
                      title="View Full Size"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    {!readOnly && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTriggerUpload(slotKey);
                        }}
                        className="p-1.5 rounded-full bg-white/90 hover:bg-white text-[#183664] cursor-pointer"
                        title="Replace Photo"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* MIDDLE DIVIDER RULE WITH INITIALS */}
            <div className={`relative ${readOnly ? 'w-[84%] max-w-6xl my-1.5 sm:my-2' : 'w-[78%] max-w-4xl my-1'} flex items-center justify-center select-none z-10`}>
              <div className="w-full h-[2px] bg-white/90 shadow-xs" />
              {readOnly ? (
                <div
                  className={`absolute flex items-center justify-center ${readOnly ? 'px-3.5 py-1 text-[13px] sm:text-[14px]' : 'px-2.5 py-0.5 text-[11px]'} text-white font-mono font-bold tracking-widest border border-white/60 rounded-xs shadow-xs`}
                  style={{ backgroundColor: theme.scallopColor }}
                >
                  <span>{activeTexts.centerInitials}</span>
                </div>
              ) : isEditingInitials ? (
                <div
                  className="absolute flex items-center gap-1 px-1.5 py-0.5 text-white border-2 border-white rounded shadow-md transition-all duration-200"
                  style={{ backgroundColor: theme.scallopColor }}
                >
                  <input
                    type="text"
                    value={activeTexts.centerInitials}
                    onChange={(e) =>
                      handleUpdateTexts({ ...activeTexts, centerInitials: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setIsEditingInitials(false);
                        sounds.playPop();
                      }
                    }}
                    autoFocus
                    maxLength={24}
                    className="w-24 sm:w-28 text-center bg-black/25 text-white text-[11px] font-mono font-bold tracking-widest px-1 py-0.5 rounded outline-none border border-white/40 focus:border-white"
                    placeholder="S × N"
                  />
                  <button
                    onClick={() => {
                      setIsEditingInitials(false);
                      sounds.playPop();
                    }}
                    className="p-1 rounded bg-white text-slate-800 hover:bg-white/90 cursor-pointer shadow-xs"
                    title="Save initials"
                  >
                    <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsEditingInitials(true);
                  }}
                  className="absolute flex items-center justify-center px-2.5 py-0.5 text-white text-[11px] font-mono font-bold tracking-widest border border-white/60 hover:border-white rounded-xs transition-all duration-200 cursor-pointer shadow-xs hover:scale-105 hover:shadow-md"
                  style={{ backgroundColor: theme.scallopColor }}
                  title="Click to edit initials"
                >
                  <span>{activeTexts.centerInitials}</span>
                </button>
              )}
            </div>

            {/* ROW 2: 3 PORTRAIT / SQUARE PHOTOS */}
            <div className={`${readOnly ? 'w-[76%] max-w-5xl gap-3 sm:gap-4 my-1 sm:my-1.5' : 'w-[70%] max-w-3xl gap-2.5 my-1'} grid grid-cols-3`}>
              {(['p4', 'p5', 'p6'] as const).map((slotKey, idx) => (
                <div
                  key={slotKey}
                  className="relative aspect-[196/172] bg-slate-900 border-2 border-white/95 rounded-xs overflow-hidden shadow-md group cursor-pointer"
                >
                  <img
                    src={activePhotos[slotKey]}
                    alt={`Memory photo ${idx + 4}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onClick={() => setActivePhotoModal(slotKey)}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoModal(slotKey);
                      }}
                      className="p-1.5 rounded-full bg-white/90 hover:bg-white text-[#183664] cursor-pointer"
                      title="View Full Size"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    {!readOnly && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTriggerUpload(slotKey);
                        }}
                        className="p-1.5 rounded-full bg-white/90 hover:bg-white text-[#183664] cursor-pointer"
                        title="Replace Photo"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* BOTTOM DIVIDER RULE */}
            <div className={`relative ${readOnly ? 'w-[76%] max-w-5xl' : 'w-[70%] max-w-3xl'} flex items-center justify-center mt-1 select-none`}>
              <div className="w-full h-[2px] bg-white/90 shadow-xs" />
            </div>
          </div>

          {/* BOTTOM-RIGHT CAPSULE PILL ACTION BUTTON */}
          <div className="absolute right-[8%] bottom-[4.2%] z-25">
            <button
              onClick={handleCelebrate}
              onMouseEnter={() => sounds.playClick()}
              className={`${readOnly ? 'px-10 sm:px-14 py-2.5 sm:py-3.5 text-[clamp(0.82rem,1.5vw,1.15rem)]' : 'px-8 sm:px-11 py-2 sm:py-2.5 text-[clamp(0.72rem,1.3vw,0.92rem)]'} rounded-full text-white font-sans-clean font-extrabold tracking-[0.16em] uppercase transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-white/40 flex items-center gap-2 whitespace-nowrap`}
              style={{
                backgroundColor: theme.btnBg,
                boxShadow: `0 8px 24px ${theme.btnShadow}`,
              }}
            >
              <span>{activeTexts.buttonText}</span>
            </button>
          </div>

          {/* BOTTOM-LEFT BUBU & DUDU GIF */}
          <div
            className="absolute left-[1%] sm:left-[2%] bottom-0 z-25 pointer-events-auto flex flex-col items-center group cursor-pointer"
            onClick={() => {
              sounds.playPop();
            }}
            title="Bubu & Dudu cuddle 🥰"
          >
            <div className="relative transition-transform duration-300 group-hover:scale-105 active:scale-95">
              <img
                src="https://media.tenor.com/S_lMGnbCMzYAAAAi/bubu-bubu-dudu.gif"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/aistudio/bubu_dubu_page7.gif';
                }}
                alt="Bubu and Dudu cute sticker"
                className={`${readOnly ? 'w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64' : 'w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-48 lg:h-48'} object-contain block align-bottom drop-shadow-[0_6px_16px_rgba(20,40,75,0.28)] select-none pointer-events-none`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal for Photo */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActivePhotoModal(null);
            }
          }}
        >
          <div
            className="relative max-w-2xl w-full bg-white p-4 rounded-3xl shadow-2xl border-4 overflow-hidden"
            style={{ borderColor: theme.accentColor }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <span className="font-bubble text-lg font-bold" style={{ color: theme.accentColor }}>
                Gallery Memory
              </span>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => handleTriggerUpload(activePhotoModal)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    style={{
                      backgroundColor: theme.btnBg,
                      color: theme.btnText,
                    }}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                  </button>
                )}
                <button
                  onClick={() => setActivePhotoModal(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <img
              src={activePhotos[activePhotoModal]}
              alt="Memory zoom"
              className="w-full max-h-[70vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* Page 7 Text & Photos Customization Modals */}
      {!readOnly && (
        <>
          <PageTextEditorModal
            isOpen={isTextModalOpen}
            onClose={() => setIsTextModalOpen(false)}
            pageTitle="Page 7"
            fields={PAGE7_TEXT_FIELDS}
            values={activeTexts}
            defaultValues={DEFAULT_ALL_PAGES_TEXTS.page7}
            onChange={handleUpdateTexts}
            theme={theme}
          />

          <PagePhotosModal
            isOpen={isPhotosModalOpen}
            onClose={() => setIsPhotosModalOpen(false)}
            pageTitle="Page 7"
            slots={PAGE7_PHOTO_SLOTS}
            photos={activePhotos}
            defaultPhotos={DEFAULT_ALL_PAGES_PHOTOS.page7}
            onChange={handleUpdatePhotos}
            theme={theme}
          />
        </>
      )}
    </div>
  );
};
