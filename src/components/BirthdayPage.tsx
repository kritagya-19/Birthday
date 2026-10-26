import React, { useState, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { sounds } from '../utils/audio';
import { firePaperConfetti } from '../utils/confetti';
import { ArrowLeft, Upload, ZoomIn, X } from 'lucide-react';
import { ColorTheme, THEMES } from '../theme/colorThemes';
import { CakeBalloonCelebration } from './CakeBalloonCelebration';
import {
  Page3Texts,
  Page3Photos,
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
  renderStylizedBubbleLine,
} from './PageCustomizationModals';

interface BirthdayPageProps {
  onBack: () => void;
  onOpenMessage: () => void;
  theme?: ColorTheme;
  texts?: Page3Texts;
  onChangeTexts?: (next: Page3Texts) => void;
  photos?: Page3Photos;
  onChangePhotos?: (next: Page3Photos) => void;
  readOnly?: boolean;
}

const PAGE3_TEXT_FIELDS: TextFieldConfig<Page3Texts>[] = [
  { key: 'line1', label: 'Top Birthday Headline' },
  { key: 'line2', label: 'Second Birthday Headline' },
  { key: 'buttonText', label: 'Bottom Button Text' },
];

const PAGE3_PHOTO_SLOTS: PhotoSlotConfig<keyof Page3Photos>[] = [
  { key: 'main', label: 'Main Retro Window Photo', aspectClass: 'aspect-[4/3]' },
  { key: 'thumb1', label: 'Filmstrip Photo 1 (Left)', aspectClass: 'aspect-square' },
  { key: 'thumb2', label: 'Filmstrip Photo 2 (Center)', aspectClass: 'aspect-square' },
  { key: 'thumb3', label: 'Filmstrip Photo 3 (Right)', aspectClass: 'aspect-square' },
];

export const BirthdayPage: React.FC<BirthdayPageProps> = ({
  onBack,
  onOpenMessage,
  theme = THEMES[0],
  texts,
  onChangeTexts,
  photos,
  onChangePhotos,
  readOnly = false,
}) => {
  const [localTexts, setLocalTexts] = useState<Page3Texts>(DEFAULT_ALL_PAGES_TEXTS.page3);
  const [localPhotos, setLocalPhotos] = useState<Page3Photos>(DEFAULT_ALL_PAGES_PHOTOS.page3);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);

  const activeTexts = texts ?? localTexts;
  const activePhotos = photos ?? localPhotos;

  const handleUpdateTexts = (next: Page3Texts) => {
    if (onChangeTexts) onChangeTexts(next);
    else setLocalTexts(next);
  };

  const handleUpdatePhotos = (next: Page3Photos) => {
    if (onChangePhotos) onChangePhotos(next);
    else setLocalPhotos(next);
  };

  const activePhotosRef = useRef<Page3Photos>(activePhotos);
  activePhotosRef.current = activePhotos;

  const [activePhotoModal, setActivePhotoModal] = useState<keyof Page3Photos | null>(null);
  const [isNextHovered, setIsNextHovered] = useState(false);
  const [isCakeCelebrating, setIsCakeCelebrating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<keyof Page3Photos>('main');

  const handleNextClick = (e: React.MouseEvent) => {
    if (isCakeCelebrating) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    firePaperConfetti(x, y, theme);
    setIsCakeCelebrating(true);
  };

  const handleTriggerUpload = (targetKey: keyof Page3Photos) => {
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
      {/* Cute Birthday Cake & Rising Balloons Celebration -> Automatically Opens Page 4 */}
      <AnimatePresence>
        {isCakeCelebrating && (
          <CakeBalloonCelebration
            theme={theme}
            onComplete={() => {
              setIsCakeCelebrating(false);
              onOpenMessage();
            }}
          />
        )}
      </AnimatePresence>

      {/* Hidden file input for quick direct photo uploads */}
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

      {/* Main 16:9 Card Frame */}
      <div
        className="relative w-full aspect-[1024/572] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 transition-all duration-300 isolate"
        style={{
          boxShadow:
            '0 22px 50px -10px rgba(27, 60, 110, 0.32), 0 4px 18px rgba(27, 60, 110, 0.15)',
          WebkitMaskImage: '-webkit-radial-gradient(white, black)',
          transform: 'translateZ(0)',
        }}
      >
        <div className={`relative w-full h-full overflow-hidden ${theme.ginghamClass}`}>
          {/* 1. GINGHAM CHECK PATTERN BACKGROUND */}
          <div className={`absolute inset-0 ${theme.ginghamClass}`} />

          {/* Subtle paper grain texture */}
          <div className="absolute inset-0 paper-texture pointer-events-none opacity-40" />

          {/* 2. TOP-LEFT CORNER BALLOONS */}
          <div className="absolute top-0 left-0 w-[27%] sm:w-[25%] aspect-square pointer-events-none z-25 select-none animate-balloon-left">
            <img
              src="/assets/aistudio/Untitled_Design__7_-Photoroom_73aa0f9e.png"
              alt="Balloons Left"
              className="w-full h-full object-contain object-top-left"
              style={{ filter: theme.balloonFilter }}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* TOP-RIGHT CORNER BALLOONS */}
          <div className="absolute top-0 right-0 w-[30%] sm:w-[28%] aspect-square pointer-events-none z-10 select-none animate-balloon-right">
            <img
              src="/assets/aistudio/Untitled_Design__6_-Photoroom_9af3aeef.png"
              alt="Balloons Right"
              className="w-full h-full object-contain object-top-right"
              style={{ filter: theme.balloonFilter }}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* 3. LEFT IMAGE HOLDER: NOSTALGIC RETRO DESKTOP OS WINDOW */}
          <div
            className="absolute left-[5.7%] top-[16.5%] w-[43%] h-[62.8%] z-20 transition-transform duration-300 hover:scale-[1.008]"
            style={{
              filter: 'drop-shadow(3px 8px 16px rgba(20, 48, 85, 0.32))',
            }}
          >
            <div
              className="w-full h-full rounded-2xl bg-white overflow-hidden flex flex-col border-[2.5px]"
              style={{ borderColor: theme.darkFrame }}
            >
              {/* OS Window Top Header Bar */}
              <div
                className="h-[10.5%] px-3 flex items-center justify-between border-b select-none"
                style={{ backgroundColor: theme.darkFrame, borderColor: theme.darkFrame }}
              >
                <div className="flex items-center gap-2.5 text-white/95 text-[11px] sm:text-xs font-bold">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playClick();
                    }}
                    className="hover:text-red-300 cursor-pointer transition-colors"
                    title="Close window"
                  >
                    ✕
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playClick();
                    }}
                    className="hover:text-blue-300 cursor-pointer transition-colors text-[10px]"
                    title="Maximize window"
                  >
                    ▢
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playClick();
                    }}
                    className="hover:text-yellow-300 cursor-pointer transition-colors text-[12px] -translate-y-0.5"
                    title="Minimize window"
                  >
                    ━
                  </span>
                </div>
              </div>

              {/* Main Photo Frame */}
              <div className="relative flex-1 bg-slate-100 overflow-hidden group cursor-pointer">
                <img
                  src={activePhotos.main}
                  alt="Main Memory Selfie"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onClick={() => setActivePhotoModal('main')}
                />

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoModal('main');
                    }}
                    className="p-2 rounded-full bg-white/90 hover:bg-white text-[#183664] shadow-md transition-transform hover:scale-110 cursor-pointer"
                    title="View Full Size"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  {!readOnly && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTriggerUpload('main');
                      }}
                      className="p-2 rounded-full bg-white/90 hover:bg-white text-[#183664] shadow-md transition-transform hover:scale-110 cursor-pointer"
                      title="Replace Photo"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* OS Window Bottom Bar */}
              <div
                className="h-[11.5%] bg-white px-3 flex items-center gap-2.5 border-t"
                style={{ borderColor: theme.darkFrame }}
              >
                <span
                  className="font-extrabold text-xs sm:text-sm cursor-pointer select-none leading-none -translate-y-0.5"
                  style={{ color: theme.darkFrame }}
                >
                  &lt;
                </span>
                <div
                  className="flex-1 h-3.5 sm:h-4.5 rounded-full border shadow-inner transition-colors duration-300"
                  style={{ backgroundColor: theme.scallopColor, borderColor: theme.darkFrame }}
                />
              </div>
            </div>
          </div>

          {/* 4. RIGHT IMAGE HOLDER: 3-PHOTO VINTAGE FILMSTRIP */}
          <div className="absolute left-[50.2%] w-[45.8%] top-[22.8%] z-20">
            <div className="relative w-full">
              {/* Top double lines & center diamond finial */}
              <div className="relative w-full h-3.5 sm:h-4.5 flex items-center">
                <svg viewBox="0 0 460 20" className="w-full h-full overflow-visible" fill="none">
                  <line x1="2" y1="2" x2="2" y2="18" stroke={theme.darkFrame} strokeWidth="2" strokeLinecap="round" />
                  <line x1="2" y1="7" x2="218" y2="7" stroke={theme.darkFrame} strokeWidth="1.5" />
                  <line x1="2" y1="13" x2="218" y2="13" stroke={theme.darkFrame} strokeWidth="1.5" />
                  <polygon
                    points="230,2 240,10 230,18 220,10"
                    stroke={theme.darkFrame}
                    strokeWidth="2"
                    fill={theme.canvasBg || '#faf6ea'}
                  />
                  <line x1="242" y1="7" x2="458" y2="7" stroke={theme.darkFrame} strokeWidth="1.5" />
                  <line x1="242" y1="13" x2="458" y2="13" stroke={theme.darkFrame} strokeWidth="1.5" />
                  <line x1="458" y1="2" x2="458" y2="18" stroke={theme.darkFrame} strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              {/* 3 Photos Filmstrip Row */}
              <div
                className="my-1.5 grid grid-cols-3 border-2 overflow-hidden shadow-md"
                style={{ borderColor: theme.darkFrame, backgroundColor: theme.darkFrame }}
              >
                {(['thumb1', 'thumb2', 'thumb3'] as const).map((slotKey, idx) => (
                  <div
                    key={slotKey}
                    className={`relative aspect-[15/15.8] bg-slate-200 overflow-hidden group cursor-pointer ${
                      idx < 2 ? 'border-r-2' : ''
                    }`}
                    style={{ borderColor: theme.darkFrame }}
                  >
                    <img
                      src={activePhotos[slotKey]}
                      alt={`Memory photo ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      onClick={() => setActivePhotoModal(slotKey)}
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePhotoModal(slotKey);
                        }}
                        className="p-1.5 rounded-full bg-white/90 hover:bg-white text-[#183664] cursor-pointer"
                        title="Zoom Photo"
                      >
                        <ZoomIn className="w-3 h-3" />
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
                          <Upload className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom double lines & center diamond finial */}
              <div className="relative w-full h-3.5 sm:h-4.5 flex items-center">
                <svg viewBox="0 0 460 20" className="w-full h-full overflow-visible" fill="none">
                  <line x1="2" y1="2" x2="2" y2="18" stroke={theme.darkFrame} strokeWidth="2" strokeLinecap="round" />
                  <line x1="2" y1="7" x2="218" y2="7" stroke={theme.darkFrame} strokeWidth="1.5" />
                  <line x1="2" y1="13" x2="218" y2="13" stroke={theme.darkFrame} strokeWidth="1.5" />
                  <polygon
                    points="230,2 240,10 230,18 220,10"
                    stroke={theme.darkFrame}
                    strokeWidth="2"
                    fill={theme.canvasBg || '#faf6ea'}
                  />
                  <line x1="242" y1="7" x2="458" y2="7" stroke={theme.darkFrame} strokeWidth="1.5" />
                  <line x1="242" y1="13" x2="458" y2="13" stroke={theme.darkFrame} strokeWidth="1.5" />
                  <line x1="458" y1="2" x2="458" y2="18" stroke={theme.darkFrame} strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* 5. TYPOGRAPHY: HAPPY BiRTHDAY MY LOVE */}
            <div
              className="mt-4 sm:mt-6 text-center select-none flex flex-col items-center justify-center animate-poppy-breath cursor-pointer transition-transform hover:scale-105 active:scale-95"
              onClick={() => sounds.playPop()}
              title="Tap for pop!"
            >
              {activeTexts.line1 && (
                <h2
                  className={`font-bubble font-black ${readOnly ? 'text-[clamp(1.35rem,4.2vw,3.75rem)]' : 'text-[clamp(1.15rem,3.4vw,2.75rem)]'} leading-[1.08] tracking-[0.05em]`}
                  style={{
                    color: theme.accentColor,
                    filter:
                      'drop-shadow(0 0 1px #ffffff) drop-shadow(0 2px 0 #ffffff) drop-shadow(0 -1px 0 #ffffff) drop-shadow(1px 0 0 #ffffff) drop-shadow(-1px 0 0 #ffffff) drop-shadow(0 3px 5px rgba(20,40,70,0.18))',
                  }}
                >
                  {renderStylizedBubbleLine(activeTexts.line1)}
                </h2>
              )}

              {activeTexts.line2 && (
                <h3
                  className={`font-bubble font-black ${readOnly ? 'text-[clamp(1.45rem,4.6vw,4.1rem)]' : 'text-[clamp(1.25rem,3.7vw,3.0rem)]'} leading-[1.1] tracking-[0.06em] mt-0.5 sm:mt-1.5`}
                  style={{
                    color: theme.accentColor,
                    filter:
                      'drop-shadow(0 0 1px #ffffff) drop-shadow(0 2px 0 #ffffff) drop-shadow(0 -1px 0 #ffffff) drop-shadow(1px 0 0 #ffffff) drop-shadow(-1px 0 0 #ffffff) drop-shadow(0 3px 5px rgba(20,40,70,0.18))',
                  }}
                >
                  {renderStylizedBubbleLine(activeTexts.line2)}
                </h3>
              )}
            </div>
          </div>

          {/* 8. AUTHENTIC SCRAPBOOK BOTTOM TORN PAPER DESIGN */}
          <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
            <img
              src="/assets/aistudio/Untitled_Design__4_-Photoroom_f0e4dcf9.png"
              alt="Scrapbook bottom torn paper design"
              className="w-full h-full object-fill pointer-events-none select-none transition-[filter] duration-500 ease-out"
              style={{
                filter: theme.scrapbookFilter || theme.balloonFilter || 'none',
              }}
            />
          </div>

          {/* 9. NEXT BUTTON */}
          <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 z-35 pointer-events-auto flex items-center justify-center">
            <button
              onClick={handleNextClick}
              onMouseEnter={() => {
                sounds.playClick();
                setIsNextHovered(true);
              }}
              onMouseLeave={() => setIsNextHovered(false)}
              className={`relative group ${readOnly ? 'px-12 sm:px-18 py-2.5 sm:py-3.5 text-[clamp(0.85rem,1.6vw,1.25rem)]' : 'px-10 sm:px-14 py-1.5 sm:py-2.5 text-[clamp(0.75rem,1.35vw,1rem)]'} rounded-full text-white font-sans-clean font-extrabold tracking-[0.22em] uppercase transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/50 shadow-lg`}
              style={{
                backgroundColor: isNextHovered ? theme.btnHover : theme.btnBg,
                boxShadow: `0 6px 20px ${theme.btnShadow}`,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              <span className="relative z-10">{activeTexts.buttonText}</span>
              <span className="absolute inset-0 rounded-full border-t border-white/30 pointer-events-none" />
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal for Photos */}
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
                Photo Memory
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

      {/* Page 3 Text & Photos Customization Modals */}
      {!readOnly && (
        <>
          <PageTextEditorModal
            isOpen={isTextModalOpen}
            onClose={() => setIsTextModalOpen(false)}
            pageTitle="Page 3"
            fields={PAGE3_TEXT_FIELDS}
            values={activeTexts}
            defaultValues={DEFAULT_ALL_PAGES_TEXTS.page3}
            onChange={handleUpdateTexts}
            theme={theme}
          />

          <PagePhotosModal
            isOpen={isPhotosModalOpen}
            onClose={() => setIsPhotosModalOpen(false)}
            pageTitle="Page 3"
            slots={PAGE3_PHOTO_SLOTS}
            photos={activePhotos}
            defaultPhotos={DEFAULT_ALL_PAGES_PHOTOS.page3}
            onChange={handleUpdatePhotos}
            theme={theme}
          />
        </>
      )}
    </div>
  );
};
