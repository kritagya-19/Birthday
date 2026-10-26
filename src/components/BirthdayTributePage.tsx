import React, { useState, useRef } from 'react';
import { sounds } from '../utils/audio';
import { ArrowLeft, Upload, ZoomIn, X, Play, Pause } from 'lucide-react';
import {
  SoftSparkle,
  PuffyHeartSticker,
  CuteSparkleStar,
  CuteBunnySticker,
  ScrapbookNoteBox,
} from './ScrapbookAssets';
import { ColorTheme, THEMES } from '../theme/colorThemes';
import {
  Page5Texts,
  Page5Photos,
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

interface BirthdayTributePageProps {
  onBack: () => void;
  onOpenMessage: () => void;
  theme?: ColorTheme;
  texts?: Page5Texts;
  onChangeTexts?: (next: Page5Texts) => void;
  photos?: Page5Photos;
  onChangePhotos?: (next: Page5Photos) => void;
  readOnly?: boolean;
}

const PAGE5_TEXT_FIELDS: TextFieldConfig<Page5Texts>[] = [
  { key: 'heading', label: 'Top Display Heading' },
  { key: 'card1', label: 'First Note Card Text' },
  { key: 'card2Line1', label: 'Second Note Card · Line 1' },
  { key: 'card2Line2', label: 'Second Note Card · Line 2' },
  { key: 'card2Line3', label: 'Second Note Card · Line 3' },
  { key: 'buttonText', label: 'Action Button Text' },
  { key: 'frame1Title', label: 'Film Reel Frame 1 Caption' },
  { key: 'frame2Title', label: 'Film Reel Frame 2 Caption' },
  { key: 'frame3Title', label: 'Film Reel Frame 3 Caption' },
  { key: 'frame4Title', label: 'Film Reel Frame 4 Caption' },
  { key: 'frame5Title', label: 'Film Reel Frame 5 Caption' },
];

const PAGE5_PHOTO_SLOTS: PhotoSlotConfig<keyof Page5Photos>[] = [
  { key: 'mirror', label: 'Film Frame 1', aspectClass: 'aspect-[4/3]' },
  { key: 'dinner', label: 'Film Frame 2', aspectClass: 'aspect-[4/3]' },
  { key: 'roses', label: 'Film Frame 3', aspectClass: 'aspect-[4/3]' },
  { key: 'kiss', label: 'Film Frame 4', aspectClass: 'aspect-[4/3]' },
  { key: 'selfie', label: 'Film Frame 5', aspectClass: 'aspect-[4/3]' },
];

export const BirthdayTributePage: React.FC<BirthdayTributePageProps> = ({
  onBack,
  onOpenMessage,
  theme = THEMES[0],
  texts,
  onChangeTexts,
  photos,
  onChangePhotos,
  readOnly = false,
}) => {
  const [localTexts, setLocalTexts] = useState<Page5Texts>(DEFAULT_ALL_PAGES_TEXTS.page5);
  const [localPhotos, setLocalPhotos] = useState<Page5Photos>(DEFAULT_ALL_PAGES_PHOTOS.page5);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);
  const [isReelPlaying, setIsReelPlaying] = useState(true);

  const activeTexts = texts ?? localTexts;
  const activePhotos = photos ?? localPhotos;

  const handleUpdateTexts = (next: Page5Texts) => {
    if (onChangeTexts) onChangeTexts(next);
    else setLocalTexts(next);
  };

  const handleUpdatePhotos = (next: Page5Photos) => {
    if (onChangePhotos) onChangePhotos(next);
    else setLocalPhotos(next);
  };

  const filmFrames: { id: keyof Page5Photos; url: string; title: string }[] = [
    { id: 'mirror', url: activePhotos.mirror, title: activeTexts.frame1Title },
    { id: 'dinner', url: activePhotos.dinner, title: activeTexts.frame2Title },
    { id: 'roses', url: activePhotos.roses, title: activeTexts.frame3Title },
    { id: 'kiss', url: activePhotos.kiss, title: activeTexts.frame4Title },
    { id: 'selfie', url: activePhotos.selfie, title: activeTexts.frame5Title },
  ];

  const activePhotosRef = useRef<Page5Photos>(activePhotos);
  activePhotosRef.current = activePhotos;

  const [activePhotoModal, setActivePhotoModal] = useState<keyof Page5Photos | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<keyof Page5Photos>('mirror');

  const handleNextClick = () => {
    sounds.playPaperRustle();
    sounds.playPop();
    onOpenMessage();
  };

  const handleTriggerUpload = (targetId: keyof Page5Photos) => {
    uploadTargetRef.current = targetId;
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

      {/* Top back navigation & Text / Photos controls */}
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

        <div className="flex flex-wrap items-center gap-2">
          {/* Reel Auto-Scroll Play/Pause Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsReelPlaying(!isReelPlaying);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border shadow-xs transition-all cursor-pointer ${
              isReelPlaying
                ? 'bg-white/90 hover:bg-white'
                : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}
            style={
              isReelPlaying
                ? { color: theme.accentColor, borderColor: theme.borderHeader }
                : {}
            }
            title={isReelPlaying ? 'Pause film reel scroll' : 'Resume film reel scroll'}
          >
            {isReelPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pause Reel</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
                <span className="hidden sm:inline">Play Reel</span>
              </>
            )}
          </button>

          {!readOnly && (
            <PageActionButtons
              onOpenTextEditor={() => setIsTextModalOpen(true)}
              onOpenPhotoEditor={() => setIsPhotosModalOpen(true)}
              photoCount={5}
              theme={theme}
            />
          )}
        </div>
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
          <div className="absolute inset-0 paper-texture pointer-events-none opacity-40 z-0" />

          {/* Tilted Vintage Medium-Format Filmstrip */}
          <div
            className={`absolute left-[0%] sm:left-[3%] md:left-[5%] top-[-38%] bottom-[-38%] ${
              readOnly
                ? 'w-[clamp(320px,29vw,470px)]'
                : 'w-[285px] sm:w-[308px] md:w-[325px]'
            } transform -rotate-[15.2deg] flex flex-col items-center pointer-events-auto z-15 group select-none`}
            style={{
              filter: `drop-shadow(0 22px 42px rgba(0, 0, 0, 0.46)) drop-shadow(0 5px 16px ${theme.btnShadow})`,
            }}
          >
            <div
              className="relative w-full h-full overflow-hidden rounded-xl border border-white/25 shadow-2xl"
              style={{
                backgroundColor: theme.darkFrame,
                boxShadow: 'inset 0 0 16px rgba(0,0,0,0.4)',
              }}
            >
              <div
                className={`w-full flex flex-col ${
                  isReelPlaying ? 'animate-film-scroll-down' : ''
                } group-hover:[animation-play-state:paused]`}
                style={{
                  animationPlayState: isReelPlaying ? undefined : 'paused',
                }}
              >
                {[0, 1].map((setIndex) => (
                  <div key={`film-set-${setIndex}`} className="w-full flex flex-col shrink-0">
                    {filmFrames.map((photo, photoIndex) => {
                      const currentFrame = 112 + photoIndex;
                      const nextFrame = currentFrame + 1;
                      return (
                        <div
                          key={`photo-frame-${setIndex}-${photo.id}`}
                          className="w-full flex flex-col shrink-0 select-none"
                        >
                          <div
                            className="relative w-full flex items-center px-1 py-1"
                            style={{ backgroundColor: theme.darkFrame }}
                          >
                            {/* Left film margin rail */}
                            <div className="w-[18px] sm:w-[22px] shrink-0 h-full flex flex-col items-center justify-between py-2.5 text-[7px] sm:text-[8px] font-mono text-white/70 select-none">
                              <span className="[writing-mode:vertical-rl] rotate-180 font-bold tracking-widest text-white/90">
                                ▶ {currentFrame}
                              </span>
                              <span className="[writing-mode:vertical-rl] rotate-180 text-white/50 tracking-wider text-[6px] sm:text-[7px]">
                                FUJICOLOR
                              </span>
                              <span className="[writing-mode:vertical-rl] rotate-180 text-white/40 tracking-wider text-[6px]">
                                E100G
                              </span>
                            </div>

                            {/* Main Photo in vintage frame */}
                            <div className="relative flex-1 aspect-[4/3] bg-slate-950 overflow-hidden rounded-xs border border-white/30 group/photo cursor-pointer shrink shadow-inner">
                              <img
                                src={photo.url}
                                alt={photo.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/photo:scale-105"
                                referrerPolicy="no-referrer"
                                onClick={() => setActivePhotoModal(photo.id)}
                              />

                              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10 pointer-events-none" />

                              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/photo:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                                {photo.title && (
                                  <span className="text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase text-center drop-shadow-sm line-clamp-1">
                                    {photo.title}
                                  </span>
                                )}
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActivePhotoModal(photo.id);
                                    }}
                                    className="p-1.5 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                                    title="View Full Size"
                                  >
                                    <ZoomIn className="w-3.5 h-3.5" />
                                  </button>
                                  {!readOnly && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTriggerUpload(photo.id);
                                      }}
                                      className="p-1.5 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                                      title="Replace Photo"
                                    >
                                      <Upload className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right film margin rail */}
                            <div className="w-[18px] sm:w-[22px] shrink-0 h-full flex flex-col items-center justify-between py-2.5 text-[7px] sm:text-[8px] font-mono text-white/70 select-none">
                              <span className="[writing-mode:vertical-rl] rotate-180 text-white/40 tracking-wider text-[6px]">
                                36 EXP
                              </span>
                              <span className="[writing-mode:vertical-rl] rotate-180 text-white/60 tracking-wider text-[6px] sm:text-[7px]">
                                SAFETY
                              </span>
                              <span className="[writing-mode:vertical-rl] rotate-180 font-bold tracking-widest text-white/90">
                                ▶ {nextFrame}
                              </span>
                            </div>
                          </div>

                          {/* Horizontal Film Divider Bar */}
                          <div
                            className="w-full flex items-center justify-between px-3 py-1.5 text-[8px] sm:text-[9.5px] font-mono text-white/85 tracking-widest select-none shrink-0 border-t border-b border-white/15"
                            style={{ backgroundColor: theme.darkFrame }}
                          >
                            <span className="font-bold flex items-center gap-1 text-white/90">
                              <span className="text-[7px]">▶</span> {currentFrame}
                            </span>
                            <span className="font-bold tracking-[0.22em] text-[8px] sm:text-[9px] text-white">
                              SAFETY FILM
                            </span>
                            <span className="font-bold flex items-center gap-1 text-white/90">
                              <span className="text-[7px]">▶</span> {nextFrame}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT ZONE: HEADING + SENTIMENT CARDS + NEXT BUTTON */}
          <div className="relative ml-auto w-[54%] sm:w-[55%] h-full flex flex-col justify-between py-5 sm:py-6 px-3 sm:px-6 md:px-8 z-10 overflow-hidden">
            {/* BOLD DISPLAY WORDMARK AT TOP */}
            <div className="relative z-10 text-center select-none pt-1">
              <h1
                className={`font-bubble font-extrabold ${
                  readOnly
                    ? 'text-[clamp(2.7rem,7.4vw,6.4rem)]'
                    : 'text-[clamp(2.5rem,6.8vw,5.2rem)]'
                } leading-none tracking-[0.06em]`}
                style={{
                  color: theme.accentColor,
                  filter:
                    'drop-shadow(0 0 2px #ffffff) drop-shadow(0 3px 0 #ffffff) drop-shadow(0 -1px 0 #ffffff) drop-shadow(0 4px 8px rgba(0,0,0,0.18))',
                }}
              >
                {activeTexts.heading}
              </h1>
            </div>

            {/* MESSAGE CARDS */}
            <div className={`relative z-10 flex flex-col ${readOnly ? 'gap-4 max-w-2xl sm:max-w-3xl' : 'gap-3.5 max-w-xl'} my-auto mx-auto w-full select-none`}>
              <ScrapbookNoteBox
                onClick={() => sounds.playPop()}
                backingColor={theme.scallopColor}
                borderColor={theme.scallopColor}
                showPaperclip={true}
                paperclipSide="right"
                showBow={true}
                showButtons={false}
                showFlower={false}
                className="w-full"
              >
                <div className={`flex items-center justify-center gap-2 sm:gap-3 px-2 ${readOnly ? 'py-1 sm:py-2' : 'py-0.5'}`}>
                  <PuffyHeartSticker size={readOnly ? 26 : 20} color="#fb7185" rotate={-8} onClick={() => sounds.playPop()} />
                  <p
                    className={`font-sans-clean font-extrabold ${
                      readOnly
                        ? 'text-[clamp(0.95rem,2.1vw,1.45rem)]'
                        : 'text-[clamp(0.75rem,1.7vw,1.1rem)]'
                    } tracking-[0.14em] uppercase leading-snug text-center`}
                    style={{ color: theme.accentColor }}
                  >
                    {activeTexts.card1}
                  </p>
                  <CuteSparkleStar size={readOnly ? 24 : 18} color="#facc15" rotate={12} onClick={() => sounds.playPop()} />
                </div>
              </ScrapbookNoteBox>

              <ScrapbookNoteBox
                onClick={() => sounds.playPop()}
                backingColor={theme.scallopColor}
                borderColor={theme.scallopColor}
                showPaperclip={true}
                paperclipSide="right"
                showBow={false}
                showButtons={true}
                showFlower={true}
                className="w-full"
              >
                <div
                  className={`space-y-0.5 sm:space-y-1 font-sans-clean font-extrabold ${
                    readOnly
                      ? 'text-[clamp(0.85rem,1.8vw,1.35rem)] py-1'
                      : 'text-[clamp(0.68rem,1.5vw,0.98rem)]'
                  } tracking-[0.12em] uppercase leading-relaxed text-center px-4`}
                  style={{ color: theme.accentColor }}
                >
                  {activeTexts.card2Line1 && (
                    <div className="flex items-center justify-center gap-1.5">
                      <CuteSparkleStar size={readOnly ? 18 : 14} color="#facc15" />
                      <p>{activeTexts.card2Line1}</p>
                      <CuteSparkleStar size={readOnly ? 18 : 14} color="#facc15" />
                    </div>
                  )}
                  {activeTexts.card2Line2 && <p>{activeTexts.card2Line2}</p>}
                  {activeTexts.card2Line3 && (
                    <div className="flex items-center justify-center gap-2 pt-0.5">
                      <PuffyHeartSticker size={readOnly ? 22 : 16} color="#f472b6" rotate={-6} />
                      <p>{activeTexts.card2Line3}</p>
                      <CuteBunnySticker size={readOnly ? 24 : 18} rotate={8} />
                    </div>
                  )}
                </div>
              </ScrapbookNoteBox>

              {/* NEXT BUTTON */}
              <div className="flex items-center justify-start pt-1 sm:pt-2">
                <button
                  onClick={handleNextClick}
                  onMouseEnter={() => sounds.playClick()}
                  className={`relative group ${
                    readOnly
                      ? 'px-10 sm:px-14 py-2.5 sm:py-3.5 text-[clamp(0.82rem,1.5vw,1.15rem)]'
                      : 'px-8 sm:px-11 py-2 sm:py-2.5 text-[clamp(0.72rem,1.3vw,0.95rem)]'
                  } rounded-full text-white font-sans-clean font-extrabold tracking-[0.22em] uppercase transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/60 shadow-lg`}
                  style={{
                    backgroundColor: theme.btnBg,
                    boxShadow: `0 6px 18px ${theme.btnShadow}`,
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span>{activeTexts.buttonText}</span>
                    <span className="text-sm font-bold">➔</span>
                  </span>
                  <span className="absolute inset-0 rounded-full border-t border-white/35 pointer-events-none" />
                </button>
              </div>
            </div>

            {/* PANDA BEAR & BROWN BEAR ANIMATED GIF ON BOTTOM RIGHT SIDE */}
            <div
              className={`absolute bottom-1 sm:bottom-2 right-2 sm:right-4 ${
                readOnly
                  ? 'w-36 sm:w-48 md:w-56 lg:w-64'
                  : 'w-28 sm:w-36 md:w-40'
              } z-30 select-none cursor-pointer group transition-all duration-300 hover:scale-108 active:scale-95 pointer-events-auto`}
              title="Bubu & Dudu 🐻🐼"
              onClick={(e) => {
                e.stopPropagation();
                sounds.playPaperRustle();
              }}
              style={{
                filter: 'drop-shadow(0 6px 14px rgba(20, 40, 70, 0.28))',
              }}
            >
              <img
                src="/assets/aistudio/bubu_dudu_page5.gif"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://media.tenor.com/ejMtbLv7H-gAAAAi/panda-bear-brown-bear.gif';
                }}
                alt="Panda bear and brown bear"
                className="w-full h-auto object-contain pointer-events-none"
              />
            </div>

            <div className="absolute right-4 bottom-4 z-20 pointer-events-none opacity-40">
              <SoftSparkle size={24} />
            </div>
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
              <span
                className="font-bubble text-lg font-bold"
                style={{ color: theme.accentColor }}
              >
                Film Memory
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

      {/* Page 5 Text & Photos Customization Modals */}
      {!readOnly && (
        <>
          <PageTextEditorModal
            isOpen={isTextModalOpen}
            onClose={() => setIsTextModalOpen(false)}
            pageTitle="Page 5"
            fields={PAGE5_TEXT_FIELDS}
            values={activeTexts}
            defaultValues={DEFAULT_ALL_PAGES_TEXTS.page5}
            onChange={handleUpdateTexts}
            theme={theme}
          />

          <PagePhotosModal
            isOpen={isPhotosModalOpen}
            onClose={() => setIsPhotosModalOpen(false)}
            pageTitle="Page 5"
            slots={PAGE5_PHOTO_SLOTS}
            photos={activePhotos}
            defaultPhotos={DEFAULT_ALL_PAGES_PHOTOS.page5}
            onChange={handleUpdatePhotos}
            theme={theme}
          />
        </>
      )}
    </div>
  );
};
