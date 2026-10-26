import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music,
  Volume2,
  VolumeX,
  Upload,
  Sparkles,
  Film,
  Instagram,
  Check,
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface ReelItem {
  id: string;
  creator: string;
  avatar: string;
  badge: string;
  soundTitle: string;
  initialLikes: number;
  initialComments: number;
  initialShares: number;
  caption: string;
  tags: string[];
  washiColor: string;
  washiPattern: string;
  stickerEmoji: string;
  stickerText: string;
  previewGradient: string;
  videoUrl?: string;
  themeAccent: string;
}

const DEFAULT_REELS: ReelItem[] = [
  {
    id: 'reel-1',
    creator: 'scrapbook.studios',
    avatar: '🎨',
    badge: 'Trending Reel',
    soundTitle: 'Acoustic Lofi • Just The Way You Are',
    initialLikes: 248500,
    initialComments: 2840,
    initialShares: 63200,
    caption: 'Step-by-step tutorial: making an interactive pop-up envelope card with cloud scallops & surprise pull-outs ☁️💌',
    tags: ['#scrapbook', '#papercraft', '#aesthetic', '#giftideas'],
    washiColor: 'bg-[#94bee3]/80 border-[#6ca4d7]',
    washiPattern: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,255,255,0.4) 6px, rgba(255,255,255,0.4) 12px)',
    stickerEmoji: '✨',
    stickerText: 'POP-UP MAGIC',
    previewGradient: 'from-[#1e3a8a] via-[#3b82f6] to-[#93c5fd]',
    themeAccent: '#3b82f6',
  },
  {
    id: 'reel-2',
    creator: 'vintage.memories',
    avatar: '🎞️',
    badge: 'Most Saved',
    soundTitle: 'Taylor Swift • Lover (Scrapbook Acoustic)',
    initialLikes: 189200,
    initialComments: 1920,
    initialShares: 41800,
    caption: 'How I crafted this vintage Polaroid roll filmstrip keepsake box for our anniversary date night 📸🤍',
    tags: ['#polaroid', '#scrapbookjournal', '#anniversary', '#diycraft'],
    washiColor: 'bg-[#f7b4c4]/80 border-[#e594a7]',
    washiPattern: 'repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(255,255,255,0.4) 6px, rgba(255,255,255,0.4) 12px)',
    stickerEmoji: '🎀',
    stickerText: 'FILMSTRIP DIY',
    previewGradient: 'from-[#831843] via-[#db2777] to-[#fbcfe8]',
    themeAccent: '#db2777',
  },
  {
    id: 'reel-3',
    creator: 'papermagic.co',
    avatar: '🌸',
    badge: '4.8M Views',
    soundTitle: 'Stephen Sanchez • Until I Found You (Piano)',
    initialLikes: 312400,
    initialComments: 4150,
    initialShares: 98600,
    caption: 'The sweetest pull-tab secret proposal card! Slide the ribbon to reveal: "Will you be my date tonight?" 💍✨',
    tags: ['#proposalcard', '#loveletter', '#paperart', '#keepsake'],
    washiColor: 'bg-[#b2d4a9]/80 border-[#94be8a]',
    washiPattern: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.4) 8px, rgba(255,255,255,0.4) 16px)',
    stickerEmoji: '💌',
    stickerText: 'SECRET NOTE',
    previewGradient: 'from-[#14532d] via-[#16a34a] to-[#86efac]',
    themeAccent: '#16a34a',
  },
];

import { ColorTheme, THEMES } from '../theme/colorThemes';

interface ScrapbookReelsSectionProps {
  theme?: ColorTheme;
}

