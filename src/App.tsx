import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Heart, Link2, Loader2, Music } from 'lucide-react';
import { ScrapbookHero } from './components/ScrapbookHero';
import { SurprisePage } from './components/SurprisePage';
import { BirthdayPage } from './components/BirthdayPage';
import { MemoryFilmPage } from './components/MemoryFilmPage';
import { BirthdayTributePage } from './components/BirthdayTributePage';
import { FavoritePicPage } from './components/FavoritePicPage';
import { MemoryGalleryPage } from './components/MemoryGalleryPage';
import { DateProposalPage } from './components/DateProposalPage';
import { DateFinalePage } from './components/DateFinalePage';
import { ScrapbookMessageModal } from './components/ScrapbookMessageModal';
import {
  WebsiteMusicController,
  exportCurrentMusicForShare,
} from './components/WebsiteMusicModal';
import { HeartFloodTransition } from './components/HeartFloodTransition';
import { FlowerFloodTransition } from './components/FlowerFloodTransition';
import { LoveCardsCelebration } from './components/LoveCardsCelebration';
import {
  CuteHeartsCelebration,
  CuteHeartsBurstState,
} from './components/CuteHeartsCelebration';
import {
  SurpriseNoteData,
  DEFAULT_SURPRISE_NOTE,
} from './components/SurpriseNoteContent';
import { ScrapbookReelsSection } from './components/ScrapbookReelsSection';
import { sounds } from './utils/audio';
import { setGlobalConfettiTheme } from './utils/confetti';
import { ColorTheme, THEMES } from './theme/colorThemes';
import {
  AllPagesTexts,
  AllPagesPhotos,
  DEFAULT_ALL_PAGES_TEXTS,
  DEFAULT_ALL_PAGES_PHOTOS,
  loadSavedPageTexts,
  savePageTexts,
  loadSavedPagePhotos,
  loadSavedPagePhotosAsync,
  savePagePhotosAsync,
} from './utils/pageContentStore';
import {
  SharedSurprisePayload,
  fetchSurpriseShare,
  getShareSlugFromLocation,
  loadLocalShareMeta,
  saveSurpriseShare,
} from './utils/shareStore';

const SURPRISE_NOTE_STORAGE_KEY = 'scrapbook_mail_surprise_note_v1';
const THEME_STORAGE_KEY = 'scrapbook_mail_theme_id_v1';

type ScrapbookPageId =
  | 'home'
  | 'surprise'
  | 'birthday'
  | 'memories'
  | 'tribute'
  | 'favpic'
  | 'gallery'
  | 'date'
  | 'finale';

type AppViewMode = 'edit' | 'preview' | 'shared';

function loadSavedTheme(): ColorTheme {
  try {
    const savedId = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedId) {
      const found = THEMES.find((t) => t.id === savedId);
      if (found) return found;
    }
  } catch {
    // Ignore storage read errors
  }
  return THEMES[0];
}

