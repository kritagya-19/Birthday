export interface Page1Texts {
  line1: string;
  line2: string;
  buttonText: string;
}

export interface Page2Texts {
  line1: string;
  line2: string;
  buttonText: string;
  boxBannerText: string;
  boxTagText: string;
}

export interface Page3Texts {
  line1: string;
  line2: string;
  buttonText: string;
}

export interface Page4Texts {
  buttonText: string;
}

export interface Page5Texts {
  heading: string;
  card1: string;
  card2Line1: string;
  card2Line2: string;
  card2Line3: string;
  buttonText: string;
  frame1Title: string;
  frame2Title: string;
  frame3Title: string;
  frame4Title: string;
  frame5Title: string;
}

export interface Page6Texts {
  bubble1Line1: string;
  bubble1Line2: string;
  bubble2Line1: string;
  bubble2Line2: string;
  bubble2Line3: string;
  bubble2Line4: string;
  buttonText: string;
}

export interface Page7Texts {
  centerInitials: string;
  buttonText: string;
}

export interface Page8Texts {
  line1: string;
  line2: string;
  yesButtonText: string;
  ticketMainText: string;
  ticketSubText: string;
}

export interface Page9Texts {
  line1: string;
  line2: string;
  subPrompt: string;
  calendarHeader: string;
  stampTitle: string;
  stampSubtitle: string;
}

export interface AllPagesTexts {
  page1: Page1Texts;
  page2: Page2Texts;
  page3: Page3Texts;
  page4: Page4Texts;
  page5: Page5Texts;
  page6: Page6Texts;
  page7: Page7Texts;
  page8: Page8Texts;
  page9: Page9Texts;
}

export interface Page1Photos {
  sticker: string;
}

export interface Page2Photos {
  sticker: string;
}

export interface Page3Photos {
  main: string;
  thumb1: string;
  thumb2: string;
  thumb3: string;
}

export interface Page4Photos {
  main: string;
  polaroid1: string;
  polaroid2: string;
  polaroid3: string;
}

export interface Page5Photos {
  mirror: string;
  dinner: string;
  roses: string;
  kiss: string;
  selfie: string;
}

export interface Page6Photos {
  main: string;
}

export interface Page7Photos {
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  p5: string;
  p6: string;
}

export interface Page8Photos {
  sticker: string;
}

export interface Page9Photos {
  leftPhoto: string;
  rightPhoto: string;
}

export interface AllPagesPhotos {
  page1: Page1Photos;
  page2: Page2Photos;
  page3: Page3Photos;
  page4: Page4Photos;
  page5: Page5Photos;
  page6: Page6Photos;
  page7: Page7Photos;
  page8: Page8Photos;
  page9: Page9Photos;
}

export const DEFAULT_ALL_PAGES_TEXTS: AllPagesTexts = {
  page1: {
    line1: 'HEY YOU’VE GOT',
    line2: 'A MESSAGE!',
    buttonText: 'CLICK HERE',
  },
  page2: {
    line1: 'ARE YOU READY FOR A',
    line2: 'SURPRiSE?',
    buttonText: 'YES',
    boxBannerText: 'Happy Birthday',
    boxTagText: 'FOR YOU ✨',
  },
  page3: {
    line1: 'HAPPY BiRTHDAY MY',
    line2: 'LOVE',
    buttonText: 'NEXT',
  },
  page4: {
    buttonText: 'LOVE YOU ALWAYS 💌',
  },
  page5: {
    heading: 'YOU',
    card1: 'TO MY RIDE-OR-DIE! LOVE YOU',
    card2Line1: 'CONGRATS ON ANOTHER YEAR OF BEING AMAZING!',
    card2Line2: 'MAY YOUR DAY BE FULL OF GOOD VIBES,',
    card2Line3: 'GOOD CAKE, AND ZERO NONSENSE.',
    buttonText: 'NEXT',
    frame1Title: 'Mirror Bouquet Selfie',
    frame2Title: 'Birthday Dinner Celebration',
    frame3Title: 'Pink Roses Bouquet',
    frame4Title: 'Sweet Celebration',
    frame5Title: 'Joyful Memories',
  },
  page6: {
    bubble1Line1: 'You make my world brighter',
    bubble1Line2: 'and my heart fuller.',
    bubble2Line1: 'I hope you see yourself',
    bubble2Line2: 'through my eyes: strong,',
    bubble2Line3: 'beautiful, resilient, and',
    bubble2Line4: 'irreplaceable',
    buttonText: 'MY FAV PIC OF US →',
  },
  page7: {
    centerInitials: 'S × N',
    buttonText: 'OUR LOVE STORY 💌',
  },
  page8: {
    line1: 'WILL YOU BE MY',
    line2: 'DATE TONIGHT?',
    yesButtonText: 'YES',
    ticketMainText: 'DATE NIGHT',
    ticketSubText: 'ADMIT TWO',
  },
  page9: {
    line1: "YEY, LET'S GO LOVE.",
    line2: 'SEE YOU THERE!',
    subPrompt: 'Tap on Bouquet for surprise',
    calendarHeader: 'TONIGHT',
    stampTitle: "IT'S A DATE!",
    stampSubtitle: '✓ CONFIRMED ♥',
  },
};

