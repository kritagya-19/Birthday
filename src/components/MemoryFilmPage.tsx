import React, { useState, useRef } from 'react';
import { sounds } from '../utils/audio';
import { ArrowLeft, Upload, ZoomIn, X, Camera, RotateCcw } from 'lucide-react';
import { ColorTheme, THEMES } from '../theme/colorThemes';
import {
  Page4Texts,
  Page4Photos,
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

interface MemoryFilmPageProps {
  onBack: () => void;
  onOpenMessage: () => void;
  theme?: ColorTheme;
  texts?: Page4Texts;
  onChangeTexts?: (next: Page4Texts) => void;
  photos?: Page4Photos;
  onChangePhotos?: (next: Page4Photos) => void;
  readOnly?: boolean;
}

const PAGE4_TEXT_FIELDS: TextFieldConfig<Page4Texts>[] = [
  { key: 'buttonText', label: 'Center Action Button Text' },
];

const PAGE4_PHOTO_SLOTS: PhotoSlotConfig<keyof Page4Photos>[] = [
  { key: 'main', label: 'Center Main Memory Photo', aspectClass: 'aspect-[4/3]' },
  { key: 'polaroid1', label: 'Polaroid Filmstrip 1 (Top)', aspectClass: 'aspect-[4/3]' },
  { key: 'polaroid2', label: 'Polaroid Filmstrip 2 (Middle)', aspectClass: 'aspect-[4/3]' },
  { key: 'polaroid3', label: 'Polaroid Filmstrip 3 (Bottom)', aspectClass: 'aspect-[4/3]' },
];

export const MemoryFilmPage: React.FC<MemoryFilmPageProps> = ({
  onBack,
  onOpenMessage,
  theme = THEMES[0],
  texts,
  onChangeTexts,
  photos,
  onChangePhotos,
  readOnly = false,
}) => {
  const [localTexts, setLocalTexts] = useState<Page4Texts>(DEFAULT_ALL_PAGES_TEXTS.page4);
  const [localPhotos, setLocalPhotos] = useState<Page4Photos>(DEFAULT_ALL_PAGES_PHOTOS.page4);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);

  const activeTexts = texts ?? localTexts;
  const activePhotos = photos ?? localPhotos;

  const handleUpdateTexts = (next: Page4Texts) => {
    if (onChangeTexts) onChangeTexts(next);
    else setLocalTexts(next);
  };

  const handleUpdatePhotos = (next: Page4Photos) => {
    if (onChangePhotos) onChangePhotos(next);
    else setLocalPhotos(next);
  };

  const activePhotosRef = useRef<Page4Photos>(activePhotos);
  activePhotosRef.current = activePhotos;

  const [activePhotoModal, setActivePhotoModal] = useState<keyof Page4Photos | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<keyof Page4Photos>('main');

  const handlePillClick = () => {
    sounds.playMagicSparkles();
    onOpenMessage();
  };

  const handleTriggerUpload = (targetKey: keyof Page4Photos) => {
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
        readOnly ? 'max-w-[min(95vw,calc(82vh*2.08))]' : 'max-w-5xl'
      }`}
    >
      {/* Hidden file input for custom uploads */}
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
            photoCount={4}
            theme={theme}
          />
        )}
      </div>

      {/* Main 2.08:1 Card Frame */}
      <div
        className="relative w-full aspect-[676/325] rounded-3xl overflow-hidden shadow-2xl border-4 transition-all duration-300"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.85)',
          boxShadow: `0 22px 50px -10px ${theme.btnShadow}, 0 4px 18px rgba(0, 0, 0, 0.08)`,
        }}
      >
        <div className={`relative w-full h-full overflow-hidden flex ${theme.ginghamClass}`}>
          {/* 1. LEFT SIDEBAR STRIP */}
          <div
            className={`w-[14.5%] h-full relative border-r-2 sm:border-r-[3px] flex flex-col items-center justify-between pt-2 sm:pt-3 pb-2 px-1 overflow-visible z-20 shrink-0 ${theme.ginghamClass}`}
            style={{ borderColor: theme.accentColor }}
          >
            <div className={`absolute inset-0 ${theme.ginghamClass}`} />

            {/* Evil Eye Watercolor Sticker */}
            <div
              className={`relative z-10 w-[92%] ${readOnly ? 'max-w-[130px]' : 'max-w-[85px]'} aspect-square flex items-center justify-center select-none cursor-pointer mt-1 animate-evil-eye group transition-all duration-300`}
              title="Evil Eye Protection Amulet 🧿 (Tap for magic sparkles)"
              onClick={() => sounds.playMagicSparkles()}
            >
              <img
                src="/assets/aistudio/evil_eye_sticker.png"
                alt="Evil Eye Watercolor Sticker"
                className="w-full h-full object-contain pointer-events-none transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 group-active:scale-95"
              />
            </div>

            {/* Bubu Dudu Animated Sticker on bottom left side */}
            <div
              className={`absolute bottom-1 sm:bottom-1.5 left-1 sm:left-1.5 ${readOnly ? 'w-[180px] sm:w-[230px] md:w-[270px]' : 'w-[140px] sm:w-[172px] md:w-[196px]'} z-30 select-none cursor-pointer group transition-all duration-300 hover:scale-105 active:scale-95 origin-bottom-left`}
              title="Bubu & Dudu 🐻🐼🌹"
              onClick={() => sounds.playPop()}
              style={{
                filter: 'drop-shadow(0 5px 12px rgba(0, 0, 0, 0.32)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.18))',
              }}
            >
              <img
                src="/assets/aistudio/bubu_dudu_page4.gif"
                alt="Bubu and Dudu"
                className="w-full h-auto object-contain pointer-events-none"
              />
            </div>
          </div>

          {/* 2. CENTER MAIN IMAGE HOLDER */}
          <div
            className="relative flex-1 h-full overflow-hidden group border-y-2 sm:border-y-[3px]"
            style={{
              borderColor: theme.accentColor,
              backgroundColor: theme.scallopLight,
            }}
          >
            <img
              src={activePhotos.main}
              alt="Center main memory"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102 cursor-pointer"
              referrerPolicy="no-referrer"
              onClick={() => setActivePhotoModal('main')}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />

            {/* Hover controls for main photo */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 z-20">
              <button
                onClick={() => setActivePhotoModal('main')}
                className="p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md transition-transform hover:scale-110 cursor-pointer"
                title="View Full Size"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              {!readOnly && (
                <button
                  onClick={() => handleTriggerUpload('main')}
                  className="p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md transition-transform hover:scale-110 cursor-pointer"
                  title="Replace Photo"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* BOTTOM CENTER: PASTEL CAPSULE ACTION BUTTON */}
            <div className="absolute bottom-4 sm:bottom-6 inset-x-0 flex flex-col items-center justify-center z-25 pointer-events-auto">
              <button
                onClick={handlePillClick}
                onMouseEnter={() => sounds.playClick()}
                className={`${readOnly ? 'px-11 sm:px-18 py-2.5 sm:py-3.5 text-[clamp(0.78rem,1.4vw,1.1rem)]' : 'px-8 sm:px-14 py-2 sm:py-2.5 text-[clamp(0.65rem,1.2vw,0.85rem)]'} rounded-full font-sans-clean font-extrabold tracking-[0.16em] uppercase transition-all duration-200 border-2 shadow-md hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2`}
                style={{
                  backgroundColor: theme.scallopLight,
                  borderColor: theme.accentColor,
                  color: theme.accentColor,
                  boxShadow: `0 6px 18px ${theme.btnShadow}`,
                }}
              >
                <span>{activeTexts.buttonText}</span>
              </button>
            </div>
          </div>

          {/* 3. RIGHT SIDEBAR: RETRO POLAROID CAMERA WITH 3-PHOTO FILMSTRIP */}
          <div
            className={`w-[25.7%] h-full relative overflow-hidden flex flex-col z-20 border-l-2 sm:border-l-[3px] select-none shadow-md shrink-0 ${theme.ginghamClass}`}
            style={{ borderColor: theme.accentColor }}
          >
            <div className={`absolute inset-0 ${theme.ginghamClass}`} />

            <img
              src={`/assets/aistudio/polaroid_${theme.id}.png`}
              alt="Retro Polaroid Camera & Filmstrip"
              className="relative z-10 w-full h-full object-cover object-top select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />

            {/* Polaroid 1 */}
            <div
              className="absolute left-[19.18%] top-[21.49%] w-[58.08%] h-[21.05%] overflow-hidden z-20 group/p1 cursor-pointer bg-slate-900 rounded-[1px] shadow-xs"
              onClick={() => setActivePhotoModal('polaroid1')}
              title="Click to view or change Polaroid 1"
            >
              <img
                src={activePhotos.polaroid1}
                alt="Polaroid 1"
                className="w-full h-full object-cover transition-transform duration-300 group-hover/p1:scale-105"
              />
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/p1:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1 z-30">
                {!readOnly && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTriggerUpload('polaroid1');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 hover:bg-white text-slate-900 text-[10px] font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Camera className="w-3 h-3 text-sky-600" />
                    <span>Change</span>
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoModal('polaroid1');
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[9px] font-semibold transition-all cursor-pointer"
                >
                  <ZoomIn className="w-2.5 h-2.5" />
                  <span>Zoom</span>
                </button>
              </div>
            </div>

            {/* Polaroid 2 */}
            <div
              className="absolute left-[19.18%] top-[51.02%] w-[58.08%] h-[21.64%] overflow-hidden z-20 group/p2 cursor-pointer bg-slate-900 rounded-[1px] shadow-xs"
              onClick={() => setActivePhotoModal('polaroid2')}
              title={readOnly ? 'Click to view Polaroid 2' : 'Click to view or change Polaroid 2'}
            >
              <img
                src={activePhotos.polaroid2}
                alt="Polaroid 2"
                className="w-full h-full object-cover transition-transform duration-300 group-hover/p2:scale-105"
              />
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/p2:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1 z-30">
                {!readOnly && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTriggerUpload('polaroid2');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 hover:bg-white text-slate-900 text-[10px] font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Camera className="w-3 h-3 text-sky-600" />
                    <span>Change</span>
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoModal('polaroid2');
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[9px] font-semibold transition-all cursor-pointer"
                >
                  <ZoomIn className="w-2.5 h-2.5" />
                  <span>Zoom</span>
                </button>
              </div>
            </div>

            {/* Polaroid 3 */}
            <div
              className="absolute left-[19.18%] top-[80.99%] w-[58.08%] h-[19.01%] overflow-hidden z-20 group/p3 cursor-pointer bg-slate-900 rounded-[1px] shadow-xs"
              onClick={() => setActivePhotoModal('polaroid3')}
              title={readOnly ? 'Click to view Polaroid 3' : 'Click to view or change Polaroid 3'}
            >
              <img
                src={activePhotos.polaroid3}
                alt="Polaroid 3"
                className="w-full h-full object-cover transition-transform duration-300 group-hover/p3:scale-105"
              />
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/p3:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1 z-30">
                {!readOnly && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTriggerUpload('polaroid3');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 hover:bg-white text-slate-900 text-[10px] font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Camera className="w-3 h-3 text-sky-600" />
                    <span>Change</span>
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoModal('polaroid3');
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[9px] font-semibold transition-all cursor-pointer"
                >
                  <ZoomIn className="w-2.5 h-2.5" />
                  <span>Zoom</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom & Change Photo Modal */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActivePhotoModal(null);
            }
          }}
        >
          <div
            className="relative max-w-2xl w-full bg-white p-5 rounded-3xl shadow-2xl border-4 overflow-hidden"
            style={{ borderColor: theme.accentColor }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <span
                className="font-bubble text-lg font-bold"
                style={{ color: theme.accentColor }}
              >
                {activePhotoModal === 'main'
                  ? 'Center Memory Photo'
                  : activePhotoModal === 'polaroid1'
                  ? 'Polaroid 1 (Top)'
                  : activePhotoModal === 'polaroid2'
                  ? 'Polaroid 2 (Middle)'
                  : 'Polaroid 3 (Bottom)'}
              </span>

              <div className="flex items-center gap-2">
                {!readOnly && (
                  <>
                    <button
                      onClick={() => handleTriggerUpload(activePhotoModal)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      style={{
                        backgroundColor: theme.btnBg,
                        color: theme.btnText,
                      }}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Change Photo</span>
                    </button>

                    {activePhotos[activePhotoModal] !== DEFAULT_ALL_PAGES_PHOTOS.page4[activePhotoModal] && (
                      <button
                        onClick={() => {
                          sounds.playPop();
                          handleUpdatePhotos({
                            ...activePhotos,
                            [activePhotoModal]: DEFAULT_ALL_PAGES_PHOTOS.page4[activePhotoModal],
                          });
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </>
                )}

                <button
                  onClick={() => setActivePhotoModal(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative w-full max-h-[65vh] flex items-center justify-center bg-slate-100 rounded-2xl overflow-hidden p-2">
              <img
                src={activePhotos[activePhotoModal]}
                alt="Memory preview"
                className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Page 4 Text & Photos Customization Modals */}
      {!readOnly && (
        <>
          <PageTextEditorModal
            isOpen={isTextModalOpen}
            onClose={() => setIsTextModalOpen(false)}
            pageTitle="Page 4"
            fields={PAGE4_TEXT_FIELDS}
            values={activeTexts}
            defaultValues={DEFAULT_ALL_PAGES_TEXTS.page4}
            onChange={handleUpdateTexts}
            theme={theme}
          />

          <PagePhotosModal
            isOpen={isPhotosModalOpen}
            onClose={() => setIsPhotosModalOpen(false)}
            pageTitle="Page 4"
            slots={PAGE4_PHOTO_SLOTS}
            photos={activePhotos}
            defaultPhotos={DEFAULT_ALL_PAGES_PHOTOS.page4}
            onChange={handleUpdatePhotos}
            theme={theme}
          />
        </>
      )}
    </div>
  );
};
