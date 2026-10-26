export interface ColorTheme {
  id: 'blue' | 'pink' | 'matcha' | 'lavender' | 'butter';
  name: string;
  shortName: string;
  // Whole website page background
  bgApp: string;
  bgHeader: string;
  borderHeader: string;
  footerBg: string;
  
  // Primary brand & text accents
  accentColor: string;       // deep rich tone for headers & prominent text
  scallopColor: string;      // vibrant medium tone for scallops, stickers, borders
  scallopLight: string;      // soft pastel tint
  badgeBg: string;           // pill badge background
  
  // Card & Canvas styling for all scrapbook pages
  canvasBg: string;          // page card base color (replaces #b5d3ed / #c8dcee)
  plaidStripe: string;       // rgba for the thick plaid bands
  plaidInter: string;        // intersection color in SVG grid
  plaidLine: string;         // fine line grid color
  darkFrame: string;         // dark film strip / window header
  
  // Interactive buttons
  btnBg: string;             // primary button background
  btnHover: string;          // button hover background
  btnActive: string;         // button active
  btnText: string;           // button text color (usually white)
  btnShadow: string;         // drop shadow rgba for primary buttons
  
  // Flower cutout on Page 2
  flowerOuter: string;
  flowerInner: string;
  flowerDot: string;
  
  // Balloons & visual hue filter (if applying CSS filter to images)
  balloonFilter: string;

  // Scrapbook design filter (colorizes blue-based scrapbook image assets to match theme palette)
  scrapbookFilter: string;

  // Star particle colors for button click animations
  starColors: string[];

  // Confetti paper particle colors
  confettiColors: string[];

  // Gingham CSS class
  ginghamClass: string;
}

