import React, { useState, useRef, useEffect } from 'react';
import { sounds } from '../utils/audio';
import { firePaperConfetti } from '../utils/confetti';
import { ArrowLeft, Upload, ZoomIn, Heart, X } from 'lucide-react';
import {
  PuffyHeartSticker,
  CuteBowSticker,
  DaisyFlowerSticker,
  WashiTapeSticker,
  CuteSparkleStar,
  CuteStrawberrySticker,
  CuteBunnySticker,
  ScrapbookPage7Camera,
} from './ScrapbookAssets';
import { ColorTheme, THEMES } from '../theme/colorThemes';
import {
  Page6Texts,
  Page6Photos,
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

interface FavoritePicPageProps {
  onBack: () => void;
  onOpenMessage: () => void;
  theme?: ColorTheme;
  texts?: Page6Texts;
  onChangeTexts?: (next: Page6Texts) => void;
  photos?: Page6Photos;
  onChangePhotos?: (next: Page6Photos) => void;
  readOnly?: boolean;
}

const PAGE6_TEXT_FIELDS: TextFieldConfig<Page6Texts>[] = [
  { key: 'bubble1Line1', label: 'Top Message Card · Line 1' },
  { key: 'bubble1Line2', label: 'Top Message Card · Line 2' },
  { key: 'bubble2Line1', label: 'Second Message Card · Line 1' },
  { key: 'bubble2Line2', label: 'Second Message Card · Line 2' },
  { key: 'bubble2Line3', label: 'Second Message Card · Line 3' },
  { key: 'bubble2Line4', label: 'Second Message Card · Line 4' },
  { key: 'buttonText', label: 'Bottom Action Button Text' },
];

const PAGE6_PHOTO_SLOTS: PhotoSlotConfig<keyof Page6Photos>[] = [
  { key: 'main', label: 'Polaroid Favorite Photo', aspectClass: 'aspect-square' },
];

export const FavoritePicPage: React.FC<FavoritePicPageProps> = ({
  onBack,
  onOpenMessage,
  theme = THEMES[0],
  texts,
  onChangeTexts,
  photos,
  onChangePhotos,
  readOnly = false,
}) => {
  const [localTexts, setLocalTexts] = useState<Page6Texts>(DEFAULT_ALL_PAGES_TEXTS.page6);
  const [localPhotos, setLocalPhotos] = useState<Page6Photos>(DEFAULT_ALL_PAGES_PHOTOS.page6);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);

  const activeTexts = texts ?? localTexts;
  const activePhotos = photos ?? localPhotos;

  const handleUpdateTexts = (next: Page6Texts) => {
    if (onChangeTexts) onChangeTexts(next);
    else setLocalTexts(next);
  };

  const handleUpdatePhotos = (next: Page6Photos) => {
    if (onChangePhotos) onChangePhotos(next);
    else setLocalPhotos(next);
  };

  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  type CinematicStep = 'idle' | 'show_camera' | 'camera_clicked' | 'white_flash';
  const [cinematicStep, setCinematicStep] = useState<CinematicStep>('idle');
  const [countdown, setCountdown] = useState<number | null>(null);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const handleFavPicClick = () => {
    if (cinematicStep !== 'idle') return;
    timersRef.current.forEach((id) => window.clearTimeout(id));

    setCinematicStep('show_camera');
    setCountdown(3);
    sounds.playClick();

    const t1 = window.setTimeout(() => {
      setCountdown(2);
      sounds.playClick();
    }, 520);

    const t2 = window.setTimeout(() => {
      setCountdown(1);
      sounds.playPop();
    }, 1040);

    const t3 = window.setTimeout(() => {
      setCountdown(null);
      setCinematicStep('camera_clicked');
      sounds.playCameraShutter();
      firePaperConfetti(0.5, 0.45, theme);
    }, 1560);

    const t4 = window.setTimeout(() => {
      setCinematicStep('white_flash');
    }, 1780);

    const t5 = window.setTimeout(() => {
      sounds.playChime();
      onOpenMessage();
    }, 1990);

    timersRef.current = [t1, t2, t3, t4, t5];
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const file = inputEl.files?.[0];
    if (file) {
      const url = await readImageFileAsUrl(file);
      handleUpdatePhotos({ main: url });
      sounds.playPop();
    }
    inputEl.value = '';
  };

  return (
    <div
      className={`relative w-full ${
        readOnly ? 'max-w-[min(95vw,calc(84vh*1.79))]' : 'max-w-5xl'
      } mx-auto px-4 select-none animate-in fade-in zoom-in-98 duration-300`}
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

      {/* Top back navigation & Text / Photo buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs">
        <button
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/85 hover:bg-white font-semibold border shadow-xs transition-all hover:-translate-x-0.5 cursor-pointer"
          style={{ color: theme.accentColor, borderColor: theme.borderHeader }}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Page 5
        </button>

        {!readOnly && (
          <PageActionButtons
            onOpenTextEditor={() => setIsTextModalOpen(true)}
            onOpenPhotoEditor={() => setIsPhotosModalOpen(true)}
            photoCount={1}
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

          {/* 1. LEFT ZONE: GINGHAM PAPER MAT & POLAROID PHOTO CARD */}
          <div className="w-[42%] h-full relative flex items-center justify-center p-4 sm:p-6 z-20">
            <div
              className={`relative ${readOnly ? 'w-[92%] sm:w-[94%]' : 'w-[86%]'} aspect-[340/460] bg-white ${theme.ginghamClass} rounded-3xl p-3 shadow-xl border-2 border-white/80 flex flex-col items-center justify-between`}
              style={{
                boxShadow: '0 16px 36px -8px rgba(22, 48, 85, 0.3)',
              }}
            >
              {/* Top-Right Soft Cloud Sticker */}
              <div className="absolute -top-3.5 -right-3.5 w-16 h-10 pointer-events-none z-30 opacity-90">
                <svg viewBox="0 0 64 40" fill="none" className="w-full h-full">
                  <path
                    d="M 16 32 C 10 32, 4 28, 6 20 C 6 14, 14 10, 20 14 C 24 8, 36 6, 42 12 C 48 10, 56 14, 56 22 C 60 26, 56 32, 50 32 Z"
                    fill={theme.scallopLight}
                    stroke={theme.scallopColor}
                    strokeWidth="1.2"
                  />
                </svg>
              </div>

              {/* Top-Left Delicate Doodle Loop */}
              <div className="absolute -top-1 -left-1 w-12 h-12 pointer-events-none z-30 opacity-60">
                <svg viewBox="0 0 40 40" fill="none" className="w-full h-full text-white">
                  <path d="M 10 30 Q 8 10, 20 8 Q 32 6, 28 22 Q 24 38, 12 28" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>

              {/* The Polaroid Photo Frame */}
              <div className="relative w-full aspect-[297/300] bg-white p-2 sm:p-2.5 rounded-sm shadow-md mt-2 group/photo cursor-pointer">
                <div className="relative w-full h-full overflow-hidden bg-slate-900 border border-slate-300/80">
                  <img
                    src={activePhotos.main}
                    alt="Favorite memory photo"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/photo:scale-105"
                    referrerPolicy="no-referrer"
                    onClick={() => setIsZoomOpen(true)}
                  />
                  {/* Hover tools */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsZoomOpen(true);
                      }}
                      className="p-1.5 rounded-full bg-white/90 hover:bg-white cursor-pointer shadow-xs transition-transform hover:scale-105"
                      style={{ color: theme.accentColor }}
                      title="View Full Size"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    {!readOnly && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                            fileInputRef.current.click();
                          }
                        }}
                        className="p-1.5 rounded-full bg-white/90 hover:bg-white cursor-pointer shadow-xs transition-transform hover:scale-105"
                        style={{ color: theme.accentColor }}
                        title="Replace Photo"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Center Circular Stitched Badge with Heart */}
              <div
                className="relative -mb-6 w-16 h-16 rounded-full border-3 border-white flex items-center justify-center p-2.5 z-30 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                style={{
                  backgroundColor: theme.accentColor,
                  boxShadow: `0 8px 22px ${theme.btnShadow}`,
                }}
                onClick={() => sounds.playPop()}
                title="Love badge"
              >
                <Heart
                  className="w-full h-full"
                  style={{
                    fill: theme.scallopLight,
                    color: theme.scallopLight,
                  }}
                />
              </div>
            </div>
          </div>

          {/* 2. RIGHT ZONE: MESSAGE BUBBLES, STICKERS & CTA */}
          <div className="relative flex-1 h-full flex flex-col justify-between py-6 sm:py-8 pr-4 sm:pr-8 md:pr-10 pl-2 z-20">
            <div className={`flex flex-col ${readOnly ? 'gap-6 sm:gap-7 max-w-2xl sm:max-w-3xl' : 'gap-5 sm:gap-6 max-w-xl'} w-full mx-auto select-none pt-1 sm:pt-2`}>
              {/* Bubble 1 */}
              <div
                onClick={handleFavPicClick}
                className={`relative ${readOnly ? 'p-5 sm:p-7' : 'p-4 sm:p-5'} rounded-3xl backdrop-blur-xs border shadow-md text-center transition-transform hover:scale-102 cursor-pointer group`}
                style={{
                  backgroundColor: `${theme.scallopLight}f0`,
                  borderColor: `${theme.scallopColor}88`,
                  boxShadow: `0 8px 24px -4px ${theme.btnShadow}`,
                }}
              >
                <WashiTapeSticker className="-top-2 -left-2" width={readOnly ? 64 : 52} height={readOnly ? 19 : 16} rotate={-8} color={theme.scallopColor} />
                <div className="absolute -top-3.5 -right-2 z-20">
                  <CuteBowSticker size={readOnly ? 36 : 28} color="#f472b6" rotate={12} onClick={() => sounds.playPop()} />
                </div>
                <div className="absolute -bottom-2.5 -left-1.5 z-20">
                  <PuffyHeartSticker size={readOnly ? 28 : 22} color="#fb7185" rotate={-12} onClick={() => sounds.playPop()} />
                </div>

                <div
                  className={`font-sans-clean font-bold ${readOnly ? 'text-[clamp(1.15rem,2.4vw,1.85rem)]' : 'text-[clamp(1rem,2.1vw,1.45rem)]'} tracking-wide leading-snug`}
                  style={{ color: theme.accentColor }}
                >
                  {activeTexts.bubble1Line1 && (
                    <div className="flex items-center justify-center gap-2">
                      <CuteSparkleStar size={readOnly ? 20 : 16} color="#facc15" rotate={8} onClick={() => sounds.playPop()} />
                      <span>{activeTexts.bubble1Line1}</span>
                      <DaisyFlowerSticker size={readOnly ? 26 : 20} rotate={15} onClick={() => sounds.playPop()} />
                    </div>
                  )}
                  {activeTexts.bubble1Line2 && (
                    <div className="flex items-center justify-center gap-2 mt-0.5">
                      <PuffyHeartSticker size={readOnly ? 22 : 18} color="#ec4899" rotate={-10} onClick={() => sounds.playPop()} />
                      <span>{activeTexts.bubble1Line2}</span>
                      <CuteSparkleStar size={readOnly ? 20 : 16} color="#38bdf8" rotate={-12} onClick={() => sounds.playPop()} />
                    </div>
                  )}
                </div>
              </div>

              {/* Bubble 2 */}
              <div
                onClick={handleFavPicClick}
                className={`relative ${readOnly ? 'p-6 sm:p-8' : 'p-5 sm:p-6'} rounded-3xl backdrop-blur-xs border shadow-md text-center transition-transform hover:scale-102 cursor-pointer group`}
                style={{
                  backgroundColor: `${theme.scallopLight}f0`,
                  borderColor: `${theme.scallopColor}88`,
                  boxShadow: `0 8px 24px -4px ${theme.btnShadow}`,
                }}
              >
                <div className="absolute -top-4 -left-2.5 z-20">
                  <CuteBunnySticker size={readOnly ? 38 : 32} rotate={-10} onClick={() => sounds.playPop()} />
                </div>
                <div className="absolute -top-3 -right-2.5 z-20">
                  <DaisyFlowerSticker size={readOnly ? 32 : 26} rotate={14} onClick={() => sounds.playPop()} />
                </div>
                <div className="absolute -bottom-2.5 -right-1.5 z-20">
                  <CuteStrawberrySticker size={readOnly ? 30 : 24} rotate={14} onClick={() => sounds.playPop()} />
                </div>
                <WashiTapeSticker className="-bottom-2 -left-1" width={readOnly ? 58 : 48} height={readOnly ? 18 : 15} rotate={6} color={theme.scallopColor} />

                <div
                  className={`font-sans-clean font-bold ${readOnly ? 'text-[clamp(1.1rem,2.3vw,1.75rem)]' : 'text-[clamp(0.95rem,2.1vw,1.45rem)]'} tracking-wide leading-relaxed`}
                  style={{ color: theme.accentColor }}
                >
                  {activeTexts.bubble2Line1 && (
                    <div className="flex items-center justify-center gap-2">
                      <CuteSparkleStar size={readOnly ? 18 : 15} color="#facc15" rotate={10} onClick={() => sounds.playPop()} />
                      <span>{activeTexts.bubble2Line1}</span>
                      <CuteSparkleStar size={readOnly ? 18 : 15} color="#fb7185" rotate={-8} onClick={() => sounds.playPop()} />
                    </div>
                  )}
                  {activeTexts.bubble2Line2 && <p>{activeTexts.bubble2Line2}</p>}
                  {activeTexts.bubble2Line3 && (
                    <div className="flex items-center justify-center gap-2">
                      <span>{activeTexts.bubble2Line3}</span>
                      <DaisyFlowerSticker size={readOnly ? 21 : 17} rotate={-10} onClick={() => sounds.playPop()} />
                    </div>
                  )}
                  {activeTexts.bubble2Line4 && (
                    <div className="flex items-center justify-center gap-2 font-extrabold">
                      <PuffyHeartSticker size={readOnly ? 22 : 18} color="#f43f5e" rotate={-8} onClick={() => sounds.playPop()} />
                      <span>{activeTexts.bubble2Line4}</span>
                      <PuffyHeartSticker size={readOnly ? 22 : 18} color="#fb7185" rotate={12} onClick={() => sounds.playPop()} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BOTTOM FOOTER ROW: BUBU DUDU GIF & CTA BUTTON */}
            <div className="relative flex items-end justify-between w-full pt-2">
              <div
                className={`${readOnly ? 'w-36 sm:w-48 md:w-56 lg:w-60' : 'w-28 sm:w-36 md:w-40'} z-20 select-none cursor-pointer group transition-all duration-300 hover:scale-108 active:scale-95`}
                title="Bubu & Dudu 💕"
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playPaperRustle();
                }}
                style={{
                  filter: 'drop-shadow(0 6px 14px rgba(20, 40, 70, 0.22))',
                }}
              >
                <img
                  src="/assets/aistudio/bubu_dudu_page6.gif"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://media.tenor.com/_pfZZ7R8PjwAAAAi/tkthao219-bubududu.gif';
                  }}
                  alt="Bubu & Dudu animation"
                  className="w-full h-auto object-contain pointer-events-none"
                />
              </div>

              <button
                onClick={handleFavPicClick}
                onMouseEnter={() => sounds.playClick()}
                disabled={cinematicStep !== 'idle'}
                className={`${readOnly ? 'px-8 sm:px-12 py-3 sm:py-4 text-[clamp(0.82rem,1.5vw,1.15rem)]' : 'px-6 sm:px-9 py-2.5 sm:py-3 text-[clamp(0.7rem,1.3vw,0.9rem)]'} rounded-full text-white font-sans-clean font-extrabold tracking-[0.16em] uppercase transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 whitespace-nowrap mb-1`}
                style={{
                  backgroundColor: theme.btnBg,
                  boxShadow: `0 8px 24px ${theme.btnShadow}`,
                }}
              >
                <span>{activeTexts.buttonText}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cinematic Camera Clicking & Flash Animation Overlay */}
        {cinematicStep !== 'idle' && (
          <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center pointer-events-none select-none">
            <div
              className={`fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity duration-300 pointer-events-none ${
                cinematicStep === 'white_flash' ? 'opacity-0' : 'opacity-100'
              }`}
            />

            <div
              className={`fixed inset-6 sm:inset-12 md:inset-16 border-2 border-white/40 rounded-3xl pointer-events-none flex flex-col justify-between p-4 sm:p-6 z-20 transition-opacity duration-200 ${
                cinematicStep === 'white_flash' ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="flex justify-between items-center text-white text-xs sm:text-sm font-mono font-bold tracking-widest drop-shadow-md">
                <span className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs border border-white/20">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      cinematicStep === 'camera_clicked' ? 'bg-red-500 animate-ping' : 'bg-red-500'
                    }`}
                  />
                  <span>
                    {cinematicStep === 'camera_clicked'
                      ? 'CAPTURE [SNAP!]'
                      : countdown !== null && countdown > 0
                      ? `SELF-TIMER: 0${countdown}s`
                      : 'REC [OUR MEMORIES]'}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs border border-white/20 text-emerald-400">
                  <span>AF-LOCKED</span>
                  <span>🔒</span>
                </span>
              </div>
              <div className="flex justify-between items-center text-white/80 text-xs sm:text-sm font-mono drop-shadow-md">
                <span className="bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-xs">1/500s · f/1.4 · 85mm</span>
                <span className="bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-xs">ISO 100 · HDR RAW</span>
              </div>
            </div>

            <div
              className={`relative z-30 flex flex-col items-center justify-center transition-all duration-200 ease-out transform ${
                cinematicStep === 'show_camera'
                  ? 'scale-[1.3] sm:scale-[1.65] md:scale-[2.0] animate-in zoom-in-50 duration-300'
                  : cinematicStep === 'camera_clicked'
                  ? 'scale-[1.2] sm:scale-[1.55] md:scale-[1.88] transition-transform duration-100'
                  : 'scale-[2.2] opacity-0 transition-all duration-150'
              }`}
            >
              {countdown !== null && countdown > 0 && (
                <div
                  key={countdown}
                  className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-500 text-white font-bubble text-2xl sm:text-3xl font-extrabold shadow-2xl border-4 border-white animate-in zoom-in-75 duration-150 z-50 drop-shadow-xl"
                >
                  <span>{countdown}</span>
                </div>
              )}

              <div
                className="relative p-4 rounded-3xl bg-white/20 backdrop-blur-md border-2 border-white/40 shadow-2xl"
                style={{
                  boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 255, 255, 0.2)',
                }}
              >
                <ScrapbookPage7Camera
                  theme={theme}
                  rotate={cinematicStep === 'camera_clicked' ? 4 : -2}
                  sizeClass="w-36 h-28 sm:w-44 sm:h-34 md:w-52 md:h-40"
                  showStrap={true}
                  isTriggering={cinematicStep === 'camera_clicked'}
                />

                {cinematicStep === 'camera_clicked' && (
                  <div className="absolute inset-0 rounded-3xl bg-white/80 animate-ping pointer-events-none" />
                )}
              </div>

              <div
                className="mt-6 px-6 py-2.5 rounded-full bg-white/95 shadow-2xl border-2 text-center transition-all duration-200"
                style={{
                  borderColor: theme.accentColor,
                  boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                }}
              >
                <span
                  className="font-bubble text-sm sm:text-base font-extrabold tracking-wide uppercase"
                  style={{ color: theme.accentColor }}
                >
                  {cinematicStep === 'camera_clicked'
                    ? '✨ SNAP! CAPTURING MOMENT... 📸'
                    : countdown !== null && countdown > 0
                    ? `⏱️ Camera Countdown: ${countdown}... Strike a cute pose! 🥰`
                    : '📸 Ready for Page 7... Smile! ✨'}
                </span>
              </div>
            </div>

            <div
              className={`fixed inset-0 z-[100] bg-white pointer-events-none transition-opacity duration-150 ease-in-out ${
                cinematicStep === 'white_flash' ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        )}
      </div>

      {/* Lightbox / Zoom Modal for Photo */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsZoomOpen(false);
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
                Favorite Memory
              </span>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                        fileInputRef.current.click();
                      }
                    }}
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
                  onClick={() => setIsZoomOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <img
              src={activePhotos.main}
              alt="Memory zoom"
              className="w-full max-h-[70vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* Page 6 Text & Photo Customization Modals */}
      {!readOnly && (
        <>
          <PageTextEditorModal
            isOpen={isTextModalOpen}
            onClose={() => setIsTextModalOpen(false)}
            pageTitle="Page 6"
            fields={PAGE6_TEXT_FIELDS}
            values={activeTexts}
            defaultValues={DEFAULT_ALL_PAGES_TEXTS.page6}
            onChange={handleUpdateTexts}
            theme={theme}
          />

          <PagePhotosModal
            isOpen={isPhotosModalOpen}
            onClose={() => setIsPhotosModalOpen(false)}
            pageTitle="Page 6"
            slots={PAGE6_PHOTO_SLOTS}
            photos={activePhotos}
            defaultPhotos={DEFAULT_ALL_PAGES_PHOTOS.page6}
            onChange={handleUpdatePhotos}
            theme={theme}
          />
        </>
      )}
    </div>
  );
};
