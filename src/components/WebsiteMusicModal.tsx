import React, { useEffect, useRef, useState } from 'react';
import { Music, Link2, Upload, X, Volume2, VolumeX, RotateCcw, Check } from 'lucide-react';
import { ColorTheme, THEMES } from '../theme/colorThemes';
import { sounds } from '../utils/audio';

const MUSIC_SETTINGS_KEY = 'scrapbook_website_music_settings_v1';
const IDB_NAME = 'scrapbook_music_storage_v1';
const IDB_STORE = 'tracks';
const IDB_TRACK_KEY = 'uploaded_bgm';

export type MusicSourceType = 'default' | 'link' | 'upload';

export interface SavedMusicSettings {
  isOn: boolean;
  sourceType: MusicSourceType;
  linkUrl: string;
  uploadedFileName: string;
  volume: number;
}

export interface SharedMusicData extends SavedMusicSettings {
  uploadedAudioDataUrl?: string;
}

export const DEFAULT_MUSIC_SETTINGS: SavedMusicSettings = {
  isOn: false,
  sourceType: 'default',
  linkUrl: '',
  uploadedFileName: '',
  volume: 0.65,
};

function loadMusicSettings(): SavedMusicSettings {
  try {
    const raw = localStorage.getItem(MUSIC_SETTINGS_KEY);
    if (!raw) return DEFAULT_MUSIC_SETTINGS;
    return { ...DEFAULT_MUSIC_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_MUSIC_SETTINGS;
  }
}

function saveMusicSettings(settings: SavedMusicSettings): void {
  try {
    localStorage.setItem(MUSIC_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage errors
  }
}

function openMusicDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveUploadedAudioBlob(blob: Blob, fileName: string): Promise<void> {
  try {
    const db = await openMusicDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put({ blob, fileName }, IDB_TRACK_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Fallback to session-only playback if IndexedDB is unavailable
  }
}

async function loadUploadedAudioBlob(): Promise<{ blob: Blob; fileName: string } | null> {
  try {
    const db = await openMusicDB();
    const record = await new Promise<{ blob: Blob; fileName: string } | undefined>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(IDB_TRACK_KEY);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return record ?? null;
  } catch {
    return null;
  }
}

async function clearUploadedAudioBlob(): Promise<void> {
  try {
    const db = await openMusicDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(IDB_TRACK_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
    db.close();
  } catch {
    // Ignore cleanup errors
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to encode audio blob'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function exportCurrentMusicForShare(): Promise<SharedMusicData> {
  const settings = loadMusicSettings();
  if (settings.sourceType === 'upload') {
    const uploaded = await loadUploadedAudioBlob();
    if (uploaded?.blob) {
      try {
        const uploadedAudioDataUrl = await blobToDataUrl(uploaded.blob);
        return {
          ...settings,
          uploadedFileName: uploaded.fileName || settings.uploadedFileName,
          uploadedAudioDataUrl,
        };
      } catch {
        return { ...settings };
      }
    }
  }
  return { ...settings };
}

function extractYouTubeId(rawUrl: string): string | null {
  try {
    const trimmed = rawUrl.trim();
    if (!trimmed) return null;
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id && id.length >= 8 ? id : null;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      const v = url.searchParams.get('v');
      if (v) return v;
      const parts = url.pathname.split('/').filter(Boolean);
      if ((parts[0] === 'embed' || parts[0] === 'shorts') && parts[1]) {
        return parts[1];
      }
    }
    return null;
  } catch {
    return null;
  }
}

function normalizeDirectAudioUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes('dropbox.com')) {
      url.searchParams.delete('dl');
      url.searchParams.set('raw', '1');
      return url.toString();
    }
    const driveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (driveMatch?.[1]) {
      return `https://docs.google.com/uc?export=download&id=${driveMatch[1]}`;
    }
  } catch {
    // Return as-is if not a full URL
  }
  return trimmed;
}

interface WebsiteMusicControllerProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayingStateChange?: (isOn: boolean) => void;
  onMusicChange?: () => void;
  sharedMusic?: SharedMusicData | null;
  readOnly?: boolean;
  theme?: ColorTheme;
}

