import React from 'react';
import { ColorTheme } from '../theme/colorThemes';
import { sounds } from '../utils/audio';

interface StickerProps {
  className?: string;
  isHovered?: boolean;
  onClick?: () => void;
  accentColor?: string;
  bgColor?: string;
}

/**
 * Exclamation mark sticker - exact reproduction of the handcrafted scrapbook sticker.
 * Upper wedge and lower dot with off-white cardstock cutout edge and textured blue linocut fill.
 */
export const ExclamationSticker: React.FC<StickerProps> = ({
  className = '',
  accentColor = '#2b548e',
  bgColor = '#faf6ea',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative select-none cursor-pointer group transition-transform duration-300 ease-out ${className}`}
      style={{ filter: 'drop-shadow(2px 8px 14px rgba(28, 52, 86, 0.22)) drop-shadow(0 2px 4px rgba(28, 52, 86, 0.12))' }}
      title="Click to wiggle!"
    >
      <svg
        viewBox="0 0 160 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible transition-transform duration-200 group-hover:scale-105 group-active:scale-95 animate-scrapbook-tilt"
      >
        <defs>
          {/* Subtle paper / linocut ink texture */}
          <pattern id="inkTextureExcl" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill={accentColor} />
            <circle cx="4" cy="4" r="1.2" fill="#3c6aa6" opacity="0.6" />
            <circle cx="14" cy="9" r="1.5" fill="#1e3e6b" opacity="0.5" />
            <circle cx="8" cy="16" r="1" fill="#3c6aa6" opacity="0.6" />
            <path d="M2,12 Q6,8 10,14" stroke="#1e3e6b" strokeWidth="0.8" opacity="0.4" fill="none" />
            <path d="M12,2 Q16,5 18,3" stroke="#4878b8" strokeWidth="0.8" opacity="0.3" fill="none" />
          </pattern>
        </defs>

        {/* 1. UPPER WEDGE STICKER */}
        <g>
          {/* Paper backing (hand-cut white/cream paper border) */}
          <path
            d="M 22 28 
               L 138 2 
               L 154 36 
               L 126 216 
               L 106 226 
               L 52 224 
               L 36 210 
               L 8 46 
               Z"
            fill={bgColor}
            stroke="#e4decb"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Inner blue ink stamped exclamation stalk */}
          <path
            d="M 33 40 
               L 129 16 
               L 141 42 
               L 116 204 
               L 98 212 
               L 60 210 
               L 48 200 
               L 20 54 
               Z"
            fill="url(#inkTextureExcl)"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Hand-carved linocut texture highlights */}
          <path
            d="M 42 56 L 36 170 M 65 38 L 54 186 M 92 32 L 82 176 M 120 44 L 102 170"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="14 10 24 8"
          />
          <path
            d="M 50 70 L 46 140 M 80 50 L 76 130"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="8 16"
          />
        </g>

        {/* 2. LOWER DOT STICKER (Separate round cutout) */}
        <g transform="translate(0, 18)">
          {/* Paper backing for dot */}
          <path
            d="M 68 222
               L 98 224
               L 118 238
               L 122 264
               L 106 288
               L 78 292
               L 56 278
               L 52 248
               Z"
            fill={bgColor}
            stroke="#e4decb"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Inner stamped blue dot */}
          <path
            d="M 72 230
               L 94 231
               L 111 243
               L 114 263
               L 101 282
               L 80 285
               L 62 273
               L 60 250
               Z"
            fill="url(#inkTextureExcl)"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Hand-carved dot highlight */}
          <circle cx="85" cy="256" r="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeDasharray="12 8" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Stars sticker - exact reproduction of the two 4-point blue sparkle stars
 * on a single organic cut-out off-white cardstock paper backing.
 */
export const StarsSticker: React.FC<StickerProps> = ({
  className = '',
  accentColor = '#2b548e',
  bgColor = '#faf6ea',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative select-none cursor-pointer group transition-transform duration-300 ease-out ${className}`}
      style={{ filter: 'drop-shadow(2px 8px 14px rgba(28, 52, 86, 0.22)) drop-shadow(0 2px 4px rgba(28, 52, 86, 0.12))' }}
      title="Click to sparkle!"
    >
      <svg
        viewBox="0 0 240 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible transition-transform duration-200 group-hover:scale-105 group-active:scale-95 animate-star-twinkle"
      >
        <defs>
          <pattern id="inkTextureStar" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill={accentColor} />
            <circle cx="3" cy="3" r="1" fill="#3c6aa6" opacity="0.6" />
            <circle cx="11" cy="7" r="1.2" fill="#1e3e6b" opacity="0.5" />
            <path d="M1,8 Q5,5 9,9" stroke="#1e3e6b" strokeWidth="0.7" opacity="0.4" fill="none" />
          </pattern>
        </defs>

        {/* 2. LARGE 4-POINT STAR (Left) */}
        <g transform="translate(18, 62)">
          {/* Outer star shape */}
          <path
            d="M 76 0
               Q 73 34, 48 54
               Q 20 62, 0 66
               Q 24 74, 48 84
               Q 72 102, 76 142
               Q 80 102, 104 84
               Q 128 74, 154 66
               Q 126 60, 104 54
               Q 80 34, 76 0
               Z"
            fill="none"
            stroke={accentColor}
            strokeWidth="9"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Inner stroke with white center */}
          <path
            d="M 76 12
               Q 73 38, 54 55
               Q 30 63, 14 66
               Q 32 72, 54 80
               Q 72 96, 76 130
               Q 80 96, 98 80
               Q 120 72, 138 66
               Q 118 62, 98 55
               Q 80 38, 76 12
               Z"
            fill="#ffffff"
            stroke={accentColor}
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Hand-drawn marker stroke texture & highlights */}
          <path
            d="M 76 18 Q 74 38 60 52 M 76 124 Q 78 102 92 86"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* 3. SMALLER 4-POINT STAR (Upper Right) */}
        <g transform="translate(142, 18)">
          <path
            d="M 44 0
               Q 42 18, 28 28
               Q 12 32, 0 35
               Q 14 39, 28 44
               Q 41 53, 44 74
               Q 47 53, 60 44
               Q 73 39, 88 35
               Q 73 31, 60 28
               Q 46 18, 44 0
               Z"
            fill="none"
            stroke={accentColor}
            strokeWidth="6.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Inner cutout with white center */}
          <path
            d="M 44 8
               Q 42 21, 32 28
               Q 20 32, 10 35
               Q 20 37, 32 41
               Q 42 47, 44 65
               Q 46 47, 56 41
               Q 67 37, 78 35
               Q 66 32, 56 28
               Q 46 20, 44 8
               Z"
            fill="#ffffff"
            stroke={accentColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
};

/**
 * Scallop Border Frame:
 * Renders the exact cloud-like scalloped paper border surrounding the hero.
 * Generates continuous inward-curving scallop arcs along top, right, bottom, and left edges.
 */