export const DEFAULT_ALL_PAGES_PHOTOS: AllPagesPhotos = {
  page1: {
    sticker: '/assets/aistudio/bubu_dudu_love_page1.gif',
  },
  page2: {
    sticker: 'https://media.tenor.com/-aW73OVUtyYAAAAi/tkthao219-bubududu.gif',
  },
  page3: {
    main: '/assets/aistudio/photo_main_selfie.png',
    thumb1: '/assets/aistudio/photo_tiger_mask.png',
    thumb2: '/assets/aistudio/photo_roses.png',
    thumb3: '/assets/aistudio/photo_popcorn.png',
  },
  page4: {
    main: '/assets/aistudio/photo_page4_flower_girl.png',
    polaroid1: '/assets/aistudio/photo_page4_pure1.png',
    polaroid2: '/assets/aistudio/photo_page4_pure2.png',
    polaroid3: '/assets/aistudio/photo_page4_pure3.png',
  },
  page5: {
    mirror: '/assets/aistudio/photo_page5_mirror.png',
    dinner: '/assets/aistudio/photo_page5_dinner.png',
    roses: '/assets/aistudio/photo_roses.png',
    kiss: '/assets/aistudio/photo_page6_kiss.png',
    selfie: '/assets/aistudio/photo_main_selfie.png',
  },
  page6: {
    main: '/assets/aistudio/photo_page6_kiss.png',
  },
  page7: {
    p1: '/assets/aistudio/photo_p7_1.png',
    p2: '/assets/aistudio/photo_p7_2.png',
    p3: '/assets/aistudio/photo_p7_3.png',
    p4: '/assets/aistudio/photo_p7_4.png',
    p5: '/assets/aistudio/photo_p7_5.png',
    p6: '/assets/aistudio/photo_p7_6.png',
  },
  page8: {
    sticker: '/assets/aistudio/dudu_cry_page8.gif',
  },
  page9: {
    leftPhoto: '/assets/aistudio/dudu_fingerguns_page9.gif',
    rightPhoto: '/assets/aistudio/bubu_happy_page9.gif',
  },
};

const PAGE_TEXTS_STORAGE_KEY = 'scrapbook_mail_all_page_texts_v1';
const PAGE_PHOTOS_STORAGE_KEY = 'scrapbook_mail_all_page_photos_v1';
const PHOTOS_IDB_NAME = 'scrapbook_mail_photos_idb_v1';
const PHOTOS_IDB_STORE = 'page_photos';
const PHOTOS_IDB_RECORD_KEY = 'all_pages_photos';

function mergePhotosWithDefaults(parsed?: Partial<AllPagesPhotos> | null): AllPagesPhotos {
  if (!parsed) return DEFAULT_ALL_PAGES_PHOTOS;
  return {
    page1: { ...DEFAULT_ALL_PAGES_PHOTOS.page1, ...parsed.page1 },
    page2: { ...DEFAULT_ALL_PAGES_PHOTOS.page2, ...parsed.page2 },
    page3: { ...DEFAULT_ALL_PAGES_PHOTOS.page3, ...parsed.page3 },
    page4: { ...DEFAULT_ALL_PAGES_PHOTOS.page4, ...parsed.page4 },
    page5: { ...DEFAULT_ALL_PAGES_PHOTOS.page5, ...parsed.page5 },
    page6: { ...DEFAULT_ALL_PAGES_PHOTOS.page6, ...parsed.page6 },
    page7: { ...DEFAULT_ALL_PAGES_PHOTOS.page7, ...parsed.page7 },
    page8: { ...DEFAULT_ALL_PAGES_PHOTOS.page8, ...parsed.page8 },
    page9: { ...DEFAULT_ALL_PAGES_PHOTOS.page9, ...parsed.page9 },
  };
}

