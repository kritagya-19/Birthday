import React, { useState, useEffect } from 'react';
import {
  Check,
  Copy,
  Eye,
  Heart,
  Link2,
  Loader2,
  Share2,
  Sparkles,
  Save,
} from 'lucide-react';
import { ColorTheme, THEMES } from '../theme/colorThemes';
import { sounds } from '../utils/audio';
import { firePaperConfetti } from '../utils/confetti';
import {
  buildShareUrl,
  copyTextToClipboard,
  getPublicShareOrigin,
  sanitizeCustomSlug,
} from '../utils/shareStore';

interface SavePreviewSharePanelProps {
  theme?: ColorTheme;
  hasReviewedSurpriseCard: boolean;
  onOpenSurpriseCard: () => void;
  isSaved: boolean;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  savedSlug: string;
  saveError: string | null;
  onSaveAll: (customSlug?: string) => Promise<{ slug: string; shareUrl: string } | null>;
  onStartPreview: () => void;
  autoOpenSharePanel?: boolean;
}

export const SavePreviewSharePanel: React.FC<SavePreviewSharePanelProps> = ({
  theme = THEMES[0],
  hasReviewedSurpriseCard,
  onOpenSurpriseCard,
  isSaved,
  hasUnsavedChanges,
  isSaving,
  savedSlug,
  saveError,
  onSaveAll,
  onStartPreview,
  autoOpenSharePanel = false,
}) => {
  const [isShareExpanded, setIsShareExpanded] = useState(autoOpenSharePanel);
  const [customSlugInput, setCustomSlugInput] = useState(savedSlug || '');
  const [copiedLink, setCopiedLink] = useState(false);
  const [justSavedPulse, setJustSavedPulse] = useState(false);
  const [slugUpdatedMsg, setSlugUpdatedMsg] = useState(false);

  useEffect(() => {
    if (savedSlug) {
      setCustomSlugInput(savedSlug);
    }
  }, [savedSlug]);

  useEffect(() => {
    if (autoOpenSharePanel && isSaved) {
      setIsShareExpanded(true);
    }
  }, [autoOpenSharePanel, isSaved]);

  const shareUrl = savedSlug ? buildShareUrl(savedSlug) : '';
  const publicOrigin = getPublicShareOrigin().replace(/^https?:\/\//, '');
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleSaveClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    sounds.playPop();
    const result = await onSaveAll(savedSlug || undefined);
    if (result) {
      sounds.playChime();
      firePaperConfetti(x, y, theme);
      setJustSavedPulse(true);
      window.setTimeout(() => setJustSavedPulse(false), 2200);
    }
  };

  const handleUpdateCustomSlug = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = sanitizeCustomSlug(customSlugInput);
    if (!cleaned || cleaned.length < 2) return;
    sounds.playPop();
    const result = await onSaveAll(cleaned);
    if (result) {
      sounds.playChime();
      setCustomSlugInput(result.slug);
      setSlugUpdatedMsg(true);
      window.setTimeout(() => setSlugUpdatedMsg(false), 2400);
    }
  };

  const handleCopyShareLink = async () => {
    if (!shareUrl) return;
    sounds.playPop();
    const ok = await copyTextToClipboard(shareUrl);
    if (ok) {
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2400);
    }
  };

  const handleNativeShare = async () => {
    if (!shareUrl || !canNativeShare) return;
    sounds.playPop();
    try {
      await navigator.share({
        title: 'A Special Birthday & Date Surprise For You 💌',
        text: 'Open this special surprise I made just for you ♥',
        url: shareUrl,
      });
    } catch {
      // User dismissed share sheet
    }
  };

  // Before opening the Surprise Card on Page 9 (if never saved yet), guide user to open the Surprise Card first
  if (!hasReviewedSurpriseCard && !isSaved) {
    return (
      <div className="mt-5 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div
          className="relative bg-[#faf5e8] rounded-3xl px-5 py-4 sm:px-7 sm:py-5 border-2 border-dashed shadow-md flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: `${theme.accentColor}55` }}
        >
          <div className="text-center sm:text-left">
            <h3
              className="font-bubble text-base sm:text-lg font-extrabold tracking-wide"
              style={{ color: theme.accentColor }}
            >
              One Last Touch: Check Your Bouquet Surprise Card
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Tap the Rose Bouquet above (or open below) to review your love note &amp; date details — your Save button will appear right after.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onOpenSurpriseCard();
            }}
            className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-transform hover:scale-103 active:scale-97 cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2"
            style={{
              backgroundColor: theme.btnBg,
              color: theme.btnText,
              boxShadow: `0 6px 16px ${theme.btnShadow}`,
            }}
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>Open Surprise Card</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div
        className="relative bg-[#faf5e8] rounded-3xl p-5 sm:p-7 border-4 border-[#efe6d2] shadow-xl"
        style={{
          boxShadow: '0 20px 45px -12px rgba(27, 60, 110, 0.25)',
        }}
      >
        {/* Top Washi Tape Accents */}
        <div
          className="absolute -top-2.5 left-10 w-24 h-5 -rotate-2 rounded-xs border-y border-dashed pointer-events-none"
          style={{
            backgroundColor: `${theme.scallopColor}cc`,
            borderColor: `${theme.accentColor}40`,
          }}
        />
        <div
          className="absolute -top-2.5 right-10 w-24 h-5 rotate-2 rounded-xs border-y border-dashed pointer-events-none"
          style={{
            backgroundColor: '#fecdd3cc',
            borderColor: '#e11d4840',
          }}
        />

        {/* Header + Primary Save Button Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left">
            <h3
              className="font-bubble text-lg sm:text-2xl font-black tracking-wide leading-tight"
              style={{ color: theme.accentColor }}
            >
              {isSaved && !hasUnsavedChanges
                ? 'All 9 Pages & Surprise Note Saved!'
                : 'Ready to Save Your Complete 9-Page Surprise?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {isSaved && !hasUnsavedChanges
                ? 'Preview the full-screen experience with animations, or grab your custom link to send to your partner.'
                : 'Saves all edited texts, uploaded photos across all 9 pages, music, color palette, and your Bouquet Surprise Note.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={isSaving}
              className="px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all hover:scale-103 active:scale-97 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
              style={{
                backgroundColor:
                  isSaved && !hasUnsavedChanges && !justSavedPulse
                    ? '#059669'
                    : '#e11d48',
                color: '#ffffff',
                boxShadow:
                  isSaved && !hasUnsavedChanges && !justSavedPulse
                    ? '0 6px 18px rgba(5, 150, 105, 0.28)'
                    : '0 8px 22px rgba(225, 29, 72, 0.32)',
              }}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving All Pages...</span>
                </>
              ) : isSaved && !hasUnsavedChanges ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.6]" />
                  <span>{justSavedPulse ? 'Saved All Pages ♥' : 'Saved · Click to Update'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isSaved && hasUnsavedChanges ? 'Save Changes' : 'Save'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Save Error Banner */}
        {saveError && (
          <div className="mt-3.5 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium text-left">
            {saveError}
          </div>
        )}

        {/* TWO POST-SAVE OPTIONS: 1. PREVIEW & 2. SHARE LINK */}
        {isSaved && (
          <div className="mt-5 pt-5 border-t border-[#e5ddc7] animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* OPTION 1: PREVIEW FULL SCREEN */}
              <button
                type="button"
                onClick={() => {
                  sounds.playChime();
                  onStartPreview();
                }}
                className="group px-5 py-4 rounded-2xl bg-white hover:bg-[#fffdf9] border-2 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-between gap-3 text-left"
                style={{ borderColor: theme.accentColor }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-108"
                    style={{
                      backgroundColor: `${theme.scallopColor}40`,
                      color: theme.accentColor,
                    }}
                  >
                    <Eye className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div
                      className="font-bubble text-base sm:text-lg font-black tracking-wide leading-tight"
                      style={{ color: theme.accentColor }}
                    >
                      Preview
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Full screen · All 9 pages, note &amp; animations
                    </div>
                  </div>
                </div>
                <span
                  className="text-xs font-extrabold px-2.5 py-1 rounded-lg shrink-0"
                  style={{
                    backgroundColor: theme.btnBg,
                    color: theme.btnText,
                  }}
                >
                  Open →
                </span>
              </button>

              {/* OPTION 2: SHARE LINK */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setIsShareExpanded((prev) => !prev);
                }}
                className="group px-5 py-4 rounded-2xl border-2 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-between gap-3 text-left"
                style={{
                  backgroundColor: isShareExpanded ? '#fff1f2' : '#ffffff',
                  borderColor: '#e11d48',
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#e11d48] flex items-center justify-center shrink-0 transition-transform group-hover:scale-108">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bubble text-base sm:text-lg font-black tracking-wide leading-tight text-[#be123c]">
                      Share Link
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Custom link for your partner (view-only)
                    </div>
                  </div>
                </div>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#e11d48] text-white shrink-0">
                  {isShareExpanded ? 'Ready ♥' : 'Get Link'}
                </span>
              </button>
            </div>

            {/* EXPANDED CUSTOM SHARE LINK DRAWER */}
            {isShareExpanded && shareUrl && (
              <div className="mt-4 bg-white rounded-2xl p-4 sm:p-5 border border-[#e5ddc7] shadow-xs space-y-4 text-left animate-in fade-in duration-200">
                {hasUnsavedChanges && (
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                    <span>You made edits since your last save. Click Save Changes so your link shows the newest version!</span>
                    <button
                      type="button"
                      onClick={() => void onSaveAll(savedSlug)}
                      disabled={isSaving}
                      className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer shrink-0"
                    >
                      {isSaving ? 'Updating...' : 'Save Changes Now'}
                    </button>
                  </div>
                )}

                {/* Ready-to-Share Link Copy Box */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Partner&apos;s Surprise Link (Full-Screen, Animations Only, No Edit Buttons)
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 select-all truncate">
                      {shareUrl}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleCopyShareLink}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-xs transition-transform hover:scale-103 active:scale-97 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                        style={{
                          backgroundColor: copiedLink ? '#059669' : '#e11d48',
                        }}
                      >
                        {copiedLink ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Copied Link! ♥</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>

                      {canNativeShare && (
                        <button
                          type="button"
                          onClick={handleNativeShare}
                          className="px-3.5 py-2.5 rounded-xl font-bold text-xs border bg-white hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                          style={{
                            color: theme.accentColor,
                            borderColor: theme.borderHeader,
                          }}
                        >
                          <Share2 className="w-4 h-4" />
                          <span>Send</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customize URL Slug Form */}
                <form
                  onSubmit={handleUpdateCustomSlug}
                  className="pt-3.5 border-t border-slate-100 space-y-1.5"
                >
                  <label
                    htmlFor="custom-surprise-slug-input"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Customize Your Link Name
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="flex-1 min-w-0 flex items-center rounded-xl bg-white border border-[#dfd5be] overflow-hidden focus-within:ring-2 focus-within:ring-rose-400">
                      <span className="px-3 py-2.5 bg-slate-50 border-r border-slate-200 text-xs font-mono text-slate-500 truncate max-w-[46%] shrink-0">
                        {publicOrigin}/s/
                      </span>
                      <input
                        id="custom-surprise-slug-input"
                        type="text"
                        value={customSlugInput}
                        onChange={(e) => setCustomSlugInput(e.target.value)}
                        placeholder="happy-birthday-my-love"
                        maxLength={64}
                        className="flex-1 min-w-0 px-3 py-2.5 text-xs sm:text-sm font-mono font-semibold text-slate-800 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={
                        isSaving ||
                        sanitizeCustomSlug(customSlugInput).length < 2 ||
                        sanitizeCustomSlug(customSlugInput) === savedSlug
                      }
                      className="px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
                      style={{
                        backgroundColor: theme.btnBg,
                        color: theme.btnText,
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{slugUpdatedMsg ? 'Updated!' : 'Set Custom Link'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Example: <span className="font-mono">happy-birthday-cutie</span> or{' '}
                    <span className="font-mono">our-special-date</span>. She will experience all 9 pages &amp; your Surprise Note on full screen with animations only (no edit buttons).
                  </p>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