export const ScallopFrame: React.FC<{
  color?: string;
  className?: string;
}> = ({ color = '#94bee3', className = '' }) => {
  // 1024 x 572 standard frame
  const width = 1024;
  const height = 572;
  const numTop = 12;
  const numSide = 7;
  const stepX = width / numTop; // exactly 85.33333333333333
  const stepY = height / numSide; // exactly 81.71428571428571

  // Top scallops: extended by 3 scallops on each side for seamless continuous loop
  let topInner = '';
  for (let i = numTop + 3; i >= -3; i--) {
    const x1 = (i - 1) * stepX;
    const x0 = i * stepX;
    const xMid = (x0 + x1) / 2;
    topInner += ` Q ${xMid} 68, ${x1} 28`;
  }
  const topPath = `M -260 -20 L ${width + 260} -20 L ${width + 260} 28 ${topInner} L -260 28 Z`;
  const topStroke = `M ${width + 260} 28 ${topInner}`;

  // Bottom scallops: extended by 3 scallops on each side
  let bottomInner = '';
  for (let i = numTop + 3; i >= -3; i--) {
    const x1 = (i - 1) * stepX;
    const x0 = i * stepX;
    const xMid = (x0 + x1) / 2;
    bottomInner += ` Q ${xMid} ${height - 68}, ${x1} ${height - 28}`;
  }
  const bottomPath = `M -260 ${height + 20} L ${width + 260} ${height + 20} L ${width + 260} ${height - 28} ${bottomInner} L -260 ${height - 28} Z`;
  const bottomStroke = `M ${width + 260} ${height - 28} ${bottomInner}`;

  // Left scallops: extended by 3 scallops on each side
  let leftInner = '';
  for (let i = numSide + 3; i >= -3; i--) {
    const y1 = (i - 1) * stepY;
    const y0 = i * stepY;
    const yMid = (y0 + y1) / 2;
    leftInner += ` Q 68 ${yMid}, 28 ${y1}`;
  }
  const leftPath = `M -20 -260 L -20 ${height + 260} L 28 ${height + 260} ${leftInner} L 28 -260 Z`;
  const leftStroke = `M 28 ${height + 260} ${leftInner}`;

  // Right scallops: extended by 3 scallops on each side
  let rightInner = '';
  for (let i = numSide + 3; i >= -3; i--) {
    const y1 = (i - 1) * stepY;
    const y0 = i * stepY;
    const yMid = (y0 + y1) / 2;
    rightInner += ` Q ${width - 68} ${yMid}, ${width - 28} ${y1}`;
  }
  const rightPath = `M ${width + 20} -260 L ${width + 20} ${height + 260} L ${width - 28} ${height + 260} ${rightInner} L ${width - 28} -260 Z`;
  const rightStroke = `M ${width - 28} ${height + 260} ${rightInner}`;

  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none z-20 overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Soft paper drop shadow cast inward onto the gingham */}
          <filter id="scallopDropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#1a3d6d" floodOpacity="0.22" />
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#1a3d6d" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Outer Corner Solid Underlay Plates */}
        <g fill={color}>
          <rect x="-10" y="-10" width="50" height="50" />
          <rect x={width - 40} y="-10" width="50" height="50" />
          <rect x="-10" y={height - 40} width="50" height="50" />
          <rect x={width - 40} y={height - 40} width="50" height="50" />
        </g>

        {/* 1. LEFT BORDER STRIP: Moves towards upside */}
        <g className="animate-border-left-up">
          <path d={leftPath} fill={color} filter="url(#scallopDropShadow)" />
          <path d={leftStroke} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
        </g>

        {/* 2. RIGHT BORDER STRIP: Moves towards down side */}
        <g className="animate-border-right-down">
          <path d={rightPath} fill={color} filter="url(#scallopDropShadow)" />
          <path d={rightStroke} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
        </g>

        {/* 3. TOP BORDER STRIP: Moves towards right */}
        <g className="animate-border-top-right">
          <path d={topPath} fill={color} filter="url(#scallopDropShadow)" />
          <path d={topStroke} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
        </g>

        {/* 4. BOTTOM BORDER STRIP: Moves towards left side */}
        <g className="animate-border-bottom-left">
          <path d={bottomPath} fill={color} filter="url(#scallopDropShadow)" />
          <path d={bottomStroke} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Retro Mouse Pointer Cursor - exact replication of the pixel/hand-drawn pointer
 * hovering over the "CLICK HERE" button.
 */
export const RetroPointerCursor: React.FC<{
  className?: string;
  isHovered?: boolean;
}> = ({ className = '', isHovered = false }) => {
  return (
    <div
      className={`pointer-events-none transition-transform duration-200 ${
        isHovered ? 'scale-110 -translate-x-1 -translate-y-1' : 'animate-cute-bounce'
      } ${className}`}
      style={{
        filter: 'drop-shadow(2px 4px 6px rgba(22, 45, 80, 0.28))',
      }}
    >
      <svg
        width="44"
        height="50"
        viewBox="0 0 36 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform -rotate-6"
      >
        {/* Retro pointer arrow outline & body */}
        <path
          d="M 3 2 
             L 3 32 
             L 10 25 
             L 17 39 
             L 22 36 
             L 15 22 
             L 25 22 
             Z"
          fill="#ffffff"
          stroke="#1b3c6e"
          strokeWidth="3.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Inner subtle shading */}
        <path
          d="M 6 8 L 6 27 L 11 22 L 18 36 L 20 35 L 14 20 L 22 20 Z"
          fill="#f4f7fb"
        />
      </svg>
    </div>
  );
};

/**
 * Subtle corner sparkle
 */
export const SoftSparkle: React.FC<{
  className?: string;
  size?: number;
}> = ({ className = '', size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`pointer-events-none opacity-40 hover:opacity-80 transition-opacity ${className}`}
    >
      <path
        d="M 12 0 Q 12 10 2 12 Q 12 14 12 24 Q 12 14 22 12 Q 12 10 12 0 Z"
        fill="#ffffff"
      />
    </svg>
  );
};

/**
 * Cute Hand-Crafted Scrapbook Stickers
 */
export const PuffyHeartSticker: React.FC<{
  className?: string;
  size?: number;
  color?: string;
  rotate?: number;
  onClick?: () => void;
}> = ({ className = '', size = 26, color = '#f472b6', rotate = 0, onClick }) => (
  <div
    onClick={onClick}
    className={`inline-flex items-center justify-center select-none pointer-events-auto transition-transform duration-200 hover:scale-125 hover:rotate-6 active:scale-95 cursor-pointer ${className}`}
    style={{
      transform: `rotate(${rotate}deg)`,
      filter: 'drop-shadow(0 2.5px 5px rgba(20, 40, 70, 0.22))',
    }}
  >
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M 16 28 C 16 28 4 20 4 11 C 4 6.5 7.5 3 12 3 C 14.5 3 16 4.5 16 4.5 C 16 4.5 17.5 3 20 3 C 24.5 3 28 6.5 28 11 C 28 20 16 28 16 28 Z"
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M 16 26.5 C 16 26.5 5 19 5 11 C 5 7 8 4 12 4 C 14.2 4 15.5 5.5 16 5.5 C 16.5 5.5 17.8 4 20 4 C 24 4 27 7 27 11 C 27 19 16 26.5 16 26.5 Z"
        fill={color}
      />
      <path
        d="M 8 9 C 8 7 10 5.5 12 5.5"
        stroke="rgba(255,255,255,0.8)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="14" cy="7.5" r="0.8" fill="rgba(255,255,255,0.85)" />
    </svg>
  </div>
);