export const ScrapbookReelsSection: React.FC<ScrapbookReelsSectionProps> = ({
  theme = THEMES[0],
}) => {
  const [reels, setReels] = useState<ReelItem[]>(DEFAULT_REELS);
  const [playingId, setPlayingId] = useState<string | null>('reel-1');
  const [muted, setMuted] = useState(true);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [savedReels, setSavedReels] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({
    'reel-1': 248500,
    'reel-2': 189200,
    'reel-3': 312400,
  });
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; reelId: string }[]>([]);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const togglePlay = (id: string) => {
    sounds.playClick();
    setPlayingId((prev) => (prev === id ? null : id));
  };

  const handleLike = (id: string) => {
    sounds.playPop();
    const isCurrentlyLiked = !!likedReels[id];
    setLikedReels((prev) => ({ ...prev, [id]: !isCurrentlyLiked }));
    setLikeCounts((prev) => ({
      ...prev,
      [id]: isCurrentlyLiked ? prev[id] - 1 : prev[id] + 1,
    }));

    if (!isCurrentlyLiked) {
      const heartId = Date.now();
      setFloatingHearts((prev) => [...prev, { id: heartId, reelId: id }]);
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((h) => h.id !== heartId));
      }, 1200);
    }
  };

  const handleSave = (id: string) => {
    sounds.playClick();
    setSavedReels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVideoUpload = (reelId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setReels((prev) =>
        prev.map((r) => (r.id === reelId ? { ...r, videoUrl: url } : r))
      );
      setPlayingId(reelId);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <section id="more-like-this" className="max-w-6xl mx-auto px-4 mt-16 sm:mt-24 w-full">
      {/* Section Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border shadow-xs text-xs font-bold mb-3"
          style={{ color: theme.accentColor, borderColor: theme.scallopLight }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
          <span>INSPIRATION CORNER</span>
          <Instagram className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
        </div>
        <h2
          className="text-3xl sm:text-4xl font-bubble tracking-tight"
          style={{ color: theme.accentColor }}
        >
          Explore More Creations !
        </h2>
        <p className="text-sm text-slate-600 mt-2.5 max-w-lg mx-auto leading-relaxed">
          Watch trending handmade scrapbook greeting reels, pop-up envelope secrets, and heartwarming papercraft ideas.
        </p>
      </div>

      {/* 3 Scrapbook Reel Holders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 items-start">
        {reels.map((reel, index) => {
          const isPlaying = playingId === reel.id;
          const isLiked = !!likedReels[reel.id];
          const isSaved = !!savedReels[reel.id];

          return (
            <div
              key={reel.id}
              className="relative group transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Top Washi Tape Strip */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 w-28 h-6 rotate-[-1.5deg] shadow-xs pointer-events-none">
                <div
                  className={`w-full h-full rounded-xs border opacity-95 ${reel.washiColor}`}
                  style={{ backgroundImage: reel.washiPattern }}
                />
              </div>

              {/* Top Corner Scrapbook Badge */}
              <div className="absolute -top-2.5 -right-2 z-20 shadow-sm rotate-[8deg]">
                <div className="bg-[#1b3c6e] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1 border border-white/60">
                  <span>{reel.stickerEmoji}</span>
                  <span>{reel.stickerText}</span>
                </div>
              </div>

              {/* Main Scrapbook Frame */}
              <div className="bg-white rounded-3xl p-3 sm:p-3.5 shadow-xl border-2 border-[#d3e3f0] hover:border-[#1b3c6e]/40 transition-colors">
                {/* 9:16 Video Canvas Container */}
                <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner group/screen">
                  {/* Video or Animated Aesthetic Mockup */}
                  {reel.videoUrl ? (
                    <video
                      src={reel.videoUrl}
                      className="w-full h-full object-cover"
                      loop
                      autoPlay={isPlaying}
                      muted={muted}
                      playsInline
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${reel.previewGradient} flex flex-col justify-between p-4 relative overflow-hidden`}
                    >
                      {/* Paper grain overlay texture */}
                      <div
                        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
                        style={{
                          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                          backgroundSize: '12px 12px',
                        }}
                      />

                      {/* Animated scrapbooking illustration inside video preview */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white text-center pointer-events-none">
                        {index === 0 && (
                          <div className={`transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}>
                            {/* Envelope with pop-up flowers */}
                            <div className="relative w-36 h-28 bg-[#fdfaf5] text-slate-800 rounded-xl border-2 border-[#1e3a8a] shadow-lg flex items-center justify-center p-3 rotate-[-3deg]">
                              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl animate-bounce">
                                💌
                              </div>
                              <div className="text-center">
                                <span className="font-bubble text-xs text-[#1e3a8a] block font-bold">Pop-Up Heart</span>
                                <span className="text-[10px] text-slate-500 font-mono">Fold & Reveal</span>
                              </div>
                              {/* Scalloped edge visual */}
                              <div className="absolute -bottom-2 w-full flex justify-around px-1 text-[8px] text-[#93c5fd]">
                                ● ● ● ● ● ●
                              </div>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                              <Sparkles className="w-3 h-3 text-yellow-300" /> Cloud Paper Cutout
                            </div>
                          </div>
                        )}

                        {index === 1 && (
                          <div className={`transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}>
                            {/* Polaroid with film strip */}
                            <div className="relative w-36 bg-white text-slate-800 p-2 pb-6 rounded-md shadow-2xl rotate-[3deg] border border-black/10">
                              <div className="w-full h-24 bg-gradient-to-tr from-pink-300 to-rose-400 rounded flex items-center justify-center text-4xl shadow-inner">
                                📸
                              </div>
                              <p className="font-hand text-xs text-center mt-2 font-bold text-slate-700">
                                film memories 🎞️
                              </p>
                              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-yellow-200/90 rounded-xs shadow-xs" />
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                              <Sparkles className="w-3 h-3 text-yellow-300" /> Pull-Out Filmstrip
                            </div>
                          </div>
                        )}

                        {index === 2 && (
                          <div className={`transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}>
                            {/* Proposal card envelope with ribbon */}
                            <div className="relative w-36 h-28 bg-[#fffdf8] text-slate-800 rounded-xl border-2 border-emerald-800 shadow-xl flex items-center justify-center p-3 rotate-[-2deg]">
                              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl">
                                💍
                              </div>
                              <div className="text-center">
                                <span className="font-bubble text-xs text-emerald-900 block font-bold">Be My Date?</span>
                                <span className="text-[10px] text-emerald-700 font-mono">Pull To Open ✨</span>
                              </div>
                              <div className="absolute -right-2 top-1/2 -translate-y-1/2 bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                                YES!
                              </div>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                              <Sparkles className="w-3 h-3 text-yellow-300" /> Hidden Ribbon Tab
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Floating hearts animation when liked */}
                      {floatingHearts
                        .filter((h) => h.reelId === reel.id)
                        .map((h) => (
                          <div
                            key={h.id}
                            className="absolute bottom-24 right-4 text-rose-500 text-3xl animate-fade-out pointer-events-none z-30"
                            style={{ animation: 'floatUp 1.2s ease-out forwards' }}
                          >
                            ❤️
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Dark gradient vignettes for Reel UI readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

                  {/* Top Bar inside Reel: Audio Track + Sound Toggle */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
                    <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full max-w-[70%] truncate">
                      <Music className={`w-3 h-3 shrink-0 ${isPlaying ? 'animate-spin' : ''}`} />
                      <span className="truncate text-[11px] font-medium">{reel.soundTitle}</span>
                    </div>

                    <button
                      onClick={() => setMuted((prev) => !prev)}
                      className="p-1.5 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors cursor-pointer"
                      title={muted ? 'Unmute' : 'Mute'}
                    >
                      {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Center Play / Pause Click Overlay */}
                  <div
                    onClick={() => togglePlay(reel.id)}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer group/play"
                  >
                    {!isPlaying && (
                      <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl group-hover/play:scale-110 transition-transform">
                        <Play className="w-6 h-6 ml-1 fill-white" />
                      </div>
                    )}
                  </div>

                  {/* Right Action Column (Instagram Reels Style) */}
                  <div className="absolute right-2.5 bottom-16 flex flex-col items-center gap-3.5 text-white z-10">
                    {/* Like Button */}
                    <button
                      onClick={() => handleLike(reel.id)}
                      className="flex flex-col items-center gap-1 transition-transform active:scale-125 cursor-pointer"
                      title="Like"
                    >
                      <div
                        className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                          isLiked
                            ? 'bg-rose-500 text-white'
                            : 'bg-black/35 hover:bg-black/50 text-white'
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`}
                        />
                      </div>
                      <span className="text-[11px] font-bold drop-shadow">
                        {formatNumber(likeCounts[reel.id])}
                      </span>
                    </button>

                    {/* Comment Button */}
                    <button
                      onClick={() => sounds.playClick()}
                      className="flex flex-col items-center gap-1 cursor-pointer"
                      title="Comments"
                    >
                      <div className="p-2 rounded-full bg-black/35 hover:bg-black/50 backdrop-blur-md text-white transition-colors">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold drop-shadow">
                        {formatNumber(reel.initialComments)}
                      </span>
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => {
                        sounds.playPop();
                        navigator.clipboard?.writeText(window.location.href);
                      }}
                      className="flex flex-col items-center gap-1 cursor-pointer"
                      title="Share link"
                    >
                      <div className="p-2 rounded-full bg-black/35 hover:bg-black/50 backdrop-blur-md text-white transition-colors">
                        <Share2 className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold drop-shadow">
                        {formatNumber(reel.initialShares)}
                      </span>
                    </button>

                    {/* Save / Bookmark Button */}
                    <button
                      onClick={() => handleSave(reel.id)}
                      className="flex flex-col items-center gap-1 transition-transform active:scale-125 cursor-pointer"
                      title="Save to collection"
                    >
                      <div
                        className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                          isSaved
                            ? 'bg-amber-400 text-slate-900'
                            : 'bg-black/35 hover:bg-black/50 text-white'
                        }`}
                      >
                        <Bookmark
                          className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`}
                        />
                      </div>
                      <span className="text-[11px] font-bold drop-shadow">
                        {isSaved ? 'Saved' : 'Save'}
                      </span>
                    </button>

                    {/* Spinning Audio Disc */}
                    <div className="w-8 h-8 rounded-full border-2 border-white/60 bg-black flex items-center justify-center shadow-md animate-spin-slow mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                  </div>

                  {/* Bottom Caption & Account Details */}
                  <div className="absolute left-3 right-14 bottom-3 text-white text-left z-10">
                    {/* User profile handle */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xs border border-white/40">
                        {reel.avatar}
                      </span>
                      <span className="font-bold text-xs tracking-tight text-white drop-shadow">
                        @{reel.creator}
                      </span>
                      <span className="bg-[#1b3c6e] text-[9px] font-bold px-1.5 py-0.5 rounded text-white border border-white/30">
                        Follow
                      </span>
                    </div>

                    {/* Reel Caption */}
                    <p className="text-[11px] leading-tight text-white/95 line-clamp-2 drop-shadow-sm font-sans">
                      {reel.caption}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {reel.tags.map((tag) => (
                        <span key={tag} className="text-[10px] text-sky-200 font-semibold drop-shadow">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Scrubber Progress Bar at the bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      className={`h-full bg-white transition-all duration-300 ${
                        isPlaying ? 'w-2/3 animate-pulse' : 'w-1/4'
                      }`}
                    />
                  </div>
                </div>

                {/* Footer Controls & Upload Option for Reel Card */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <Film className="w-3.5 h-3.5 text-[#1b3c6e]" />
                    <span>{reel.badge}</span>
                  </div>

                  <input
                    type="file"
                    ref={(el) => {
                      fileInputRefs.current[reel.id] = el;
                    }}
                    accept="video/*"
                    onChange={(e) => handleVideoUpload(reel.id, e)}
                    className="hidden"
                  />
                  <button
                    onClick={() => {
                      sounds.playClick();
                      fileInputRefs.current[reel.id]?.click();
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#1b3c6e] hover:text-[#28538c] bg-[#eef5fb] hover:bg-[#e1effa] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    title="Upload custom MP4 video reel"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Replace Video</span>
                  </button>
                </div>
              </div>

              {/* Decorative Corner Paper Clip / Pin */}
              <div className="absolute -bottom-2.5 left-6 text-xl pointer-events-none select-none drop-shadow-xs rotate-[15deg]">
                📎
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