export const THEMES: ColorTheme[] = [
  {
    id: 'blue',
    name: 'Sky Blue Gingham (Original)',
    shortName: 'Sky',
    bgApp: '#e9f2f9',
    bgHeader: '#f8fbfe',
    borderHeader: '#d8e6f3',
    footerBg: '#f8fbfe',
    accentColor: '#1b3c6e',
    scallopColor: '#94bee3',
    scallopLight: '#cde2f5',
    badgeBg: '#94bee3',
    canvasBg: '#faf6ea',
    plaidStripe: 'rgba(162, 203, 235, 0.55)',
    plaidInter: '#bcdcf2',
    plaidLine: '#a2cbeb',
    darkFrame: '#183664',
    btnBg: '#1b3c6e',
    btnHover: '#28538c',
    btnActive: '#132c52',
    btnText: '#ffffff',
    btnShadow: 'rgba(27, 60, 110, 0.35)',
    flowerOuter: '#6c93be',
    flowerInner: '#547ea8',
    flowerDot: '#44688f',
    balloonFilter: 'none',
    scrapbookFilter: 'none',
    starColors: ['#94bee3', '#1b3c6e', '#4a90e2', '#bcdcf2', '#ffffff'],
    confettiColors: ['#94bee3', '#1b3c6e', '#faf6ea', '#bcdcf2', '#a2cbeb', '#ffffff'],
    ginghamClass: 'bg-gingham-blue',
  },
  {
    id: 'pink',
    name: 'Strawberry Milk',
    shortName: 'Strawberry',
    bgApp: '#fdf0f4',
    bgHeader: '#fff7f9',
    borderHeader: '#f5d4de',
    footerBg: '#fff7f9',
    accentColor: '#9c244c',
    scallopColor: '#f7b4c4',
    scallopLight: '#fde0e7',
    badgeBg: '#f7b4c4',
    canvasBg: '#f9cad6',
    plaidStripe: 'rgba(247, 180, 196, 0.7)',
    plaidInter: '#ea9bb0',
    plaidLine: '#e0879f',
    darkFrame: '#59162e',
    btnBg: '#9c244c',
    btnHover: '#b8325f',
    btnActive: '#7a1939',
    btnText: '#ffffff',
    btnShadow: 'rgba(156, 36, 76, 0.35)',
    flowerOuter: '#d66b8c',
    flowerInner: '#b5486a',
    flowerDot: '#8e304e',
    balloonFilter: 'hue-rotate(130deg) saturate(1.15)',
    scrapbookFilter: 'hue-rotate(140deg) saturate(1.15)',
    starColors: ['#f7b4c4', '#9c244c', '#f472b6', '#fbcfe8', '#ffffff'],
    confettiColors: ['#f7b4c4', '#9c244c', '#fdf6f4', '#fbcfe8', '#fb7185', '#ffffff'],
    ginghamClass: 'bg-gingham-pink',
  },
  {
    id: 'matcha',
    name: 'Matcha Latte',
    shortName: 'Matcha',
    bgApp: '#edf5ec',
    bgHeader: '#f7fbf6',
    borderHeader: '#d6e8d4',
    footerBg: '#f7fbf6',
    accentColor: '#245932',
    scallopColor: '#b2d4a9',
    scallopLight: '#e0f0dc',
    badgeBg: '#b2d4a9',
    canvasBg: '#c8e4c3',
    plaidStripe: 'rgba(178, 212, 169, 0.7)',
    plaidInter: '#9ec797',
    plaidLine: '#88b780',
    darkFrame: '#174023',
    btnBg: '#245932',
    btnHover: '#307341',
    btnActive: '#183d22',
    btnText: '#ffffff',
    btnShadow: 'rgba(36, 89, 50, 0.35)',
    flowerOuter: '#6fa56c',
    flowerInner: '#51864e',
    flowerDot: '#3a6637',
    balloonFilter: 'hue-rotate(240deg) saturate(0.95)',
    scrapbookFilter: 'hue-rotate(255deg) saturate(0.95)',
    starColors: ['#b2d4a9', '#245932', '#65a30d', '#dcfce7', '#ffffff'],
    confettiColors: ['#b2d4a9', '#245932', '#f8faf4', '#86efac', '#a3e635', '#ffffff'],
    ginghamClass: 'bg-gingham-matcha',
  },
  {
    id: 'lavender',
    name: 'Lavender Whisper',
    shortName: 'Lavender',
    bgApp: '#f4f0fa',
    bgHeader: '#fbf9fe',
    borderHeader: '#e3daf4',
    footerBg: '#fbf9fe',
    accentColor: '#4f3182',
    scallopColor: '#cdb9ee',
    scallopLight: '#ede5fb',
    badgeBg: '#cdb9ee',
    canvasBg: '#ded1f6',
    plaidStripe: 'rgba(205, 185, 238, 0.7)',
    plaidInter: '#bba4e5',
    plaidLine: '#aa8fda',
    darkFrame: '#361e60',
    btnBg: '#4f3182',
    btnHover: '#623fa1',
    btnActive: '#3b2363',
    btnText: '#ffffff',
    btnShadow: 'rgba(79, 49, 130, 0.35)',
    flowerOuter: '#8f73c5',
    flowerInner: '#7153a8',
    flowerDot: '#523783',
    balloonFilter: 'hue-rotate(75deg) saturate(1.2)',
    scrapbookFilter: 'hue-rotate(60deg) saturate(1.2)',
    starColors: ['#cdb9ee', '#4f3182', '#a855f7', '#ede5fb', '#ffffff'],
    confettiColors: ['#cdb9ee', '#4f3182', '#f8f6fc', '#d8b4fe', '#c084fc', '#ffffff'],
    ginghamClass: 'bg-gingham-lavender',
  },
  {
    id: 'butter',
    name: 'Buttercup Honey',
    shortName: 'Buttercup',
    bgApp: '#faf5e8',
    bgHeader: '#fdfbf6',
    borderHeader: '#ede2c9',
    footerBg: '#fdfbf6',
    accentColor: '#7e5513',
    scallopColor: '#f6dd94',
    scallopLight: '#faeec7',
    badgeBg: '#f6dd94',
    canvasBg: '#fae9b8',
    plaidStripe: 'rgba(246, 221, 148, 0.7)',
    plaidInter: '#e3be75',
    plaidLine: '#d5ac5b',
    darkFrame: '#52360b',
    btnBg: '#7e5513',
    btnHover: '#996717',
    btnActive: '#63420d',
    btnText: '#ffffff',
    btnShadow: 'rgba(126, 85, 19, 0.35)',
    flowerOuter: '#d9a74b',
    flowerInner: '#b8852c',
    flowerDot: '#8c6019',
    balloonFilter: 'hue-rotate(185deg) saturate(1.3) brightness(1.08)',
    scrapbookFilter: 'hue-rotate(195deg) saturate(1.3) brightness(1.06)',
    starColors: ['#f6dd94', '#7e5513', '#d9a74b', '#faeec7', '#ffffff'],
    confettiColors: ['#f6dd94', '#7e5513', '#fffef2', '#faeec7', '#d9a74b', '#ffffff'],
    ginghamClass: 'bg-gingham-butter',
  },
];