export const CuteBowSticker: React.FC<{
  className?: string;
  size?: number;
  color?: string;
  rotate?: number;
  onClick?: () => void;
}> = ({ className = '', size = 30, color = '#fb7185', rotate = 0, onClick }) => (
  <div
    onClick={onClick}
    className={`inline-flex items-center justify-center select-none pointer-events-auto transition-transform duration-200 hover:scale-125 hover:-rotate-6 active:scale-95 cursor-pointer ${className}`}
    style={{
      transform: `rotate(${rotate}deg)`,
      filter: 'drop-shadow(0 2.5px 5px rgba(20, 40, 70, 0.22))',
    }}
  >
    <svg width={size} height={size * 0.75} viewBox="0 0 40 30" fill="none">
      <g stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" fill="#ffffff">
        <path d="M 20 15 C 13 8 4 8 6 16 C 8 23 16 19 20 15 Z" />
        <path d="M 20 15 C 27 8 36 8 34 16 C 32 23 24 19 20 15 Z" />
        <path d="M 17 18 L 12 28 L 16 27 L 19 20 Z" />
        <path d="M 23 18 L 28 28 L 24 27 L 21 20 Z" />
        <circle cx="20" cy="15" r="5" />
      </g>
      <path d="M 20 15 C 13 8 4 8 6 16 C 8 23 16 19 20 15 Z" fill={color} />
      <path d="M 20 15 C 27 8 36 8 34 16 C 32 23 24 19 20 15 Z" fill={color} />
      <path d="M 17 17 L 12 28 L 16 27 L 19 19 Z" fill={color} />
      <path d="M 23 17 L 28 28 L 24 27 L 21 19 Z" fill={color} />
      <circle cx="20" cy="15" r="3.8" fill="#fda4af" stroke={color} strokeWidth="1" />
      <path d="M 10 13 Q 15 14 18 15" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 30 13 Q 25 14 22 15" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  </div>
);

export const DaisyFlowerSticker: React.FC<{
  className?: string;
  size?: number;
  petalColor?: string;
  coreColor?: string;
  rotate?: number;
  onClick?: () => void;
}> = ({ className = '', size = 26, petalColor = '#ffffff', coreColor = '#fbbf24', rotate = 0, onClick }) => (
  <div
    onClick={onClick}
    className={`inline-flex items-center justify-center select-none pointer-events-auto transition-transform duration-200 hover:scale-125 hover:rotate-12 active:scale-95 cursor-pointer ${className}`}
    style={{
      transform: `rotate(${rotate}deg)`,
      filter: 'drop-shadow(0 2px 4px rgba(20, 40, 70, 0.2))',
    }}
  >
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14.5" fill="none" stroke="#ffffff" strokeWidth="2.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <ellipse
          key={i}
          cx="16"
          cy="8.5"
          rx="3.5"
          ry="5.5"
          fill={petalColor}
          stroke="#f1f5f9"
          strokeWidth="0.8"
          transform={`rotate(${angle} 16 16)`}
        />
      ))}
      <circle cx="16" cy="16" r="5" fill={coreColor} stroke="#f59e0b" strokeWidth="0.8" />
      <circle cx="14.5" cy="15.2" r="0.7" fill="#78350f" />
      <circle cx="17.5" cy="15.2" r="0.7" fill="#78350f" />
      <path d="M 15 17 Q 16 18 17 17" stroke="#78350f" strokeWidth="0.7" strokeLinecap="round" fill="none" />
    </svg>
  </div>
);

export const WashiTapeSticker: React.FC<{
  className?: string;
  width?: number;
  height?: number;
  color?: string;
  rotate?: number;
}> = ({ className = '', width = 50, height = 16, color = '#bae6fd', rotate = -8 }) => (
  <div
    className={`absolute select-none pointer-events-none z-20 ${className}`}
    style={{
      transform: `rotate(${rotate}deg)`,
      filter: 'drop-shadow(0 1.5px 3px rgba(20, 40, 70, 0.16))',
    }}
  >
    <svg width={width} height={height} viewBox="0 0 60 20" fill="none">
      <path
        d="M 0 3 L 3 0 L 6 3 L 8 0 L 10 3 L 57 3 L 60 7 L 57 11 L 60 15 L 57 18 L 10 18 L 8 20 L 6 18 L 3 20 L 0 17 Z"
        fill={color}
        fillOpacity="0.88"
      />
      <line x1="12" y1="2" x2="6" y2="18" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
      <line x1="22" y1="2" x2="16" y2="18" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
      <line x1="32" y1="2" x2="26" y2="18" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
      <line x1="42" y1="2" x2="36" y2="18" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
      <line x1="52" y1="2" x2="46" y2="18" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
    </svg>
  </div>
);

export const CuteSparkleStar: React.FC<{
  className?: string;
  size?: number;
  color?: string;
  rotate?: number;
  onClick?: () => void;
}> = ({ className = '', size = 20, color = '#facc15', rotate = 0, onClick }) => (
  <div
    onClick={onClick}
    className={`inline-flex items-center justify-center select-none pointer-events-auto transition-transform duration-200 hover:scale-130 active:scale-95 cursor-pointer ${className}`}
    style={{
      transform: `rotate(${rotate}deg)`,
      filter: 'drop-shadow(0 2px 4px rgba(20, 40, 70, 0.22))',
    }}
  >
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M 12 2 Q 12 9 5 12 Q 12 15 12 22 Q 12 15 19 12 Q 12 9 12 2 Z"
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M 12 3 Q 12 9.5 5.5 12 Q 12 14.5 12 21 Q 12 14.5 18.5 12 Q 12 9.5 12 3 Z"
        fill={color}
      />
      <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
    </svg>
  </div>
);