export const WebsiteMusicController: React.FC<WebsiteMusicControllerProps> = ({
  isOpen,
  onClose,
  onPlayingStateChange,
  onMusicChange,
  sharedMusic,
  readOnly = false,
  theme = THEMES[0],
}) => {
  const [settings, setSettings] = useState<SavedMusicSettings>(() => loadMusicSettings());
  const [linkInput, setLinkInput] = useState<string>(() => loadMusicSettings().linkUrl);
  const [uploadedObjectUrl, setUploadedObjectUrl] = useState<string | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [viewerMuted, setViewerMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setViewerMuted(false);
  }, [readOnly, sharedMusic]);

  // Notify parent header button of ON/OFF state (only persist to localStorage in creator mode)
  useEffect(() => {
    if (sharedMusic) {
      onPlayingStateChange?.(sharedMusic.isOn && !viewerMuted);
      return;
    }
    onPlayingStateChange?.(settings.isOn && !viewerMuted);
    saveMusicSettings(settings);
  }, [settings, sharedMusic, viewerMuted, onPlayingStateChange]);

  // Restore uploaded audio file from IndexedDB on mount (creator / preview mode)
  useEffect(() => {
    if (sharedMusic) return;
    let activeUrl: string | null = null;
    loadUploadedAudioBlob().then((saved) => {
      if (saved?.blob) {
        activeUrl = URL.createObjectURL(saved.blob);
        setUploadedObjectUrl(activeUrl);
      }
    });
    return () => {
      if (activeUrl) URL.revokeObjectURL(activeUrl);
    };
  }, [sharedMusic]);

  // Gentle Web Audio music-box loop when user switches ON before adding a custom track
  const stopDefaultMelody = () => {
    if (synthTimerRef.current !== null) {
      window.clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  };

  const startDefaultMelody = (vol: number) => {
    stopDefaultMelody();
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!synthCtxRef.current) {
      synthCtxRef.current = new AudioCtx();
    }
    const ctx = synthCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Warm scrapbook lullaby / music-box progression
    const melody = [
      523.25, 659.25, 783.99, 659.25,
      587.33, 698.46, 880.0, 698.46,
      523.25, 659.25, 783.99, 1046.5,
      783.99, 659.25, 587.33, 523.25,
    ];
    let step = 0;

    const playNote = () => {
      if (!synthCtxRef.current || synthCtxRef.current.state !== 'running') return;
      const freq = melody[step % melody.length];
      step += 1;

      const now = synthCtxRef.current.currentTime;
      const osc = synthCtxRef.current.createOscillator();
      const gain = synthCtxRef.current.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const peakGain = Math.max(0.005, vol * 0.12);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(peakGain, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);

      osc.connect(gain);
      gain.connect(synthCtxRef.current.destination);

      osc.start(now);
      osc.stop(now + 0.55);
    };

    playNote();
    synthTimerRef.current = window.setInterval(playNote, 480);
  };

  useEffect(() => {
    return () => {
      stopDefaultMelody();
      if (synthCtxRef.current) {
        synthCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const effectiveSource: SharedMusicData = sharedMusic ?? settings;
  const effectiveIsOn = effectiveSource.isOn && !viewerMuted;

  const youtubeVideoId =
    effectiveSource.sourceType === 'link' ? extractYouTubeId(effectiveSource.linkUrl) : null;

  const activeDirectSrc =
    effectiveSource.sourceType === 'upload'
      ? sharedMusic
        ? sharedMusic.uploadedAudioDataUrl || ''
        : uploadedObjectUrl || ''
      : effectiveSource.sourceType === 'link' && !youtubeVideoId
      ? normalizeDirectAudioUrl(effectiveSource.linkUrl)
      : '';

  // Synchronize HTMLAudioElement / Default Melody playback with effective settings
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = Math.min(1, Math.max(0, effectiveSource.volume));

    if (!effectiveIsOn) {
      audio.pause();
      stopDefaultMelody();
      return;
    }

    // If YouTube iframe handles playback
    if (youtubeVideoId) {
      audio.pause();
      stopDefaultMelody();
      return;
    }

    // If custom direct link or uploaded file is active
    if (activeDirectSrc) {
      stopDefaultMelody();
      if (audio.src !== activeDirectSrc) {
        audio.src = activeDirectSrc;
      }
      const attemptPlay = () => {
        audio
          .play()
          .then(() => setPlaybackError(null))
          .catch((err: Error) => {
            if (err?.name === 'NotAllowedError') {
              const resumeOnInteract = () => {
                audio.play().catch(() => {});
              };
              window.addEventListener('pointerdown', resumeOnInteract, { once: true });
            } else {
              setPlaybackError(
                'Could not play this audio URL. Use a direct audio link (.mp3, .wav, .ogg), YouTube link, or upload an audio file.'
              );
            }
          });
      };
      attemptPlay();
      return;
    }

    // Default gentle built-in music box melody when ON and no custom file/link is set yet
    audio.pause();
    startDefaultMelody(effectiveSource.volume);
    const resumeSynth = () => {
      if (synthCtxRef.current?.state === 'suspended') {
        synthCtxRef.current.resume().catch(() => {});
      }
    };
    window.addEventListener('pointerdown', resumeSynth, { once: true });
    return () => {
      window.removeEventListener('pointerdown', resumeSynth);
    };
  }, [effectiveIsOn, effectiveSource.sourceType, effectiveSource.volume, activeDirectSrc, youtubeVideoId]);

  const handleToggleOnOff = (nextIsOn: boolean) => {
    sounds.playPop();
    setPlaybackError(null);
    setSettings((prev) => ({ ...prev, isOn: nextIsOn }));
    onMusicChange?.();
  };

  const handleApplyLink = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = linkInput.trim();
    if (!cleaned) return;
    sounds.playPop();
    setPlaybackError(null);
    setSettings((prev) => ({
      ...prev,
      sourceType: 'link',
      linkUrl: cleaned,
      isOn: true,
    }));
    onMusicChange?.();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const file = inputEl.files?.[0];
    if (!file) return;
    sounds.playPop();
    setPlaybackError(null);

    if (uploadedObjectUrl) {
      URL.revokeObjectURL(uploadedObjectUrl);
    }
    const nextUrl = URL.createObjectURL(file);
    setUploadedObjectUrl(nextUrl);
    await saveUploadedAudioBlob(file, file.name);

    setSettings((prev) => ({
      ...prev,
      sourceType: 'upload',
      uploadedFileName: file.name,
      isOn: true,
    }));
    onMusicChange?.();

    inputEl.value = '';
  };

  const handleResetToDefault = async () => {
    sounds.playPop();
    setPlaybackError(null);
    setLinkInput('');
    if (uploadedObjectUrl) {
      URL.revokeObjectURL(uploadedObjectUrl);
      setUploadedObjectUrl(null);
    }
    await clearUploadedAudioBlob();
    setSettings((prev) => ({
      ...prev,
      sourceType: 'default',
      linkUrl: '',
      uploadedFileName: '',
    }));
    onMusicChange?.();
  };

  const currentTrackLabel =
    settings.sourceType === 'upload' && settings.uploadedFileName
      ? settings.uploadedFileName
      : settings.sourceType === 'link' && settings.linkUrl
      ? extractYouTubeId(settings.linkUrl)
        ? `YouTube Song (${extractYouTubeId(settings.linkUrl)})`
        : settings.linkUrl
      : 'Built-in Scrapbook Music Box';

  return (
    <>
      {/* Persistent Website Audio Element */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onError={() => {
          if (effectiveIsOn && activeDirectSrc) {
            setPlaybackError(
              'Unable to load audio from this link. Please check the URL or upload an audio file from your device.'
            );
          }
        }}
      />

      {/* Hidden YouTube Background Player when a YouTube song link is active and ON */}
      {effectiveIsOn && youtubeVideoId && (
        <iframe
          title="Website Background Music"
          src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&loop=1&playlist=${youtubeVideoId}&controls=0&playsinline=1`}
          allow="autoplay; encrypted-media"
          className="fixed w-px h-px opacity-0 pointer-events-none -bottom-10 -left-10"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      {/* Read-Only Full-Screen Sound Toggle (only when music was turned ON by creator) */}
      {readOnly && effectiveSource.isOn && (
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setViewerMuted((prev) => !prev);
          }}
          className="fixed bottom-4 right-4 z-45 flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border shadow-md text-xs font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            color: theme.accentColor,
            borderColor: theme.borderHeader,
          }}
          title={viewerMuted ? 'Unmute music' : 'Mute music'}
          aria-label={viewerMuted ? 'Unmute music' : 'Mute music'}
        >
          {viewerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span className="hidden sm:inline">{viewerMuted ? 'Sound Off' : 'Music On'}</span>
        </button>
      )}

      {/* Music Configuration Modal (Creator Mode Only) */}
      {!readOnly && isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <div
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#faf5e8] rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-[#efe6d2] my-auto select-text"
            style={{
              boxShadow: '0 25px 60px -15px rgba(27, 60, 110, 0.38)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-[#e5ddc7]">
              <div className="flex items-center gap-2.5">
                <Music className="w-5 h-5 shrink-0" style={{ color: theme.accentColor }} />
                <h3
                  className="font-bubble text-lg sm:text-xl font-black tracking-wide"
                  style={{ color: theme.accentColor }}
                >
                  Website Music
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onClose();
                }}
                className="p-1.5 rounded-full hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                aria-label="Close music settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Music ON / OFF Control */}
            <div className="mt-4 bg-white rounded-2xl p-3.5 border border-[#e5ddc7] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800">Background Music</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5" title={currentTrackLabel}>
                  {currentTrackLabel}
                </div>
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleOnOff(true)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    settings.isOn
                      ? 'shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  style={
                    settings.isOn
                      ? { backgroundColor: theme.btnBg, color: theme.btnText }
                      : {}
                  }
                >
                  ON
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleOnOff(false)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !settings.isOn
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  OFF
                </button>
              </div>
            </div>

            {/* 2. Add Link of Music */}
            <form onSubmit={handleApplyLink} className="mt-4 space-y-1.5">
              <label
                htmlFor="website-music-link-input"
                className="text-xs font-bold text-slate-700 flex items-center gap-1.5"
              >
                <Link2 className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
                <span>Add Music Link</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="website-music-link-input"
                  type="url"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Paste audio link (.mp3) or YouTube link..."
                  className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd5be] text-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2"
                  style={{
                    ['--tw-ring-color' as string]: theme.accentColor,
                  }}
                />
                <button
                  type="submit"
                  disabled={!linkInput.trim()}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed shrink-0"
                  style={{
                    backgroundColor: theme.btnBg,
                    color: theme.btnText,
                  }}
                >
                  Use Link
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="my-4 flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
              <div className="flex-1 h-px bg-[#e5ddc7]" />
              <span>OR</span>
              <div className="flex-1 h-px bg-[#e5ddc7]" />
            </div>

            {/* 3. Upload Music File */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">
                Upload Music from Device
              </span>
              <label
                onClick={() => sounds.playClick()}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-[#dacfb7] font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                style={{ color: theme.accentColor }}
              >
                <input
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a,.ogg,.aac,.flac"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
                <Upload className="w-4 h-4" />
                <span>
                  {settings.sourceType === 'upload' && settings.uploadedFileName
                    ? `Replace File (${settings.uploadedFileName})`
                    : 'Upload Audio File (MP3, WAV, M4A)'}
                </span>
              </label>
            </div>

            {/* Volume Slider (for direct audio & built-in music box) */}
            {!youtubeVideoId && (
              <div className="mt-4 pt-3.5 border-t border-[#e5ddc7] flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-slate-500 shrink-0" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={settings.volume}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      volume: parseFloat(e.target.value),
                    }))
                  }
                  aria-label="Music volume"
                  className="flex-1 accent-current cursor-pointer h-1.5"
                  style={{ color: theme.accentColor }}
                />
                <span className="text-xs font-mono text-slate-600 w-9 text-right tabular-nums">
                  {Math.round(settings.volume * 100)}%
                </span>
              </div>
            )}

            {/* Error Notice */}
            {playbackError && (
              <p className="mt-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {playbackError}
              </p>
            )}

            {/* Footer */}
            <div className="mt-5 pt-3.5 border-t border-[#e5ddc7] flex items-center justify-between gap-3">
              {settings.sourceType !== 'default' ? (
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-[#dacfb7] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Track</span>
                </button>
              ) : (
                <span className="text-xs text-slate-500">Plays across all 9 pages</span>
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
      )}
    </>
  );
};