export default function App() {
  const [initialShareSlug] = useState<string | null>(() => getShareSlugFromLocation());
  const [viewMode, setViewMode] = useState<AppViewMode>(() =>
    initialShareSlug ? 'shared' : 'edit'
  );

  const [currentPage, setCurrentPage] = useState<ScrapbookPageId>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(() => loadSavedTheme());
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [cameraFlashDissolve, setCameraFlashDissolve] = useState(false);
  const [heartFloodPhase, setHeartFloodPhase] = useState<'idle' | 'filling' | 'revealing'>('idle');
  const [flowerFloodPhase, setFlowerFloodPhase] = useState<'idle' | 'filling' | 'revealing'>('idle');
  const [loveCardsPhase, setLoveCardsPhase] = useState<'idle' | 'filling' | 'revealing'>('idle');
  const [cuteHeartsBurst, setCuteHeartsBurst] = useState<CuteHeartsBurstState>({
    active: false,
    originX: 0.82,
    originY: 0.78,
    burstKey: 0,
  });

  const heartTimersRef = useRef<number[]>([]);
  const flowerTimersRef = useRef<number[]>([]);
  const loveCardsTimersRef = useRef<number[]>([]);
  const cuteHeartsTimersRef = useRef<number[]>([]);

  // Shared partner view state when visiting `/s/:slug`
  const [sharedLoading, setSharedLoading] = useState<boolean>(Boolean(initialShareSlug));
  const [sharedError, setSharedError] = useState<string | null>(null);
  const [sharedPayload, setSharedPayload] = useState<SharedSurprisePayload | null>(null);

  // Creator Save / Preview / Custom Share Link state
  const [savedSlug, setSavedSlug] = useState<string>(() =>
    initialShareSlug ? '' : loadLocalShareMeta().savedSlug
  );
  const [hasReviewedSurpriseCard, setHasReviewedSurpriseCard] = useState<boolean>(() =>
    initialShareSlug ? false : Boolean(loadLocalShareMeta().savedSlug)
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [autoOpenSharePanel, setAutoOpenSharePanel] = useState<boolean>(false);

  const isSaved = Boolean(savedSlug);
  const isFullScreenPresentation = viewMode === 'preview' || viewMode === 'shared';

  // Centralized persistent text & photo state across all 9 pages (creator mode)
  const [pageTexts, setPageTexts] = useState<AllPagesTexts>(() =>
    initialShareSlug ? DEFAULT_ALL_PAGES_TEXTS : loadSavedPageTexts()
  );
  const [pagePhotos, setPagePhotos] = useState<AllPagesPhotos>(() =>
    initialShareSlug ? DEFAULT_ALL_PAGES_PHOTOS : loadSavedPagePhotos()
  );
  const userEditedPhotosRef = useRef(false);

  const markDirty = () => {
    if (viewMode !== 'shared' && savedSlug) {
      setHasUnsavedChanges(true);
    }
  };

  const updateCreatorTexts = (updater: (prev: AllPagesTexts) => AllPagesTexts) => {
    markDirty();
    setPageTexts((prev) => updater(prev));
  };

  const updatePagePhotos = (updater: (prev: AllPagesPhotos) => AllPagesPhotos) => {
    userEditedPhotosRef.current = true;
    markDirty();
    setPagePhotos((prev) => {
      const next = updater(prev);
      void savePagePhotosAsync(next);
      return next;
    });
  };

  // Hydrate shared surprise when partner opens custom `/s/:slug` link
  useEffect(() => {
    if (!initialShareSlug) return;
    let cancelled = false;
    setSharedLoading(true);
    setSharedError(null);

    fetchSurpriseShare(initialShareSlug)
      .then((res) => {
        if (cancelled) return;
        const payload = res.payload;
        setSharedPayload(payload);
        const matchedTheme = THEMES.find((t) => t.id === payload.themeId) || THEMES[0];
        setCurrentTheme(matchedTheme);
        document.title = 'A Special Surprise For You 💌';
        setSharedLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setSharedError(
          err instanceof Error
            ? err.message
            : 'Could not open this surprise link. Please check the link with your partner.'
        );
        setSharedLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialShareSlug]);

  // Hydrate IndexedDB photos in creator mode
  useEffect(() => {
    if (initialShareSlug) return;
    let mounted = true;
    loadSavedPagePhotosAsync().then((saved) => {
      if (mounted && saved && !userEditedPhotosRef.current) {
        setPagePhotos(saved);
      }
    });
    return () => {
      mounted = false;
    };
  }, [initialShareSlug]);

  const [surpriseNote, setSurpriseNote] = useState<SurpriseNoteData>(() => {
    if (initialShareSlug) return DEFAULT_SURPRISE_NOTE;
    try {
      const saved = localStorage.getItem(SURPRISE_NOTE_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SURPRISE_NOTE, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore storage read errors
    }
    return DEFAULT_SURPRISE_NOTE;
  });

  const handleUpdateSurpriseNote = (next: SurpriseNoteData) => {
    markDirty();
    setSurpriseNote(next);
  };

  useEffect(() => {
    if (viewMode === 'shared') return;
    savePageTexts(pageTexts);
  }, [pageTexts, viewMode]);

  useEffect(() => {
    if (viewMode === 'shared') return;
    try {
      localStorage.setItem(SURPRISE_NOTE_STORAGE_KEY, JSON.stringify(surpriseNote));
    } catch {
      // Ignore storage write errors
    }
  }, [surpriseNote, viewMode]);

  useEffect(() => {
    if (viewMode === 'shared') return;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme.id);
    } catch {
      // Ignore storage write errors
    }
  }, [currentTheme, viewMode]);

  // Sync star and particle colors whenever the active palette changes
  useEffect(() => {
    setGlobalConfettiTheme(currentTheme);
  }, [currentTheme]);

  // Save all 9 pages + Bouquet Surprise Note + Theme + Music locally & to custom share backend
  const handleSaveAllPages = async (
    customSlug?: string
  ): Promise<{ slug: string; shareUrl: string } | null> => {
    setIsSaving(true);
    setSaveError(null);
    try {
      savePageTexts(pageTexts);
      await savePagePhotosAsync(pagePhotos);
      try {
        localStorage.setItem(SURPRISE_NOTE_STORAGE_KEY, JSON.stringify(surpriseNote));
        localStorage.setItem(THEME_STORAGE_KEY, currentTheme.id);
      } catch {
        // Ignore localStorage quota warnings
      }

      const music = await exportCurrentMusicForShare();

      const payload: SharedSurprisePayload = {
        version: 1,
        themeId: currentTheme.id,
        pageTexts,
        pagePhotos,
        surpriseNote,
        music,
      };

      const saved = await saveSurpriseShare({
        slug: customSlug,
        payload,
      });

      setSavedSlug(saved.slug);
      setHasReviewedSurpriseCard(true);
      setHasUnsavedChanges(false);
      return { slug: saved.slug, shareUrl: saved.shareUrl };
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error
          ? err.message
          : 'Could not save all pages right now. Please try again.'
      );
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartPreview = () => {
    setAutoOpenSharePanel(false);
    setCurrentPage('home');
    setViewMode('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.requestFullscreen?.().catch(() => {
      // Fullscreen may be restricted inside embedded iframes; viewport full-screen layout still activates
    });
  };

  const handleExitPreview = (openShareDrawer = false) => {
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
    setAutoOpenSharePanel(openShareDrawer);
    setViewMode('edit');
    setCurrentPage('finale');
  };

  const handleOpenMusicSettings = () => {
    sounds.playPop();
    setIsMusicModalOpen(true);
  };

  const handleOpenPage2 = () => {
    setCurrentPage('surprise');
  };

  const handleConfirmSurprise = () => {
    setCurrentPage('birthday');
  };

  const handleOpenPage4 = () => {
    setCurrentPage('memories');
  };

  // Called when "LOVE YOU ALWAYS" on Page 4 is clicked: fills full screen with cute flowers, then automatically opens Page 5
  const handleOpenPage5 = () => {
    if (flowerFloodPhase !== 'idle') return;
    flowerTimersRef.current.forEach((id) => window.clearTimeout(id));

    setFlowerFloodPhase('filling');

    const swapTimer = window.setTimeout(() => {
      setCurrentPage('tribute');
      sounds.playChime();
      setFlowerFloodPhase('revealing');
    }, 1550);

    const doneTimer = window.setTimeout(() => {
      setFlowerFloodPhase('idle');
    }, 2230);

    flowerTimersRef.current = [swapTimer, doneTimer];
  };

  // Called when "NEXT" on Page 5 is clicked: fills screen with small cute "LOVE" cards, then automatically opens Page 6
  const handleOpenPage6 = () => {
    if (loveCardsPhase !== 'idle') return;
    loveCardsTimersRef.current.forEach((id) => window.clearTimeout(id));

    setLoveCardsPhase('filling');

    const rustleTimer = window.setTimeout(() => {
      sounds.playPaperRustle();
    }, 260);

    const swapTimer = window.setTimeout(() => {
      setCurrentPage('favpic');
      sounds.playChime();
      setLoveCardsPhase('revealing');
    }, 1720);

    const doneTimer = window.setTimeout(() => {
      setLoveCardsPhase('idle');
    }, 2380);

    loveCardsTimersRef.current = [rustleTimer, swapTimer, doneTimer];
  };

  const handleOpenPage7 = () => {
    setCameraFlashDissolve(true);
    setCurrentPage('gallery');
    setTimeout(() => {
      setCameraFlashDissolve(false);
    }, 520);
  };

  // Called when "OUR LOVE STORY" on Page 7 is clicked: bursts & flutters cute hearts, then opens Page 8
  const handleOpenPage8 = (originX = 0.82, originY = 0.78) => {
    if (cuteHeartsBurst.active) return;
    cuteHeartsTimersRef.current.forEach((id) => window.clearTimeout(id));

    setCuteHeartsBurst((prev) => ({
      active: true,
      originX,
      originY,
      burstKey: prev.burstKey + 1,
    }));

    const swapTimer = window.setTimeout(() => {
      setCurrentPage('date');
    }, 820);

    const doneTimer = window.setTimeout(() => {
      setCuteHeartsBurst((prev) => ({ ...prev, active: false }));
    }, 1580);

    cuteHeartsTimersRef.current = [swapTimer, doneTimer];
  };

  useEffect(() => {
    return () => {
      heartTimersRef.current.forEach((id) => window.clearTimeout(id));
      flowerTimersRef.current.forEach((id) => window.clearTimeout(id));
      loveCardsTimersRef.current.forEach((id) => window.clearTimeout(id));
      cuteHeartsTimersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const handleOpenPage9 = () => {
    setCurrentPage('finale');
  };

  // Called when YES button on Page 8 is tapped: fills full screen with hearts, then automatically opens Page 9
  const handleAcceptDateWithHearts = () => {
    if (heartFloodPhase !== 'idle') return;
    heartTimersRef.current.forEach((id) => window.clearTimeout(id));

    setHeartFloodPhase('filling');

    const swapTimer = window.setTimeout(() => {
      setCurrentPage('finale');
      sounds.playChime();
      setHeartFloodPhase('revealing');
    }, 1500);

    const doneTimer = window.setTimeout(() => {
      setHeartFloodPhase('idle');
    }, 2180);

    heartTimersRef.current = [swapTimer, doneTimer];
  };

  const activeTexts =
    viewMode === 'shared' && sharedPayload ? sharedPayload.pageTexts : pageTexts;
  const activePhotos =
    viewMode === 'shared' && sharedPayload ? sharedPayload.pagePhotos : pagePhotos;
  const activeSurpriseNote =
    viewMode === 'shared' && sharedPayload ? sharedPayload.surpriseNote : surpriseNote;

  // Loading & Error Screens for Shared Partner Link (`/s/:slug`)
  if (viewMode === 'shared' && sharedLoading) {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center p-6 font-sans-clean select-none"
        style={{ backgroundColor: currentTheme.bgApp }}
      >
        <div className="bg-[#faf5e8] rounded-3xl px-8 py-9 border-4 border-[#efe6d2] shadow-2xl max-w-md w-full text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-[#e11d48] flex items-center justify-center shadow-xs">
            <Heart className="w-7 h-7 fill-current animate-pulse" />
          </div>
          <h1
            className="font-bubble text-2xl font-black tracking-wide"
            style={{ color: currentTheme.accentColor }}
          >
            Opening Your Surprise...
          </h1>
          <p className="text-sm text-slate-600 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#e11d48]" />
            <span>Unwrapping all 9 pages &amp; love notes ♥</span>
          </p>
        </div>
      </div>
    );
  }

  if (viewMode === 'shared' && (sharedError || !sharedPayload)) {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center p-6 font-sans-clean select-none"
        style={{ backgroundColor: currentTheme.bgApp }}
      >
        <div className="bg-[#faf5e8] rounded-3xl p-7 sm:p-9 border-4 border-[#efe6d2] shadow-2xl max-w-md w-full text-center space-y-4">
          <div className="text-4xl">💌</div>
          <h1
            className="font-bubble text-2xl font-black tracking-wide"
            style={{ color: currentTheme.accentColor }}
          >
            Surprise Link Not Found
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {sharedError ||
              'This custom surprise link could not be found. Please double-check the URL that was shared with you.'}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Try Again
            </button>
            <a
              href="/"
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-transform hover:scale-103 cursor-pointer"
              style={{ backgroundColor: currentTheme.btnBg }}
            >
              Create Your Own Surprise 💌
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-slate-800 flex flex-col font-sans-clean transition-colors duration-500"
      style={{ backgroundColor: currentTheme.bgApp }}
    >
      {/* Floating Creator Control Pill ONLY in Preview Mode (never shown on Shared Partner Link) */}
      {viewMode === 'preview' && (
        <div className="fixed top-3.5 left-3.5 z-50 flex items-center gap-2 bg-white/92 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ borderColor: currentTheme.borderHeader }}
        >
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              handleExitPreview(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
            style={{ color: currentTheme.accentColor }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Preview</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              handleExitPreview(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold shadow-xs transition-transform hover:scale-103 cursor-pointer"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Share Link</span>
          </button>
        </div>
      )}

      {/* Top Bar (Creator Edit Mode Only) */}
      {!isFullScreenPresentation && (
        <header
          className="w-full backdrop-blur-md border-b sticky top-0 z-40 transition-colors duration-300"
          style={{
            backgroundColor: `${currentTheme.bgHeader}f2`,
            borderColor: currentTheme.borderHeader,
          }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
            {/* Wordmark */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="text-xl">💌</span>
              <span
                className="font-bubble text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap shrink-0 transition-colors duration-300"
                style={{ color: currentTheme.accentColor }}
              >
                Scrapbook Mail
              </span>
            </div>

            {/* Primary Action & Controls */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <button
                onClick={handleOpenMusicSettings}
                className="p-2 rounded-xl border transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: isMusicPlaying ? currentTheme.btnBg : 'rgba(255, 255, 255, 0.9)',
                  borderColor: isMusicPlaying ? currentTheme.btnBg : currentTheme.borderHeader,
                  color: isMusicPlaying ? currentTheme.btnText : currentTheme.accentColor,
                }}
                title={isMusicPlaying ? 'Website Music (Playing)' : 'Website Music'}
                aria-label="Website music settings"
              >
                <Music className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setIsModalOpen(true);
                }}
                className="px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: currentTheme.btnBg,
                  color: currentTheme.btnText,
                  boxShadow: `0 4px 14px ${currentTheme.btnShadow}`,
                }}
              >
                Surprise Note
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main
        className={
          isFullScreenPresentation
            ? 'min-h-screen w-full flex-1 flex flex-col items-center justify-center py-3 sm:py-5'
            : 'flex-1 flex flex-col justify-center py-6 sm:py-10'
        }
      >
        {/* Color Palette Switcher (Creator Edit Mode Only) */}
        {!isFullScreenPresentation && (
          <div className="max-w-5xl mx-auto w-full px-4 mb-4 flex items-center justify-end">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
              <span className="text-slate-500 font-medium">Palette:</span>
              {THEMES.map((theme) => {
                const isSelected = currentTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      sounds.playPop();
                      markDirty();
                      setCurrentTheme(theme);
                    }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-white shadow-xs'
                        : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: currentTheme.accentColor,
                            color: currentTheme.accentColor,
                          }
                        : {}
                    }
                    title={theme.name}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: theme.scallopColor }}
                    />
                    <span>{theme.shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PAGES 1 – 9 */}
        {currentPage === 'home' && (
          <section id="hero-showcase" className="w-full my-auto">
            <ScrapbookHero
              onOpenMessage={handleOpenPage2}
              accentColor={currentTheme.accentColor}
              scallopColor={currentTheme.scallopColor}
              ginghamClass={currentTheme.ginghamClass}
              theme={currentTheme}
              texts={activeTexts.page1}
              onChangeTexts={(next) => updateCreatorTexts((prev) => ({ ...prev, page1: next }))}
              photos={activePhotos.page1}
              onChangePhotos={(next) => updatePagePhotos((prev) => ({ ...prev, page1: next }))}
              readOnly={isFullScreenPresentation}
            />
          </section>
        )}

        {currentPage === 'surprise' && (
          <section id="surprise-showcase" className="w-full my-auto">
            <SurprisePage
              onBack={() => setCurrentPage('home')}
              onConfirmSurprise={handleConfirmSurprise}
              theme={currentTheme}
              texts={activeTexts.page2}
              onChangeTexts={(next) => updateCreatorTexts((prev) => ({ ...prev, page2: next }))}
              photos={activePhotos.page2}
              onChangePhotos={(next) => updatePagePhotos((prev) => ({ ...prev, page2: next }))}
              readOnly={isFullScreenPresentation}
            />
          </section>
        )}

        {currentPage === 'birthday' && (
          <section id="birthday-showcase" className="w-full my-auto">
            <BirthdayPage
              onBack={() => setCurrentPage('surprise')}
              onOpenMessage={handleOpenPage4}
              theme={currentTheme}
              texts={activeTexts.page3}
              onChangeTexts={(next) => updateCreatorTexts((prev) => ({ ...prev, page3: next }))}
              photos={activePhotos.page3}
              onChangePhotos={(next) => updatePagePhotos((prev) => ({ ...prev, page3: next }))}
              readOnly={isFullScreenPresentation}
            />
          </section>
        )}

        {currentPage === 'memories' && (
          <section id="memories-showcase" className="w-full my-auto">
            <MemoryFilmPage
              onBack={() => setCurrentPage('birthday')}
              onOpenMessage={handleOpenPage5}
              theme={currentTheme}
              texts={activeTexts.page4}
              onChangeTexts={(next) => updateCreatorTexts((prev) => ({ ...prev, page4: next }))}
              photos={activePhotos.page4}
              onChangePhotos={(next) => updatePagePhotos((prev) => ({ ...prev, page4: next }))}
              readOnly={isFullScreenPresentation}
            />
          </section>
        )}

        {currentPage === 'tribute' && (
          <section id="tribute-showcase" className="w-full my-auto">
            <BirthdayTributePage
              onBack={() => setCurrentPage('memories')}
              onOpenMessage={handleOpenPage6}
              theme={currentTheme}
              texts={activeTexts.page5}
              onChangeTexts={(next) => updateCreatorTexts((prev) => ({ ...prev, page5: next }))}
              photos={activePhotos.page5}
              onChangePhotos={(next) => updatePagePhotos((prev) => ({ ...prev, page5: next }))}
              readOnly={isFullScreenPresentation}
            />
          </section>
        )}

        {currentPage === 'favpic' && (
          <section id="favpic-showcase" className="w-full my-auto">
            <FavoritePicPage
              onBack={() => setCurrentPage('tribute')}
              onOpenMessage={handleOpenPage7}
              theme={currentTheme}
              texts={activeTexts.page6}
              onChangeTexts={(next) => updateCreatorTexts((prev) => ({ ...prev, page6: next }))}
              photos={activePhotos.page6}
              onChangePhotos={(next) => updatePagePhotos((prev) => ({ ...prev, page6: next }))}
              readOnly={isFullScreenPresentation}
            />
          </section>
        )}

        {currentPage === 'gallery' && (
          <section id="gallery-showcase" className="w-full my-auto">
            <MemoryGalleryPage
              onBack={() => setCurrentPage('favpic')}
              onOpenMessage={handleOpenPage8}
              theme={currentTheme}
              texts={activeTexts.page7}
              onChangeTexts={(next) => updateCreatorTexts((prev) => ({ ...prev, page7: next }))}
              photos={activePhotos.page7}
              onChangePhotos={(next) => updatePagePhotos((prev) => ({ ...prev, page7: next }))}
              readOnly={isFullScreenPresentation}
            />
          </section>
        )}

        {currentPage === 'date' && (
          <section id="date-proposal-showcase" className="w-full my-auto">
            <DateProposalPage
              onBack={() => setCurrentPage('gallery')}
              onNextPage={handleOpenPage9}
              onYesAccept={handleAcceptDateWithHearts}
              onRestartJourney={() => setCurrentPage('home')}
              theme={currentTheme}
              texts={activeTexts.page8}
              onChangeTexts={(next) => updateCreatorTexts((prev) => ({ ...prev, page8: next }))}
              photos={activePhotos.page8}
              onChangePhotos={(next) => updatePagePhotos((prev) => ({ ...prev, page8: next }))}
              readOnly={isFullScreenPresentation}
            />
          </section>
        )}

        {currentPage === 'finale' && (
          <section id="date-finale-showcase" className="w-full my-auto">
            <DateFinalePage
              onBack={() => setCurrentPage('date')}
              onRestartJourney={() => setCurrentPage('home')}
              theme={currentTheme}
              surpriseNote={activeSurpriseNote}
              texts={activeTexts.page9}
              onChangeTexts={(next) => updateCreatorTexts((prev) => ({ ...prev, page9: next }))}
              photos={activePhotos.page9}
              onChangePhotos={(next) => updatePagePhotos((prev) => ({ ...prev, page9: next }))}
              readOnly={isFullScreenPresentation}
              onOpenNoteEditor={() => setIsModalOpen(true)}
              hasReviewedSurpriseCard={hasReviewedSurpriseCard}
              onSurpriseCardViewed={() => setHasReviewedSurpriseCard(true)}
              isSaved={isSaved}
              hasUnsavedChanges={hasUnsavedChanges}
              isSaving={isSaving}
              savedSlug={savedSlug}
              saveError={saveError}
              onSaveAll={handleSaveAllPages}
              onStartPreview={handleStartPreview}
              autoOpenSharePanel={autoOpenSharePanel}
            />
          </section>
        )}

        {/* MORE LIKE THIS (Creator Edit Mode Only) */}
        {!isFullScreenPresentation && <ScrapbookReelsSection theme={currentTheme} />}
      </main>

      {/* FOOTER (Creator Edit Mode Only) */}
      {!isFullScreenPresentation && (
        <footer
          className="w-full border-t py-8 text-center text-xs transition-colors duration-300"
          style={{
            backgroundColor: currentTheme.footerBg,
            borderColor: currentTheme.borderHeader,
            color: '#64748b',
          }}
        >
          <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-base">🌸</span>
              <span style={{ color: currentTheme.accentColor }} className="font-semibold">
                Crafted with scrapbook love &amp; wholesome intentions
              </span>
            </div>
            <div className="text-slate-400">
              A handcrafted scrapbook greeting collection
            </div>
          </div>
        </footer>
      )}

      {/* HEADER SURPRISE NOTE EDITOR MODAL (Creator Edit Mode Only) */}
      {!isFullScreenPresentation && (
        <ScrapbookMessageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          accentColor={currentTheme.accentColor}
          themeName={currentTheme.name}
          theme={currentTheme}
          surpriseNote={surpriseNote}
          onChangeSurpriseNote={handleUpdateSurpriseNote}
          onSaveNote={() => setHasReviewedSurpriseCard(true)}
        />
      )}

      {/* PERSISTENT WEBSITE MUSIC CONTROLLER (Supports Creator, Preview & Shared Partner Modes) */}
      <WebsiteMusicController
        isOpen={!isFullScreenPresentation && isMusicModalOpen}
        onClose={() => setIsMusicModalOpen(false)}
        onPlayingStateChange={setIsMusicPlaying}
        onMusicChange={markDirty}
        sharedMusic={viewMode === 'shared' ? sharedPayload?.music ?? null : null}
        readOnly={isFullScreenPresentation}
        theme={currentTheme}
      />

      {/* Full Screen White Flash Dissolve Transition when Opening Page 7 */}
      {cameraFlashDissolve && (
        <div
          className="fixed inset-0 z-[100] pointer-events-none bg-white transition-opacity duration-500 ease-out animate-out fade-out"
          style={{ animationDuration: '520ms' }}
        />
      )}
      {/* Full Screen Cute Flowers Flood Transition when Clicking Love You Always on Page 4 -> Automatically Opens Page 5 */}
      <FlowerFloodTransition phase={flowerFloodPhase} theme={currentTheme} />
      {/* Small Cute "LOVE" Cards Celebration Transition when Clicking NEXT on Page 5 -> Automatically Opens Page 6 */}
      <LoveCardsCelebration phase={loveCardsPhase} theme={currentTheme} />
      {/* Cute Kawaii Hearts Burst & Flutter when Clicking "OUR LOVE STORY" on Page 7 -> Opens Page 8 */}
      <CuteHeartsCelebration burst={cuteHeartsBurst} theme={currentTheme} />
      {/* Full Screen Heart Flood Transition when Tapping YES on Page 8 -> Automatically Opens Page 9 */}
      <HeartFloodTransition phase={heartFloodPhase} />
    </div>
  );
}