export const CuteStrawberrySticker: React.FC<{
  className?: string;
  size?: number;
  rotate?: number;
  onClick?: () => void;
}> = ({ className = '', size = 24, rotate = 0, onClick }) => (
  <div
    onClick={onClick}
    className={`inline-flex items-center justify-center select-none pointer-events-auto transition-transform duration-200 hover:scale-125 hover:rotate-6 active:scale-95 cursor-pointer ${className}`}
    style={{
      transform: `rotate(${rotate}deg)`,
      filter: 'drop-shadow(0 2px 4px rgba(20, 40, 70, 0.22))',
    }}
  >
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <path
        d="M 15 27 C 9 24 6 18 6 13 C 6 8 10 7 15 7 C 20 7 24 8 24 13 C 24 18 21 24 15 27 Z"
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M 15 26 C 9.5 23 7 17.5 7 13 C 7 8.5 10.5 7.5 15 7.5 C 19.5 7.5 23 8.5 23 13 C 23 17.5 20.5 23 15 26 Z"
        fill="#f43f5e"
      />
      <path d="M 15 7 L 12 3 L 14 6 L 9 5 L 13 8 L 15 7 Z" fill="#22c55e" stroke="#16a34a" strokeWidth="0.8" />
      <path d="M 15 7 L 18 3 L 16 6 L 21 5 L 17 8 L 15 7 Z" fill="#22c55e" stroke="#16a34a" strokeWidth="0.8" />
      <circle cx="15" cy="4" r="1" fill="#15803d" />
      <circle cx="11" cy="12" r="0.7" fill="#fef08a" />
      <circle cx="15" cy="12" r="0.7" fill="#fef08a" />
      <circle cx="19" cy="12" r="0.7" fill="#fef08a" />
      <circle cx="13" cy="16" r="0.7" fill="#fef08a" />
      <circle cx="17" cy="16" r="0.7" fill="#fef08a" />
      <circle cx="15" cy="20" r="0.7" fill="#fef08a" />
    </svg>
  </div>
);

export const CuteBunnySticker: React.FC<{
  className?: string;
  size?: number;
  rotate?: number;
  onClick?: () => void;
}> = ({ className = '', size = 26, rotate = 0, onClick }) => (
  <div
    onClick={onClick}
    className={`inline-flex items-center justify-center select-none pointer-events-auto transition-transform duration-200 hover:scale-125 hover:-rotate-6 active:scale-95 cursor-pointer ${className}`}
    style={{
      transform: `rotate(${rotate}deg)`,
      filter: 'drop-shadow(0 2px 4px rgba(20, 40, 70, 0.2))',
    }}
  >
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <g fill="#ffffff" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round">
        <ellipse cx="11" cy="9" rx="3" ry="7" />
        <ellipse cx="21" cy="9" rx="3" ry="7" />
        <circle cx="16" cy="20" r="10" />
      </g>
      <ellipse cx="11" cy="9" rx="2.5" ry="6.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
      <ellipse cx="21" cy="9" rx="2.5" ry="6.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
      <ellipse cx="11" cy="9" rx="1.5" ry="4.5" fill="#fbcfe8" />
      <ellipse cx="21" cy="9" rx="1.5" ry="4.5" fill="#fbcfe8" />
      <circle cx="16" cy="20" r="9.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
      <circle cx="12.5" cy="19" r="1.1" fill="#334155" />
      <circle cx="19.5" cy="19" r="1.1" fill="#334155" />
      <ellipse cx="10" cy="21.5" rx="1.8" ry="1" fill="#f472b6" opacity="0.6" />
      <ellipse cx="22" cy="21.5" rx="1.8" ry="1" fill="#f472b6" opacity="0.6" />
      <path d="M 15 21.5 Q 16 22.5 17 21.5" stroke="#ec4899" strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  </div>
);

/**
 * Realistic Metallic Steel Paperclip (exact match to reference image top-right clip).
 * Clipped over the top edge with metallic gradient, inner pinch, and drop shadow.
 */
export const MetallicPaperclip: React.FC<{
  className?: string;
  width?: number;
  height?: number;
  rotate?: number;
  onClick?: () => void;
}> = ({ className = '', width = 20, height = 44, rotate = 0, onClick }) => (
  <div
    onClick={onClick}
    className={`select-none transition-transform duration-200 hover:scale-115 active:scale-95 cursor-pointer z-30 ${className}`}
    style={{
      transform: `rotate(${rotate}deg)`,
      filter: 'drop-shadow(1px 3px 4px rgba(35, 20, 15, 0.35))',
    }}
    title="Metallic Paperclip"
  >
    <svg width={width} height={height} viewBox="0 0 24 52" fill="none">
      <defs>
        <linearGradient id="metalWireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="25%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor="#64748b" />
          <stop offset="75%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      {/* Underlying clip wire shadow */}
      <path
        d="M 5 22 L 5 40 C 5 46.5 13 46.5 13 40 L 13 13 C 13 6 21 6 21 13 L 21 43 C 21 51 2 51 2 43 L 2 22"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Main wire with metallic gradient */}
      <path
        d="M 5 22 L 5 40 C 5 45.5 13 45.5 13 40 L 13 13 C 13 7 21 7 21 13 L 21 43 C 21 50 2 50 2 43 L 2 22"
        stroke="url(#metalWireGrad)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Specular highlight lines */}
      <path
        d="M 4.6 24 L 4.6 39 M 12.6 15 L 12.6 39 M 20.6 15 L 20.6 42"
        stroke="#ffffff"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
    </svg>
  </div>
);

/**
 * Red & White Gingham Ribbon Bow (exact match to reference image top-left bow).
 */
export const GinghamRibbonBow: React.FC<{
  className?: string;
  size?: number;
  rotate?: number;
  onClick?: () => void;
}> = ({ className = '', size = 46, rotate = 0, onClick }) => (
  <div
    onClick={onClick}
    className={`select-none transition-transform duration-200 hover:scale-120 hover:rotate-6 active:scale-95 cursor-pointer z-30 ${className}`}
    style={{
      transform: `rotate(${rotate}deg)`,
      filter: 'drop-shadow(2px 5px 6px rgba(40, 15, 15, 0.3))',
    }}
    title="Gingham Ribbon Bow"
  >
    <svg width={size} height={(size * 42) / 48} viewBox="0 0 54 46" fill="none">
      <defs>
        <pattern id="ginghamPatternRed" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#ffffff" />
          <rect x="0" y="0" width="4" height="8" fill="#ef4444" fillOpacity="0.85" />
          <rect x="0" y="0" width="8" height="4" fill="#ef4444" fillOpacity="0.85" />
          <rect x="0" y="0" width="4" height="4" fill="#991b1b" />
        </pattern>
      </defs>

      {/* Left Hanging Ribbon Tail */}
      <path
        d="M 23 23 C 20 28 14 36 10 44 L 14 42 L 18 45 C 20 37 24 30 25 24 Z"
        fill="url(#ginghamPatternRed)"
        stroke="#b91c1c"
        strokeWidth="0.7"
        strokeLinejoin="round"
      />

      {/* Right Hanging Ribbon Tail */}
      <path
        d="M 31 23 C 34 29 40 37 45 44 L 41 42 L 37 45 C 34 38 30 30 29 24 Z"
        fill="url(#ginghamPatternRed)"
        stroke="#b91c1c"
        strokeWidth="0.7"
        strokeLinejoin="round"
      />

      {/* Left Bow Loop */}
      <path
        d="M 25 22 C 16 13 4 8 3 17 C 2 24 15 28 25 23 Z"
        fill="url(#ginghamPatternRed)"
        stroke="#991b1b"
        strokeWidth="0.8"
      />
      {/* Left inner fold shadow */}
      <path d="M 12 17 C 16 19 22 21 24 22" stroke="#7f1d1d" strokeWidth="1" strokeLinecap="round" />

      {/* Right Bow Loop */}
      <path
        d="M 29 22 C 38 13 50 8 51 17 C 52 24 39 28 29 23 Z"
        fill="url(#ginghamPatternRed)"
        stroke="#991b1b"
        strokeWidth="0.8"
      />
      {/* Right inner fold shadow */}
      <path d="M 42 17 C 38 19 32 21 30 22" stroke="#7f1d1d" strokeWidth="1" strokeLinecap="round" />

      {/* Center Ribbon Knot */}
      <ellipse cx="27" cy="22" rx="4.8" ry="4.2" fill="url(#ginghamPatternRed)" stroke="#7f1d1d" strokeWidth="1" />
      <path d="M 24.5 20 Q 27 21 29.5 20" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
    </svg>
  </div>
);