export function loadSavedPageTexts(): AllPagesTexts {
  try {
    const raw = localStorage.getItem(PAGE_TEXTS_STORAGE_KEY);
    if (!raw) return DEFAULT_ALL_PAGES_TEXTS;
    const parsed = JSON.parse(raw) as Partial<AllPagesTexts>;
    return {
      page1: { ...DEFAULT_ALL_PAGES_TEXTS.page1, ...parsed.page1 },
      page2: { ...DEFAULT_ALL_PAGES_TEXTS.page2, ...parsed.page2 },
      page3: { ...DEFAULT_ALL_PAGES_TEXTS.page3, ...parsed.page3 },
      page4: { ...DEFAULT_ALL_PAGES_TEXTS.page4, ...parsed.page4 },
      page5: { ...DEFAULT_ALL_PAGES_TEXTS.page5, ...parsed.page5 },
      page6: { ...DEFAULT_ALL_PAGES_TEXTS.page6, ...parsed.page6 },
      page7: { ...DEFAULT_ALL_PAGES_TEXTS.page7, ...parsed.page7 },
      page8: { ...DEFAULT_ALL_PAGES_TEXTS.page8, ...parsed.page8 },
      page9: { ...DEFAULT_ALL_PAGES_TEXTS.page9, ...parsed.page9 },
    };
  } catch {
    return DEFAULT_ALL_PAGES_TEXTS;
  }
}

export function savePageTexts(texts: AllPagesTexts): void {
  try {
    localStorage.setItem(PAGE_TEXTS_STORAGE_KEY, JSON.stringify(texts));
  } catch {
    // Ignore storage quota / private browsing errors
  }
}

export function loadSavedPagePhotos(): AllPagesPhotos {
  try {
    const raw = localStorage.getItem(PAGE_PHOTOS_STORAGE_KEY);
    if (!raw) return DEFAULT_ALL_PAGES_PHOTOS;
    const parsed = JSON.parse(raw) as Partial<AllPagesPhotos>;
    return mergePhotosWithDefaults(parsed);
  } catch {
    return DEFAULT_ALL_PAGES_PHOTOS;
  }
}

function openPhotosDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(PHOTOS_IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(PHOTOS_IDB_STORE)) {
        db.createObjectStore(PHOTOS_IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadSavedPagePhotosAsync(): Promise<AllPagesPhotos | null> {
  try {
    const db = await openPhotosDB();
    const record = await new Promise<Partial<AllPagesPhotos> | undefined>((resolve, reject) => {
      const tx = db.transaction(PHOTOS_IDB_STORE, 'readonly');
      const req = tx.objectStore(PHOTOS_IDB_STORE).get(PHOTOS_IDB_RECORD_KEY);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    if (record) {
      return mergePhotosWithDefaults(record);
    }
    // Migrate legacy localStorage photos if present
    const legacyRaw = localStorage.getItem(PAGE_PHOTOS_STORAGE_KEY);
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw) as Partial<AllPagesPhotos>;
      const merged = mergePhotosWithDefaults(parsed);
      await savePagePhotosAsync(merged);
      try {
        localStorage.removeItem(PAGE_PHOTOS_STORAGE_KEY);
      } catch {
        // Ignore removal errors
      }
      return merged;
    }
    return null;
  } catch {
    return null;
  }
}

export async function savePagePhotosAsync(photos: AllPagesPhotos): Promise<void> {
  try {
    const db = await openPhotosDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(PHOTOS_IDB_STORE, 'readwrite');
      tx.objectStore(PHOTOS_IDB_STORE).put(photos, PHOTOS_IDB_RECORD_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Fallback to localStorage if IndexedDB is unavailable
    try {
      localStorage.setItem(PAGE_PHOTOS_STORAGE_KEY, JSON.stringify(photos));
    } catch {
      // Ignore storage quota errors
    }
  }
}

export function savePagePhotos(photos: AllPagesPhotos): void {
  void savePagePhotosAsync(photos);
}

function readRawDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        resolve(URL.createObjectURL(file));
      }
    };
    reader.onerror = () => resolve(URL.createObjectURL(file));
    reader.readAsDataURL(file);
  });
}

/**
 * Converts an uploaded image File into an optimized Data URL (max 1400px) so it displays
 * immediately and persists across all 9 pages & reloads via IndexedDB.
 * Preserves animated GIFs, WebPs, and SVGs without rasterizing animations.
 */
export function readImageFileAsUrl(file: File): Promise<string> {
  const lowerName = file.name.toLowerCase();
  if (
    file.type === 'image/gif' ||
    file.type === 'image/webp' ||
    file.type === 'image/svg+xml' ||
    lowerName.endsWith('.gif') ||
    lowerName.endsWith('.webp') ||
    lowerName.endsWith('.svg')
  ) {
    return readRawDataUrl(file);
  }

  return new Promise((resolve) => {
    const tempObjectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const maxDim = 1400;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(tempObjectUrl);
          void readRawDataUrl(file).then(resolve);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const mime =
          file.type === 'image/png' || lowerName.endsWith('.png')
            ? 'image/png'
            : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mime, 0.88);
        URL.revokeObjectURL(tempObjectUrl);
        resolve(dataUrl);
      } catch {
        URL.revokeObjectURL(tempObjectUrl);
        void readRawDataUrl(file).then(resolve);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(tempObjectUrl);
      void readRawDataUrl(file).then(resolve);
    };
    img.src = tempObjectUrl;
  });
}