/**
 * Pink Resin Heart Button (exact match to reference image bottom-left button).
 * Glossy beveled heart with recessed 4-hole center and stitched white thread.
 */
export const PinkHeartButton: React.FC<{
  className?: string;
  size?: number;
  rotate?: number;
  onClick?: () => void;
}> = ({ className = '', size = 38, rotate = -12, onClick }) => (
  <div
    onClick={onClick}
    className={`select-none transition-transform duration-200 hover:scale-125 active:scale-95 cursor-pointer z-30 ${className}`}
    style={{
      transform: `rotate(${rotate}deg)`,
      filter: 'drop-shadow(2px 5px 6px rgba(45, 15, 25, 0.32))',
    }}
    title="Pink Heart Button"
  >
    <svg width={size} height={(size * 34) / 36} viewBox="0 0 36 34" fill="none">
      <defs>
        <radialGradient id="heartBtnGlowRef" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#fdf2f8" />
          <stop offset="35%" stopColor="#f472b6" />
          <stop offset="85%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#be185d" />
        </radialGradient>
        <linearGradient id="heartBtnBevelRef" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#be185d" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {/* Outer beveled glossy heart rim */}
      <path
        d="M 18 31 C 7 23 2 16 2 9.5 C 2 4.2 6.2 1 11.2 1 C 14.5 1 16.8 2.8 18 4.5 C 19.2 2.8 21.5 1 24.8 1 C 29.8 1 34 4.2 34 9.5 C 34 16 29 23 18 31 Z"
        fill="url(#heartBtnGlowRef)"
        stroke="url(#heartBtnBevelRef)"
        strokeWidth="1.6"
      />
      {/* Inner recessed button face */}
      <path
        d="M 18 26 C 9.5 19.5 5.5 14 5.5 8.8 C 5.5 4.8 8.8 2.5 12.8 2.5 C 15.4 2.5 17.1 3.8 18 5.2 C 18.9 3.8 20.6 2.5 23.2 2.5 C 27.2 2.5 30.5 4.8 30.5 8.8 C 30.5 14 26.5 19.5 18 26 Z"
        fill="#db2777"
        fillOpacity="0.22"
        stroke="#be185d"
        strokeWidth="0.8"
      />
      {/* Specular curved gloss highlight */}
      <path d="M 6.5 8.5 C 6.5 5 9.5 3.2 12.5 3.2" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
      {/* 4 button holes */}
      <circle cx="14" cy="11.5" r="1.3" fill="#831843" />
      <circle cx="22" cy="11.5" r="1.3" fill="#831843" />
      <circle cx="14" cy="17.5" r="1.3" fill="#831843" />
      <circle cx="22" cy="17.5" r="1.3" fill="#831843" />
      {/* Thread criss-cross */}
      <line x1="14" y1="11.5" x2="22" y2="17.5" stroke="#fdf2f8" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="22" y1="11.5" x2="14" y2="17.5" stroke="#fdf2f8" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  </div>
);

/**
 * Vintage Carved Ceramic/Wood Flower Button (exact match to reference image bottom-left).
 */
export const VintageFlowerButton: React.FC<{
  className?: string;
  size?: number;
  rotate?: number;
  onClick?: () => void;
}> = ({ className = '', size = 26, rotate = 10, onClick }) => (
  <div
    onClick={onClick}
    className={`select-none transition-transform duration-200 hover:scale-125 active:scale-95 cursor-pointer z-30 ${className}`}
    style={{
      transform: `rotate(${rotate}deg)`,
      filter: 'drop-shadow(1px 3px 4px rgba(45, 25, 20, 0.28))',
    }}
    title="Flower Button"
  >
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <defs>
        <radialGradient id="flowerBtnGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fae8e0" />
          <stop offset="60%" stopColor="#d4a395" />
          <stop offset="100%" stopColor="#9a5b4c" />
        </radialGradient>
      </defs>
      {/* 5 Petals */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <circle
          key={i}
          cx="15"
          cy="7.5"
          r="4.8"
          fill="url(#flowerBtnGrad)"
          stroke="#7c3d30"
          strokeWidth="0.6"
          transform={`rotate(${angle} 15 15)`}
        />
      ))}
      {/* Center recessed core */}
      <circle cx="15" cy="15" r="6" fill="#ca8a04" stroke="#78350f" strokeWidth="0.8" />
      <circle cx="13" cy="15" r="1.1" fill="#451a03" />
      <circle cx="17" cy="15" r="1.1" fill="#451a03" />
      <line x1="13" y1="15" x2="17" y2="15" stroke="#fef08a" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  </div>
);

/**
 * Stitched Red Felt Star (exact match to reference image bottom-left star).
 */
export const StitchedRedStar: React.FC<{
  className?: string;
  size?: number;
  rotate?: number;
  onClick?: () => void;
}> = ({ className = '', size = 28, rotate = -8, onClick }) => (
  <div
    onClick={onClick}
    className={`select-none transition-transform duration-200 hover:scale-125 active:scale-95 cursor-pointer z-30 ${className}`}
    style={{
      transform: `rotate(${rotate}deg)`,
      filter: 'drop-shadow(1px 3px 4px rgba(50, 15, 15, 0.32))',
    }}
    title="Stitched Red Star"
  >
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M 16 2 L 20 11.5 L 30 12.5 L 22.5 19.5 L 24.5 29.5 L 16 24.5 L 7.5 29.5 L 9.5 19.5 L 2 12.5 L 12 11.5 Z"
        fill="#991b1b"
        stroke="#7f1d1d"
        strokeWidth="0.8"
      />
      {/* Dashed white/cream perimeter stitches */}
      <path
        d="M 16 4.5 L 19.2 12.2 L 27.5 13 L 21.2 18.8 L 22.8 27 L 16 23 L 9.2 27 L 10.8 18.8 L 4.5 13 L 12.8 12.2 Z"
        stroke="#fef2f2"
        strokeWidth="0.9"
        strokeDasharray="2 1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  </div>
);

/**
 * Deep Velvet Maroon Hibiscus Flower (exact match to reference image bottom-right flower).
 * Layered rich burgundy petals with central golden yellow pistil and pollen grains.
 */
export const VelvetHibiscusFlower: React.FC<{
  className?: string;
  size?: number;
  rotate?: number;
  onClick?: () => void;
}> = ({ className = '', size = 52, rotate = 12, onClick }) => (
  <div
    onClick={onClick}
    className={`select-none transition-transform duration-200 hover:scale-115 hover:rotate-6 active:scale-95 cursor-pointer z-30 ${className}`}
    style={{
      transform: `rotate(${rotate}deg)`,
      filter: 'drop-shadow(3px 6px 8px rgba(35, 10, 15, 0.42))',
    }}
    title="Velvet Hibiscus Flower"
  >
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <radialGradient id="hibiscusVelvet" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e0507" />
          <stop offset="35%" stopColor="#450a0a" />
          <stop offset="70%" stopColor="#7f1d1d" />
          <stop offset="95%" stopColor="#881337" />
          <stop offset="100%" stopColor="#4c0519" />
        </radialGradient>
      </defs>

      {/* 5 Ruffled Velvet Petals */}
      {/* Petal 1 Top */}
      <path
        d="M 32 32 C 22 22 18 8 30 4 C 40 1 48 14 32 32 Z"
        fill="url(#hibiscusVelvet)"
        stroke="#27070a"
        strokeWidth="0.6"
      />
      {/* Petal 2 Right */}
      <path
        d="M 32 32 C 40 22 56 18 60 28 C 64 38 48 44 32 32 Z"
        fill="url(#hibiscusVelvet)"
        stroke="#27070a"
        strokeWidth="0.6"
      />
      {/* Petal 3 Bottom Right */}
      <path
        d="M 32 32 C 42 38 48 54 38 60 C 28 64 24 48 32 32 Z"
        fill="url(#hibiscusVelvet)"
        stroke="#27070a"
        strokeWidth="0.6"
      />
      {/* Petal 4 Bottom Left */}
      <path
        d="M 32 32 C 24 42 8 48 4 38 C 0 28 16 24 32 32 Z"
        fill="url(#hibiscusVelvet)"
        stroke="#27070a"
        strokeWidth="0.6"
      />
      {/* Petal 5 Top Left */}
      <path
        d="M 32 32 C 18 26 8 12 18 6 C 26 1 30 18 32 32 Z"
        fill="url(#hibiscusVelvet)"
        stroke="#27070a"
        strokeWidth="0.6"
      />

      {/* Ruffled Petal Veins */}
      <path d="M 32 32 Q 30 16 31 7" stroke="#991b1b" strokeWidth="0.8" opacity="0.6" />
      <path d="M 32 32 Q 46 25 54 28" stroke="#991b1b" strokeWidth="0.8" opacity="0.6" />
      <path d="M 32 32 Q 38 48 37 55" stroke="#991b1b" strokeWidth="0.8" opacity="0.6" />
      <path d="M 32 32 Q 18 37 10 36" stroke="#991b1b" strokeWidth="0.8" opacity="0.6" />
      <path d="M 32 32 Q 22 18 19 10" stroke="#991b1b" strokeWidth="0.8" opacity="0.6" />

      {/* Deep Dark Center Throat */}
      <circle cx="32" cy="32" r="7" fill="#120204" />

      {/* Bright Golden Yellow Pistil / Stamen with Pollen Granules */}
      <path
        d="M 32 32 Q 36 26 40 22"
        stroke="#eab308"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="41" cy="21" r="2.2" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
      <circle cx="39" cy="19" r="1.4" fill="#fde047" />
      <circle cx="43" cy="22" r="1.3" fill="#fde047" />
      <circle cx="38" cy="24" r="1.2" fill="#fde047" />
      <circle cx="35" cy="27" r="1" fill="#fde047" />
      <circle cx="31" cy="30" r="1" fill="#fde047" />
      <circle cx="34" cy="33" r="1" fill="#fde047" />
    </svg>
  </div>
);

/**
 * ScrapbookNoteBox: Fully authentic reproduction of the user's uploaded reference image (image_1d8999d6.png).
 * Features:
 * - Layer 1: Deckled, torn pink paper backing extending past the top-left and bottom edges.
 * - Layer 2: Off-white/cream textured kraft paper note card with realistic torn deckled bottom edge.
 * - Scrapbook Embellishments:
 *   - Metallic paperclip pinned on the top edge.
 *   - Red & white gingham ribbon bow on the top-left corner.
 *   - Pink heart button + flower button + red star cluster on the bottom-left corner.
 *   - Deep velvet maroon hibiscus flower on the bottom-right corner.
 */
export const ScrapbookNoteBox: React.FC<{
  children: React.ReactNode;
  className?: string;
  backingColor?: string;
  borderColor?: string;
  showPaperclip?: boolean;
  paperclipSide?: 'left' | 'right';
  showBow?: boolean;
  showButtons?: boolean;
  showFlower?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}> = ({
  children,
  className = '',
  backingColor = '#ecd2d8',
  borderColor,
  showPaperclip = true,
  paperclipSide = 'right',
  showBow = true,
  showButtons = true,
  showFlower = true,
  onClick,
  style = {},
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative select-none transition-transform duration-300 hover:-translate-y-0.5 cursor-pointer group ${className}`}
      style={style}
    >
      {/* 1. UNDERLYING TORN PAPER LAYER (Deckled scrapbook backing that changes with palette) */}
      <div
        className="absolute -inset-1.5 sm:-inset-2 pointer-events-none rounded-2xl overflow-visible opacity-95 transition-all duration-300"
        style={{
          filter: 'drop-shadow(0 6px 14px rgba(45, 20, 25, 0.16))',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Deckled irregular torn paper polygon */}
          <path
            d="M 2 10 
               Q 4 2 12 1 
               L 85 2 
               Q 96 1 97 12 
               L 98 84 
               Q 97 96 86 97 
               L 16 98 
               Q 3 98 2 86 
               L 1 45 
               Z"
            fill={backingColor}
          />
          {/* Torn paper edge texture highlights */}
          <path
            d="M 1 14 L 3 10 L 1 7 L 4 4 L 8 2 L 14 1 M 2 82 L 1 88 L 3 93 L 7 97 L 14 98"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeOpacity="0.6"
            fill="none"
          />
        </svg>
      </div>

      {/* 2. FOREGROUND TORN CREAM KRAFT NOTE CARD */}
      <div
        className="relative bg-[#fcf9f2] rounded-xl border-2 shadow-md transition-all duration-300 group-hover:shadow-lg pt-4 pb-5 px-5 sm:px-7 overflow-visible"
        style={{
          borderColor: borderColor || '#ece4d2',
          boxShadow:
            '0 8px 24px -4px rgba(45, 25, 20, 0.16), 0 2px 6px rgba(45, 25, 20, 0.08)',
        }}
      >
        {/* Subtle Paper Fiber Crease Texture Overlay */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(#d6c9b3 0.6px, transparent 0.6px), radial-gradient(#d6c9b3 0.6px, #fcf9f2 0.6px)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 8px 8px',
          }}
        />

        {/* Torn Deckled Bottom Edge Indicator (Frayed paper bottom exposing the pink backing) */}
        <div className="absolute -bottom-2 left-0 right-0 h-3 pointer-events-none overflow-hidden z-10">
          <svg viewBox="0 0 400 12" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M 0 0 
                 L 20 6 L 40 2 L 65 7 L 85 3 L 110 8 L 135 2 L 160 7 L 185 3 L 210 8 L 235 2 L 260 7 L 285 3 L 310 8 L 335 2 L 360 7 L 385 3 L 400 6 
                 L 400 12 L 0 12 Z"
              fill={backingColor}
            />
            {/* White paper fiber fray edge */}
            <path
              d="M 0 0 
                 L 20 6 L 40 2 L 65 7 L 85 3 L 110 8 L 135 2 L 160 7 L 185 3 L 210 8 L 235 2 L 260 7 L 285 3 L 310 8 L 335 2 L 360 7 L 385 3 L 400 6"
              stroke="#ffffff"
              strokeWidth="1.2"
              fill="none"
              strokeOpacity="0.8"
            />
          </svg>
        </div>

        {/* METALLIC PAPERCLIP AT TOP EDGE */}
        {showPaperclip && (
          <div
            className={`absolute -top-3.5 ${
              paperclipSide === 'right' ? 'right-6 sm:right-9' : 'left-6 sm:left-9'
            }`}
          >
            <MetallicPaperclip width={20} height={42} rotate={2} />
          </div>
        )}

        {/* GINGHAM RIBBON BOW AT TOP-LEFT */}
        {showBow && (
          <div className="absolute -top-4 -left-3 sm:-left-4">
            <GinghamRibbonBow size={46} rotate={-6} />
          </div>
        )}

        {/* CLUSTER OF BUTTONS & STAR AT BOTTOM-LEFT */}
        {showButtons && (
          <div className="absolute -bottom-4 -left-3 flex items-end pointer-events-auto">
            {/* Vintage Flower Button */}
            <div className="relative -mr-2 mb-4 z-20">
              <VintageFlowerButton size={22} rotate={15} />
            </div>
            {/* Stitched Red Star */}
            <div className="relative -mr-3.5 mb-1 z-20">
              <StitchedRedStar size={24} rotate={-10} />
            </div>
            {/* Pink Heart Button */}
            <div className="relative z-30">
              <PinkHeartButton size={34} rotate={-14} />
            </div>
          </div>
        )}

        {/* VELVET HIBISCUS FLOWER AT BOTTOM-RIGHT */}
        {showFlower && (
          <div className="absolute -bottom-4.5 -right-3.5 sm:-right-4.5">
            <VelvetHibiscusFlower size={52} rotate={8} />
          </div>
        )}

        {/* 3. CARD CONTENT CONTAINER */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
};

/**
 * ScrapbookPage7Hearts: Hand-crafted dual heart stickers for top-left of Page 7.
 * Adapts dynamically to the selected ColorTheme.
 */
export const ScrapbookPage7Hearts: React.FC<{
  className?: string;
  theme: ColorTheme;
  onClick?: () => void;
}> = ({ className = '', theme, onClick }) => {
  const accent = theme?.accentColor || '#1b3c6e';
  const light = theme?.scallopLight || '#cde2f5';

  return (
    <div
      onClick={() => {
        sounds.playPop();
        onClick?.();
      }}
      className={`relative select-none pointer-events-auto cursor-pointer group transition-transform duration-300 hover:scale-105 active:scale-95 ${className}`}
      style={{
        filter: 'drop-shadow(0 4px 10px rgba(18, 40, 72, 0.22)) drop-shadow(0 1px 3px rgba(18, 40, 72, 0.12))',
      }}
      title="Sweet Love Hearts ❤️"
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28">
        {/* Upper-Right Heart (Cut-out open style) */}
        <div
          className="absolute -top-1 right-0 w-12 h-12 sm:w-14 sm:h-14 transform -rotate-12 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
          style={{
            filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.18))',
          }}
        >
          <svg viewBox="0 0 100 90" className="w-full h-full overflow-visible">
            {/* White die-cut cardstock edge */}
            <path
              d="M 50 82 C 16 54 4 36 4 20 C 4 9 12 2 24 2 C 34 2 44 8 50 18 C 56 8 66 2 76 2 C 88 2 96 9 96 20 C 96 36 84 54 50 82 Z"
              fill="#ffffff"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Theme deep tone heart fill */}
            <path
              d="M 50 78 C 18 52 8 36 8 22 C 8 12 14 6 24 6 C 33 6 42 12 50 22 C 58 12 67 6 76 6 C 86 6 92 12 92 22 C 92 36 82 52 50 78 Z"
              fill={accent}
            />
            {/* Open / cut-out center heart contour */}
            <path
              d="M 50 63 C 28 44 20 32 20 22 C 20 16 24 12 30 12 C 36 12 43 17 50 25 C 57 17 64 12 70 12 C 76 12 80 16 80 22 C 80 32 72 44 50 63 Z"
              fill={light}
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Subtle linocut paper grain highlights */}
            <path
              d="M 28 20 C 30 16 34 16 38 18 M 62 18 C 66 16 70 16 72 20"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Lower-Left Heart (Concentric Nested Heart) */}
        <div
          className="absolute bottom-0 left-0 w-16 h-16 sm:w-19 sm:h-19 transform -rotate-6 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.22))',
          }}
        >
          <svg viewBox="0 0 100 90" className="w-full h-full overflow-visible">
            {/* White die-cut cardstock edge */}
            <path
              d="M 50 84 C 15 56 3 37 3 20 C 3 9 11 2 23 2 C 33 2 43 8 50 18 C 57 8 67 2 77 2 C 89 2 97 9 97 20 C 97 37 85 56 50 84 Z"
              fill="#ffffff"
              stroke="#ffffff"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* Theme deep tone heart base */}
            <path
              d="M 50 80 C 18 53 7 36 7 21 C 7 12 14 6 24 6 C 33 6 42 12 50 22 C 58 12 67 6 76 6 C 86 6 93 12 93 21 C 93 36 82 53 50 80 Z"
              fill={accent}
            />
            {/* Outer concentric white border */}
            <path
              d="M 50 67 C 26 47 17 34 17 22 C 17 15 22 10 29 10 C 36 10 43 15 50 23 C 57 15 64 10 71 10 C 78 10 83 15 83 22 C 83 34 74 47 50 67 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            {/* Middle inner heart ring in palette scallop color */}
            <path
              d="M 50 56 C 33 40 26 30 26 22 C 26 17 29 14 34 14 C 39 14 44 18 50 24 C 56 18 61 14 66 14 C 71 14 74 17 74 22 C 74 30 67 40 50 56 Z"
              fill="none"
              stroke={light}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Innermost mini heart in white */}
            <path
              d="M 50 44 C 42 35 38 29 38 23 C 38 20 40 18 43 18 C 46 18 49 20 50 23 C 51 20 54 18 57 18 C 60 18 62 20 62 23 C 62 29 58 35 50 44 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

/**
 * ScrapbookPage7Camera: Handcrafted scrapbook digital camera with lanyard strap.
 * Perfectly overlaps the 3rd photo on Page 7 and dynamically adapts to the selected ColorTheme.
 * Features an interactive shutter flash effect on click!
 */
export const ScrapbookPage7Camera: React.FC<{
  className?: string;
  theme: ColorTheme;
  rotate?: number;
  sizeClass?: string;
  showStrap?: boolean;
  isTriggering?: boolean;
  onClick?: () => void;
}> = ({
  className = '',
  theme,
  rotate = 14,
  sizeClass = 'w-26 h-20 sm:w-34 sm:h-26 md:w-40 md:h-30',
  showStrap = true,
  isTriggering = false,
  onClick,
}) => {
  const [internalFlashing, setInternalFlashing] = React.useState(false);

  const accent = theme?.accentColor || '#1b3c6e';
  const scallop = theme?.scallopColor || '#94bee3';
  const light = theme?.scallopLight || '#cde2f5';

  const isFlashing = isTriggering || internalFlashing;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playCameraShutter();
    setInternalFlashing(true);
    setTimeout(() => setInternalFlashing(false), 240);
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      className={`relative select-none pointer-events-auto cursor-pointer group transition-transform duration-300 hover:scale-105 active:scale-95 ${className}`}
      style={{
        filter: 'drop-shadow(2px 6px 16px rgba(18, 40, 72, 0.28)) drop-shadow(0 2px 5px rgba(18, 40, 72, 0.15))',
      }}
      title="Snap memory! 📸 Click for shutter"
    >
      {/* Decorative Wavy Strap / Lanyard connecting from frame edge */}
      {showStrap && (
        <div className="absolute -top-6 -right-1 w-24 h-14 pointer-events-none overflow-visible z-0">
          <svg viewBox="0 0 160 100" fill="none" className="w-full h-full overflow-visible">
            <path
              d="M 160 -15 C 130 10 110 5 80 32 C 60 52 45 55 20 60"
              stroke="#ffffff"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 160 -15 C 130 10 110 5 80 32 C 60 52 45 55 20 60"
              stroke={scallop}
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {/* Main Scrapbook Camera SVG */}
      <div
        className={`relative ${sizeClass} origin-center z-10 transition-transform duration-300`}
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        <svg viewBox="0 0 200 150" fill="none" className="w-full h-full overflow-visible">
          {/* 1. White Cardstock Die-Cut Sticker Outline */}
          <g>
            {/* Shutter Button White Outline */}
            <rect x="34" y="10" width="28" height="18" rx="4" fill="#ffffff" />
            {/* Viewfinder / Prism Top Hump White Outline */}
            <path d="M 72 20 L 78 8 L 132 8 L 138 20 Z" fill="#ffffff" />
            {/* Main Body White Paper Cardstock */}
            <path
              d="M 22 20 
                 L 174 20 
                 C 186 20 194 28 194 40 
                 L 194 65 
                 C 188 72 188 88 194 95 
                 L 194 124 
                 C 194 136 186 144 174 144 
                 L 22 144 
                 C 10 144 2 136 2 124 
                 L 2 40 
                 C 2 28 10 20 22 20 Z"
              fill="#ffffff"
              stroke="#ffffff"
              strokeWidth="6"
              strokeLinejoin="round"
            />
          </g>

          {/* 2. Theme-Colored Camera Body Fill */}
          {/* Shutter button */}
          <rect x="37" y="13" width="22" height="12" rx="3" fill={accent} />
          {/* Viewfinder Hump */}
          <path d="M 76 20 L 81 12 L 129 12 L 134 20 Z" fill={scallop} />
          {/* Flash glass window on hump */}
          <rect x="94" y="14" width="22" height="5" rx="1.5" fill="#ffffff" opacity="0.9" />

          {/* Main Body with Scallop / Pastel Palette Fill */}
          <path
            d="M 22 23 
               L 174 23 
               C 184 23 190 29 190 39 
               L 190 66 
               C 184 73 184 87 190 94 
               L 190 122 
               C 190 132 184 140 174 140 
               L 22 140 
               C 12 140 6 132 6 122 
               L 6 39 
               C 6 29 12 23 22 23 Z"
            fill={scallop}
            stroke={accent}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* 3. Screen / Viewfinder Window (Light cardstock insert) */}
          <rect
            x="20"
            y="35"
            width="106"
            height="88"
            rx="8"
            fill="#faf8f2"
            stroke="#ffffff"
            strokeWidth="4"
          />
          {/* Inner screen border with accent color */}
          <rect
            x="24"
            y="39"
            width="98"
            height="80"
            rx="6"
            fill={light}
            fillOpacity="0.45"
            stroke={accent}
            strokeWidth="1.8"
            strokeDasharray="4 2"
          />

          {/* Screen Crosshair / Focus brackets */}
          <path
            d="M 32 48 L 40 48 M 32 48 L 32 56 
               M 114 48 L 106 48 M 114 48 L 114 56 
               M 32 110 L 40 110 M 32 110 L 32 102 
               M 114 110 L 106 110 M 114 110 L 114 102"
            stroke={accent}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Center focus indicator */}
          <circle cx="73" cy="79" r="8" stroke={accent} strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
          <circle cx="73" cy="79" r="2.5" fill={accent} />

          {/* 4. Right Control Panel & Dials */}
          {/* Main Dial / Lens Wheel */}
          <circle cx="158" cy="94" r="18" fill="#ffffff" />
          <circle cx="158" cy="94" r="16" fill={accent} />
          <circle cx="158" cy="94" r="11" fill={scallop} stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="158" cy="94" r="5" fill={accent} />

          {/* Grip and Control Buttons */}
          <circle cx="145" cy="50" r="4.5" fill="#ffffff" />
          <circle cx="145" cy="50" r="3.5" fill={accent} />

          <circle cx="168" cy="56" r="4.5" fill="#ffffff" />
          <circle cx="168" cy="56" r="3.5" fill={accent} />

          <rect x="142" y="122" width="28" height="5" rx="2.5" fill="#ffffff" />
          <rect x="144" y="123" width="24" height="3" rx="1.5" fill={accent} />

          {/* Paper Texture / Highlight Flecks */}
          <path
            d="M 28 30 L 160 30"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 184 45 L 184 62"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Shutter Click Flash Burst Effect */}
        {isFlashing && (
          <div className="absolute inset-0 bg-white/90 rounded-2xl animate-ping pointer-events-none" />
        )}
      </div>
    </div>
  );
};


