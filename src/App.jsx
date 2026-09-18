import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Volume2,
  Star,
  Gem,
  Award,
  ChevronRight,
  Home,
  BarChart3,
  Gamepad2,
  Users,
  Stethoscope,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";

/* =========================================================================
   САНАЛЫ СӘБИ — оқу тренажері (frontend MVP)
   Деректер localStorage орнына window.storage арқылы сақталады.
   ========================================================================= */

/* ---------------------------- КОНТЕНТ ДЕРЕКТЕРІ --------------------------- */

const AVATARS = ["🦊", "🐰", "🐼", "🐱", "🦁"];

const LETTERS = [
  "А","Ә","Б","В","Г","Ғ","Д","Е","Ж","З","И","Й","К","Қ","Л","М","Н","Ң",
  "О","Ө","П","Р","С","Т","У","Ұ","Ү","Ф","Х","Һ","Ц","Ч","Ш","Щ","Ы","І","Э","Ю","Я",
];

// ұқсас әріп жұптары — дислексияға арналған ажырату жаттығуларына
const CONFUSABLE_PAIRS = [
  ["Б", "Д"],
  ["П", "Б"],
  ["Қ", "К"],
  ["М", "Н"],
  ["С", "Ш"],
];

// сөз банкі: сөз + эмодзи-сурет + буындар
const WORD_BANK = [
  { word: "АНА", emoji: "👩", syll: ["А", "НА"] },
  { word: "АТА", emoji: "👴", syll: ["А", "ТА"] },
  { word: "АПА", emoji: "👧", syll: ["А", "ПА"] },
  { word: "АҒА", emoji: "🧑", syll: ["А", "ҒА"] },
  { word: "ӘЖЕ", emoji: "👵", syll: ["Ә", "ЖЕ"] },
  { word: "ӘКЕ", emoji: "👨", syll: ["Ә", "КЕ"] },
  { word: "БАЛА", emoji: "🧒", syll: ["БА", "ЛА"] },
  { word: "ҮЙ", emoji: "🏠", syll: ["ҮЙ"] },
  { word: "НАН", emoji: "🍞", syll: ["НАН"] },
  { word: "СУ", emoji: "💧", syll: ["СУ"] },
  { word: "ДОП", emoji: "⚽", syll: ["ДОП"] },
  { word: "АТ", emoji: "🐴", syll: ["АТ"] },
  { word: "ИТ", emoji: "🐶", syll: ["ИТ"] },
  { word: "МЫСЫҚ", emoji: "🐱", syll: ["МЫ", "СЫҚ"] },
  { word: "ҚҰС", emoji: "🐦", syll: ["ҚҰС"] },
  { word: "БАЛЫҚ", emoji: "🐟", syll: ["БА", "ЛЫҚ"] },
  { word: "АЛМА", emoji: "🍎", syll: ["АЛ", "МА"] },
  { word: "АЛМҰРТ", emoji: "🍐", syll: ["АЛ", "МҰРТ"] },
  { word: "ӨРІК", emoji: "🍑", syll: ["Ө", "РІК"] },
  { word: "СҮТ", emoji: "🥛", syll: ["СҮТ"] },
  { word: "ҚАЛА", emoji: "🏙️", syll: ["ҚА", "ЛА"] },
  { word: "ДАЛА", emoji: "🌾", syll: ["ДА", "ЛА"] },
  { word: "КҮН", emoji: "☀️", syll: ["КҮН"] },
  { word: "АЙ", emoji: "🌙", syll: ["АЙ"] },
  { word: "ГҮЛ", emoji: "🌸", syll: ["ГҮЛ"] },
  { word: "АҒАШ", emoji: "🌳", syll: ["А", "ҒАШ"] },
  { word: "ЖОЛ", emoji: "🛣️", syll: ["ЖОЛ"] },
  { word: "ДОС", emoji: "🤝", syll: ["ДОС"] },
  { word: "КІТАП", emoji: "📖", syll: ["КІ", "ТАП"] },
  { word: "ҚАЛАМ", emoji: "✏️", syll: ["ҚА", "ЛАМ"] },
  { word: "ДӘПТЕР", emoji: "📓", syll: ["ДӘП", "ТЕР"] },
  { word: "МЕКТЕП", emoji: "🏫", syll: ["МЕК", "ТЕП"] },
  { word: "МҰҒАЛІМ", emoji: "🧑‍🏫", syll: ["МҰ", "ҒА", "ЛІМ"] },
  { word: "ОЙЫН", emoji: "🎲", syll: ["О", "ЙЫН"] },
  { word: "МАШИНА", emoji: "🚗", syll: ["МА", "ШИ", "НА"] },
  { word: "ҮЙРЕК", emoji: "🦆", syll: ["ҮЙ", "РЕК"] },
  { word: "ҚОЯН", emoji: "🐰", syll: ["ҚО", "ЯН"] },
  { word: "АЮ", emoji: "🐻", syll: ["А", "Ю"] },
  { word: "ПІЛ", emoji: "🐘", syll: ["ПІЛ"] },
  { word: "АРЫСТАН", emoji: "🦁", syll: ["А", "РЫС", "ТАН"] },
  { word: "ҚАСЫҚ", emoji: "🥄", syll: ["ҚА", "СЫҚ"] },
  { word: "АЯҚ", emoji: "🦶", syll: ["А", "ЯҚ"] },
  { word: "ҚОЛ", emoji: "✋", syll: ["ҚОЛ"] },
  { word: "КӨЗ", emoji: "👁️", syll: ["КӨЗ"] },
  { word: "МҰРЫН", emoji: "👃", syll: ["МҰ", "РЫН"] },
  { word: "АУЫЗ", emoji: "👄", syll: ["А", "УЫЗ"] },
  { word: "ТЕРЕЗЕ", emoji: "🪟", syll: ["ТЕ", "РЕ", "ЗЕ"] },
  { word: "ЕСІК", emoji: "🚪", syll: ["Е", "СІК"] },
  { word: "ҚАР", emoji: "❄️", syll: ["ҚАР"] },
  { word: "ЖАҢБЫР", emoji: "🌧️", syll: ["ЖАҢ", "БЫР"] },
];

const wordByLetter = (ltr) => WORD_BANK.filter((w) => w.word[0] === ltr);

const SKILLS = [
  { key: "phonemic", label: "Дыбысты ажырату", pro: "Фонематикалық сана" },
  { key: "letter_sound", label: "Әріп–дыбыс байланысы", pro: "Әріп-дыбыс байланысы" },
  { key: "syllable", label: "Буын құрау", pro: "Буындық талдау" },
  { key: "word_reading", label: "Сөз оқу", pro: "Сөзді тану" },
  { key: "fluency", label: "Оқу жылдамдығы", pro: "Оқу жеделдігі" },
  { key: "comprehension", label: "Мәтінді түсіну", pro: "Мәтінді түсіну" },
  { key: "spelling", label: "Диктант (жазу)", pro: "Фонема-графема сәйкестігі" },
];

const ERROR_TYPES = {
  order: "Әріптердің ретін сақтау",
  graphic: "Графикалық ұқсастық",
  phon: "Фонологиялық ажырату",
};

const MASCOT_LINES = {
  welcome: "Сәлем! Мен — Ақылды Түлкі 🦊. Бірге оқуды үйренеміз!",
  profileDone: (name) => `Танысқаныма қуаныштымын, ${name}!`,
  diagnosticStart: "Бұл қысқа тапсырмалар сенің оқу деңгейіңді анықтауға көмектеседі.",
  correct: [
    "Керемет! ⭐",
    "Жарайсың!",
    "Тамаша!",
    "Дәл тауып тұрсың!",
    "Сен күшейіп барасың!",
  ],
  wrong: [
    "Тағы бір рет тыңдап көрейік 😊",
    "Асықпа. Бірге орындап көрейік.",
    "Ештеңе етпейді, қайталап көрейік.",
  ],
  dashboard: (name) => `Сәлем, ${name}! 👋 Бүгін бірге 10 минут оқимыз!`,
  levelUp: "Жаңа деңгейге көтерілдің! 🎉",
};

const randomOf = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

/* ------------------------------- САҚТАУ ---------------------------------- */

const STORAGE_KEY = "sanaly-sabi:app-state";

// Әмбебап сақтау: Telegram Mini App ішінде — CloudStorage (Telegram
// аккаунтқа байланған, құрылғылар арасында синхрондалады), Claude.ai
// артефактында — window.storage, ал әдеттегі браузерде — localStorage.
function getTelegramCloudStorage() {
  try {
    const tg = window.Telegram && window.Telegram.WebApp;
    return tg && tg.CloudStorage ? tg.CloudStorage : null;
  } catch (e) {
    return null;
  }
}

async function storageGetRaw(key) {
  const cloud = getTelegramCloudStorage();
  if (cloud) {
    return new Promise((resolve) => {
      cloud.getItem(key, (err, value) => resolve(err ? null : value || null));
    });
  }
  try {
    if (window.storage) {
      const res = await window.storage.get(key, false);
      return res ? res.value : null;
    }
  } catch (e) {
    /* кілт жоқ болуы мүмкін — жалғастырамыз */
  }
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

async function storageSetRaw(key, value) {
  const cloud = getTelegramCloudStorage();
  if (cloud) {
    return new Promise((resolve) => {
      cloud.setItem(key, value, (err, ok) => resolve(!err && ok));
    });
  }
  try {
    if (window.storage) {
      await window.storage.set(key, value, false);
      return true;
    }
  } catch (e) {
    /* жалғастырамыз */
  }
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
}

async function loadState() {
  try {
    const raw = await storageGetRaw(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    /* кілт жоқ немесе қате — бастапқы күймен жалғастырамыз */
  }
  return null;
}

async function saveState(state) {
  try {
    await storageSetRaw(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Сақтау қатесі:", e);
  }
}

function freshProgress() {
  const p = {};
  SKILLS.forEach((s) => {
    p[s.key] = { score: 20, accuracy: 0, attempts: 0, correct: 0, lastPracticed: null };
  });
  return p;
}

function initialState() {
  return {
    profile: null, // { name, age, avatar, createdAt }
    diagnosticDone: false,
    progress: freshProgress(),
    rewards: { stars: 0, diamonds: 0, medals: 0 },
    errors: [], // {type, word, when}
    sessionsCompleted: 0,
    fluencyHistory: [], // {date, wordsPerMinute}
    lastFluency: null,
  };
}

/* ---------------------- НАҚТЫ ДАУЫС КІТАПХАНАСЫ (МІНДЕТТІ ЕМЕС) --------------
   Бұл жерге өз аудио файлдарыңыздың (диктормен жазылған немесе Azure/Yandex
   сияқты бұлтты TTS арқылы алдын ала синтезделген) базалық сілтемесін
   қойсаңыз, қосымша ЕҢ АЛДЫМЕН нақты дауысты іздейді және тек ол табылмаса
   ғана браузердің синтетикалық дауысына (жоғарыдағы TTS) көшеді.

   1) Файл атауы: <ӘРІП НЕМЕСЕ СӨЗ>.mp3 (әрдайым БАС ӘРІППЕН, мыс. "АЛМА.mp3"),
      ал таза ДЫБЫС файлдары үшін "__sound" жұрнағы: "М__sound.mp3".
   2) Файлдарды кез келген жария HTTPS хостингке салыңыз (GitHub raw, Firebase
      Storage, Supabase Storage, Cloudflare R2 — бәрінде тегін тариф жеткілікті).
   3) Төмендегі AUDIO_BASE_URL өрісіне сол хостингтің түбір сілтемесін жазыңыз,
      мыс: "https://raw.githubusercontent.com/USER/REPO/main/audio/"
   4) Дайын! Файл табылған сөз/әріп үшін нақты дауыс ойнайды, қалғаны үшін
      автоматты түрде TTS қалады — ештеңені бірден толық жазу міндетті емес.
------------------------------------------------------------------------- */
const AUDIO_BASE_URL = "https://raw.githubusercontent.com/zhasan1990-sys/sanaly-sabi-audio/main/";
const AUDIO_EXT = "mp3";

// CDN кэшін айналып өту үшін нұсқа белгісі. Дыбыс файлдарын GitHub-та
// қайта жүктегеннен кейін де осы санды өсірсең (мыс. "v3"), браузер мен
// GitHub-тың raw CDN-і оны ЖАҢА файл деп қабылдап, ескі кэштелген
// нұсқаны емес, дәл соңғы жүктелген mp3-ті береді.
const AUDIO_VERSION = "v3";

function realAudioUrl(text, isSound) {
  if (!AUDIO_BASE_URL) return null;
  const key = (isSound ? `${text}__sound` : text).toUpperCase();
  return `${AUDIO_BASE_URL}${encodeURIComponent(key)}.${AUDIO_EXT}?${AUDIO_VERSION}`;
}

// Ағымдағы ойналып жатқан аудионы бақылаймыз — жаңа дыбыс басталғанда
// алдыңғысын міндетті түрде тоқтатамыз (әйтпесе екі дыбыс қабаттасып,
// "дұрыс емес" естіледі, әсіресе ұзағырақ сөздерде/сөйлемдерде).
let currentAudio = null;
function stopCurrentAudio() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {
      /* елемей өтеміз */
    }
    currentAudio = null;
  }
  try {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  } catch (e) {
    /* елемей өтеміз */
  }
}

// Нақты аудио файлды ойнатып көреді; сәтсіз болса (файл жоқ/желі қатесі)
// false қайтарады да, шақырушы TTS-ке көшеді. МАҢЫЗДЫ: промис дыбыс
// АЯҚТАЛҒАНДА емес, дыбыс СӘТТІ БАСТАЛҒАН СОҢ бірден "true" болып
// шешіледі — әйтпесе ұзақ сөздер уақыт шектеуінен озып кетіп, қате
// түрде "сәтсіз" деп танылып, үстінен TTS қосылып кетуші еді.
function playRealAudio(url) {
  return new Promise((resolve) => {
    try {
      const audio = new Audio(url);
      let settled = false;
      const done = (ok) => {
        if (settled) return;
        settled = true;
        resolve(ok);
      };
      audio.addEventListener("ended", () => {
        if (currentAudio === audio) currentAudio = null;
      });
      audio.addEventListener("error", () => {
        if (currentAudio === audio) currentAudio = null;
        done(false);
      });
      currentAudio = audio;
      audio
        .play()
        .then(() => done(true))
        .catch(() => {
          if (currentAudio === audio) currentAudio = null;
          done(false);
        });
      // Тек play() уәдесі мүлде жауап бермей қалатын сирек жағдайға арналған
      // сақтық шектеу — бұл дыбыс АЯҚТАЛУЫН күтпейді, тек басталуын күтеді.
      setTimeout(() => {
        if (!settled) {
          try {
            audio.pause();
          } catch (e) {
            /* елемей өтеміз */
          }
          if (currentAudio === audio) currentAudio = null;
          done(false);
        }
      }, 3000);
    } catch (e) {
      resolve(false);
    }
  });
}

// Дауыстар кешіретілуі — Chrome/Safari дауыстарды асинхронды жүктейді,
// сондықтан оларды бір рет кэштеп, "voiceschanged" оқиғасын тыңдаймыз.
let cachedVoices = [];
function refreshVoices() {
  try {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  } catch (e) {
    cachedVoices = [];
  }
}
if (typeof window !== "undefined" && window.speechSynthesis) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

// Дауыс сапасын бағалау: желілік (Google/Microsoft/Natural) дауыстар әдетте
// құрылғыдағы "Compact/eSpeak" дауыстарынан анағұрлым табиғи әрі анық естіледі.
function scoreVoice(v) {
  let score = 0;
  const name = (v.name || "").toLowerCase();
  if (name.includes("google")) score += 5;
  if (name.includes("microsoft") || name.includes("natural") || name.includes("online")) score += 4;
  if (name.includes("female") || name.includes("әйел") || name.includes("zhen") || name.includes("woman")) score += 2;
  if (name.includes("compact") || name.includes("espeak")) score -= 4;
  if (!v.localService) score += 2; // желілік дауыстар әдетте сапалырақ
  return score;
}

function pickBestVoice(langPrefix) {
  const matches = cachedVoices.filter((v) => v.lang && v.lang.toLowerCase().startsWith(langPrefix));
  if (matches.length === 0) return null;
  return matches.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
}

// Нақты kk-KZ дауысы бар-жоғын сырттан тексеруге арналған функция (UI үшін).
function hasNativeKazakhVoice() {
  if (cachedVoices.length === 0) refreshVoices();
  return cachedVoices.some((v) => v.lang && v.lang.toLowerCase().startsWith("kk"));
}

// ЕСКЕРТУ: браузерде kk-KZ дауысы болмаса, жүйе орыс дауысына көшеді — ол
// қазақтың төл әріптерін (Ә Ғ Қ Ң Ө Ұ Ү І Һ) мүлде білмейді немесе қате
// айтады. Сондықтан оны ЕҢ ЖАҚЫН орыс дыбысына ауыстырып барып бересек,
// айтылым бұрынғыдан анағұрлым дұрысырақ шығады. Бұл — тек уақытша шара;
// нақты шешім — төменгі "REAL AUDIO" ескертуін қараңыз.
const RU_APPROX = {
  Ә: "Я", ә: "я",
  Ғ: "Г", ғ: "г",
  Қ: "К", қ: "к",
  Ң: "Н", ң: "н",
  Ө: "Ё", ө: "ё",
  Ұ: "У", ұ: "у",
  Ү: "Ю", ү: "ю",
  І: "И", і: "и",
  Һ: "Х", һ: "х",
};

function transliterateForRu(text) {
  return text
    .split("")
    .map((ch) => RU_APPROX[ch] || ch)
    .join("");
}

// Жеке дыбысты (әріп атауын емес, НАҚ ДЫБЫСЫН) шамалап жеткізу үшін —
// созылатын дыбыстарды үш рет қайталап, жарылыңқы дауыссыздарға жеңіл
// дауысты дыбыс қосамыз. Бұл трюкті нақты фоника қосымшалары да қолданады,
// себебі TTS жалғыз әріпті бергенде оның АТАУЫН оқып қоя береді ("эм"),
// ал бізге дыбысы керек ("м-м-м").
const SOUND_TEXT = {
  А: "а", Ә: "ә", Е: "е", Ы: "ы", І: "і", О: "о", Ө: "ө",
  Ұ: "ұ", Ү: "ү", Э: "э", Ю: "ю", Я: "я", И: "и", У: "у",
  М: "м-м", Н: "н-н", Ң: "ың-ың", Л: "л-л", Р: "р-р",
  С: "с-с", Ш: "ш-ш", Ж: "ж-ж", З: "з-з", Ф: "ф-ф", В: "в-в", Х: "х-х", Һ: "х-х",
  Б: "бы", П: "пы", Д: "ды", Т: "ты", Г: "гы", К: "кы", Қ: "қы", Ғ: "ғы",
  Ц: "цы", Ч: "чы", Щ: "щы", Й: "ій",
};

// rate: 1 = қалыпты жылдамдық. Балаларға арналған тапсырмаларда бастапқы
// мән баяулатылған, себебі тым тез дауыс дыбысты ажыратуды қиындатады.
// isSound=true болса — жалғыз әріптің АТАУЫ емес, ДЫБЫСЫ айтылады.
async function speak(text, { rate, isSound = false } = {}) {
  // Ең алдымен алдыңғы дыбысты (тіпті басқа экраннан қалған болса да)
  // міндетті түрде тоқтатамыз — екі дыбыс қабаттасып кетпеуі үшін.
  stopCurrentAudio();

  // 1-қадам: нақты аудио кітапханасында осы сөз/дыбыс бар ма — тексереміз.
  const url = realAudioUrl(text, isSound);
  if (url) {
    const ok = await playRealAudio(url);
    if (ok) return;
  }
  // 2-қадам: нақты аудио табылмаса — синтетикалық дауысқа (TTS) көшеміз.
  speakTTS(text, { rate, isSound });
}

function speakTTS(text, { rate, isSound = false } = {}) {
  try {
    if (!window.speechSynthesis) return;
    if (cachedVoices.length === 0) refreshVoices();

    let toSpeak = text;
    if (isSound && SOUND_TEXT[text]) toSpeak = SOUND_TEXT[text];

    window.speechSynthesis.cancel();
    const effectiveRate = rate != null ? rate : window.__sanalySabiSpeechRate || 0.78;

    const kk = pickBestVoice("kk");
    const ru = pickBestVoice("ru");
    let voice = kk;
    let lang = kk ? kk.lang : "kk-KZ";
    if (!kk && ru) {
      voice = ru;
      lang = ru.lang;
      toSpeak = transliterateForRu(toSpeak); // орыс дауысы үшін жуықтау
    }

    const u = new SpeechSynthesisUtterance(toSpeak);
    u.rate = effectiveRate;
    u.pitch = 1.05; // жеңіл жоғарырақ тон — жылырақ, балаға жайлырақ естіледі
    u.volume = 1;
    if (voice) u.voice = voice;
    u.lang = lang;
    window.speechSynthesis.speak(u);
  } catch (e) {
    /* дауыс қолжетімсіз болса — үнсіз жалғастырамыз */
  }
}

/* ------------------------------ КІШІ UI --------------------------------- */

function SoundButton({ text, label, size = "md", isSound = false }) {
  const dims = size === "lg" ? "w-16 h-16" : "w-11 h-11";
  const [playing, setPlaying] = useState(false);
  const handleClick = () => {
    setPlaying(true);
    speak(text, { isSound });
    window.clearTimeout(handleClick._t);
    handleClick._t = window.setTimeout(() => setPlaying(false), 900);
  };
  return (
    <button
      onClick={handleClick}
      aria-label={`Тыңдау: ${label || text}`}
      className={`${dims} shrink-0 rounded-full transition active:scale-90 flex items-center justify-center shadow-sm ${
        playing ? "bg-sky-300 text-white" : "bg-sky-100 hover:bg-sky-200 text-sky-700"
      }`}
    >
      <Volume2 className={size === "lg" ? "w-7 h-7" : "w-5 h-5"} />
    </button>
  );
}

// Дыбыстау жылдамдығын баланың/ата-ананың өзі таңдауы үшін ауыстырғыш.
// Мән window.__sanalySabiSpeechRate арқылы speak() функциясына беріледі.
function SpeedToggle() {
  const [slow, setSlow] = useState(() => (typeof window !== "undefined" ? window.__sanalySabiSpeechRate <= 0.65 : false));
  useEffect(() => {
    window.__sanalySabiSpeechRate = slow ? 0.62 : 0.78;
  }, [slow]);
  return (
    <button
      onClick={() => setSlow((s) => !s)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm transition ${
        slow ? "bg-teal-300 text-teal-950" : "bg-white text-stone-400"
      }`}
      aria-pressed={slow}
    >
      🐢 {slow ? "Баяу дыбыстау" : "Қалыпты"}
    </button>
  );
}

// Дауыс сапасы неге әртүрлі болатынын түсіндіретін қысқа кеңес.
function VoiceInfo() {
  const [open, setOpen] = useState(false);
  const [hasKk, setHasKk] = useState(true);
  useEffect(() => {
    setHasKk(hasNativeKazakhVoice());
    const id = setTimeout(() => setHasKk(hasNativeKazakhVoice()), 500);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="mb-4">
      <button onClick={() => setOpen((o) => !o)} className="text-xs font-bold text-stone-400 underline">
        ⓘ Дауыс неге бұлай естіледі?
      </button>
      {open && (
        <div className="mt-2 bg-white rounded-2xl p-3 text-xs text-stone-500 leading-relaxed shadow-sm">
          {AUDIO_BASE_URL && (
            <p className="mb-1 text-teal-700 font-semibold">
              Нақты дауыс кітапханасы қосылған — бар сөздер/дыбыстар нақты аудиомен ойнайды, қалғаны TTS-пен толықтырылады.
            </p>
          )}
          {hasKk ? (
            <p>Құрылғыңызда қазақша дауыс табылды, соны қолданып тұрмыз.</p>
          ) : (
            <>
              <p className="mb-1">
                Құрылғыңызда <b>қазақша дауыс (kk-KZ)</b> табылмады, сондықтан жүйе ең жақын орысша дауысқа
                көшіп, қазақтың төл әріптерін (Ә Ғ Қ Ң Ө Ұ Ү І Һ) жуықтап оқиды — сол себепті айтылым толық дұрыс
                шықпайды.
              </p>
              <p>
                Дәл дыбысталу үшін өндірістік нұсқада төл сөйлеуші дауысымен жазылған нақты аудио файлдар
                қолданылуы керек — бұл прототипте архитектура соған дайын (жоғарыдағы AUDIO_BASE_URL).
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function BigButton({ children, onClick, variant = "primary", className = "", disabled }) {
  const base =
    "w-full py-4 px-6 rounded-3xl font-bold text-lg transition active:scale-[0.98] shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:active:scale-100";
  const styles = {
    primary: "bg-amber-400 hover:bg-amber-300 text-amber-950",
    secondary: "bg-white hover:bg-orange-50 text-orange-600 border-2 border-orange-200",
    soft: "bg-teal-100 hover:bg-teal-200 text-teal-900",
  };
  return (
    <button disabled={disabled} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}

function Mascot({ text, mood = "happy", size = "md" }) {
  const px = size === "lg" ? 72 : 52;
  return (
    <div className="flex items-end gap-3">
      <div
        className="shrink-0 rounded-full bg-orange-100 flex items-center justify-center shadow-inner"
        style={{ width: px, height: px, fontSize: px * 0.6 }}
      >
        🦊
      </div>
      {text && (
        <div className="relative bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-md max-w-[240px]">
          <p className="text-sm font-semibold text-stone-700 leading-snug">{text}</p>
        </div>
      )}
    </div>
  );
}

function TopBar({ title, onBack, right }) {
  return (
    <div className="flex items-center justify-between mb-4">
      {onBack ? (
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-500 rotate-180"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      ) : (
        <div className="w-10" />
      )}
      <h1 className="font-extrabold text-stone-800 text-lg">{title}</h1>
      <div className="w-10 flex justify-end">{right}</div>
    </div>
  );
}

function ProgressBar({ value, colorClass = "bg-amber-400" }) {
  return (
    <div className="w-full h-3 rounded-full bg-stone-200 overflow-hidden">
      <div className={`h-full ${colorClass} transition-all duration-500`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

function Screen({ children }) {
  return (
    <div className="min-h-full w-full flex flex-col p-5 pb-8">{children}</div>
  );
}

/* --------------------------- ДИАГНОСТИКА СҰРАҚТАРЫ ------------------------ */

const DIAGNOSTIC_STEPS = [
  {
    skill: "phonemic",
    prompt: "М дыбысы бар сөзді тап",
    audio: "М",
    options: [
      { label: "Алма", emoji: "🍎", correct: false },
      { label: "Үй", emoji: "🏠", correct: false },
      { label: "Мысық", emoji: "🐱", correct: true },
    ],
  },
  {
    skill: "letter_sound",
    prompt: "М дыбысын тап",
    audio: "М-м-м",
    options: [
      { label: "А", correct: false },
      { label: "М", correct: true },
      { label: "О", correct: false },
      { label: "С", correct: false },
    ],
  },
  {
    skill: "syllable",
    prompt: "М + А → ?",
    audio: "МА",
    options: [
      { label: "МА", correct: true },
      { label: "МО", correct: false },
      { label: "АМ", correct: false },
    ],
    scaffold: ["М дыбысын тыңда.", "А дыбысын тыңда.", "Екеуін бірге айтып көр."],
  },
  {
    skill: "word_reading",
    prompt: "Суретке сай сөзді тап",
    emoji: "🐱",
    options: [
      { label: "МЫСЫҚ", correct: true },
      { label: "МЫСҚИ", correct: false },
      { label: "МЫСАК", correct: false },
    ],
  },
  {
    skill: "comprehension",
    prompt: "«Асан доп ойнады. Доп қызыл болды.» Доп қандай түсті?",
    options: [
      { label: "Қызыл", emoji: "🔴", correct: true },
      { label: "Көк", emoji: "🔵", correct: false },
      { label: "Жасыл", emoji: "🟢", correct: false },
    ],
  },
];

/* ------------------------------ ТАПСЫРМА ГЕНЕРАТОРЫ ------------------------ */

// Апта сайынғы сабақ тапсырмаларын ағымдағы прогреске сай құрайды
function buildLessonQueue(progress) {
  const weakest = [...SKILLS].sort((a, b) => progress[a.key].score - progress[b.key].score).slice(0, 3);
  const tasks = [];
  weakest.forEach((s) => {
    tasks.push(makeTask(s.key));
    tasks.push(makeTask(s.key));
  });
  return shuffle(tasks).slice(0, 6);
}

let taskCounter = 0;
function makeTask(skillKey) {
  taskCounter += 1;
  const id = `t${taskCounter}`;
  if (skillKey === "phonemic") {
    const letter = randomOf(LETTERS.filter((l) => wordByLetter(l).length > 0));
    const correctWord = randomOf(wordByLetter(letter));
    const distractors = shuffle(WORD_BANK.filter((w) => w.word[0] !== letter)).slice(0, 2);
    return {
      id,
      skill: "phonemic",
      type: "phoneme_pick",
      prompt: `${letter} дыбысы бар суретті тап`,
      audio: letter,
      options: shuffle([{ ...correctWord, correct: true }, ...distractors.map((d) => ({ ...d, correct: false }))]),
    };
  }
  if (skillKey === "letter_sound") {
    const target = randomOf(LETTERS.slice(0, 20));
    const distractors = shuffle(LETTERS.filter((l) => l !== target)).slice(0, 3);
    return {
      id,
      skill: "letter_sound",
      type: "letter_pick",
      prompt: `${target} әрпін тап`,
      audio: target,
      options: shuffle([target, ...distractors]).map((l) => ({ label: l, correct: l === target })),
    };
  }
  if (skillKey === "syllable") {
    const w = randomOf(WORD_BANK.filter((x) => x.syll.length >= 2));
    const correct = w.syll.join("");
    const wrong1 = w.syll.slice().reverse().join("");
    const wrong2 = w.syll[0] + w.syll[0];
    return {
      id,
      skill: "syllable",
      type: "syllable_build",
      prompt: "Буындарды қос",
      pieces: w.syll,
      audio: correct,
      options: shuffle([
        { label: correct, correct: true },
        { label: wrong1 === correct ? wrong2 : wrong1, correct: false, errorType: "order" },
        { label: w.syll[0] + "М", correct: false, errorType: "phon" },
      ]),
    };
  }
  if (skillKey === "word_reading") {
    const w = randomOf(WORD_BANK);
    const scrambled = w.word.length > 3 ? w.word.slice(1) + w.word[0] : w.word;
    const swapped =
      w.word.length > 3
        ? w.word.slice(0, -2) + w.word.slice(-1) + w.word.slice(-2, -1)
        : w.word.split("").reverse().join("");
    return {
      id,
      skill: "word_reading",
      type: "word_decode",
      prompt: "Суретке сай сөзді тап",
      emoji: w.emoji,
      audio: w.word,
      options: shuffle([
        { label: w.word, correct: true },
        { label: swapped, correct: false, errorType: "order" },
        { label: w.word.replace("Ы", "И").replace("Қ", "К"), correct: false, errorType: "graphic" },
      ]).filter((o, i, arr) => arr.findIndex((x) => x.label === o.label) === i),
    };
  }
  if (skillKey === "comprehension") {
    const bank = [
      { text: "Айша гүл жинады. Гүл сары болды.", q: "Гүл қандай түсті?", correct: "Сары", options: ["Сары", "Көк", "Қызыл"] },
      { text: "Асан кітап оқыды. Кітап қалың болды.", q: "Асан не оқыды?", correct: "Кітап", options: ["Кітап", "Дәптер", "Хат"] },
      { text: "Мысық үйде ұйықтады. Ол шаршаған еді.", q: "Мысық қайда ұйықтады?", correct: "Үйде", options: ["Үйде", "Далада", "Мектепте"] },
    ];
    const b = randomOf(bank);
    return { id, skill: "comprehension", type: "comprehension", prompt: b.q, text: b.text, options: shuffle(b.options).map((o) => ({ label: o, correct: o === b.correct })) };
  }
  if (skillKey === "spelling") {
    const w = randomOf(WORD_BANK.filter((x) => x.word.length <= 5));
    return { id, skill: "spelling", type: "dictation", prompt: "Есті де жаз", audio: w.word, answer: w.word };
  }
  // fluency / fallback
  const words = shuffle(WORD_BANK).slice(0, 10).map((w) => w.word);
  return { id, skill: "fluency", type: "fluency", prompt: "1 минутта қанша сөз оқисың?", words };
}

/* --------------------------------- ТАПСЫРМА КОМПОНЕНТТЕРІ ------------------ */

function TaskCard({ task, onAnswer, wrongStreak }) {
  const [scaffoldStep, setScaffoldStep] = useState(0);
  const showScaffold = wrongStreak >= 2 && task.type === "syllable_build";

  if (task.type === "phoneme_pick" || task.type === "word_decode") {
    return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <p className="font-bold text-stone-800 text-base flex-1">{task.prompt}</p>
          {task.audio && <SoundButton text={task.audio} isSound={task.type === "phoneme_pick"} />}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {task.options.map((o, i) => (
            <button
              key={i}
              onClick={() => onAnswer(o.correct, o)}
              className="aspect-square rounded-2xl bg-white shadow-sm border-2 border-stone-100 hover:border-amber-300 active:scale-95 transition flex flex-col items-center justify-center gap-1 p-2"
            >
              {o.emoji && <span className="text-3xl">{o.emoji}</span>}
              <span className="text-sm font-bold text-stone-700">{o.word || o.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (task.type === "letter_pick") {
    return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <p className="font-bold text-stone-800 text-base flex-1">{task.prompt}</p>
          {task.audio && <SoundButton text={task.audio} isSound />}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {task.options.map((o, i) => (
            <button
              key={i}
              onClick={() => onAnswer(o.correct, o)}
              className="aspect-square rounded-2xl bg-white shadow-sm border-2 border-stone-100 hover:border-amber-300 active:scale-95 transition flex items-center justify-center text-2xl font-extrabold text-stone-700"
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (task.type === "syllable_build") {
    return (
      <div>
        <p className="font-bold text-stone-800 text-base mb-3">{task.prompt}</p>
        <div className="flex items-center justify-center gap-3 mb-5 bg-white rounded-2xl py-4 shadow-sm">
          {task.pieces.map((p, i) => (
            <React.Fragment key={i}>
              <span className="text-2xl font-extrabold text-orange-500">{p}</span>
              {i < task.pieces.length - 1 && <span className="text-xl text-stone-400">+</span>}
            </React.Fragment>
          ))}
          <SoundButton text={task.audio} />
        </div>
        {showScaffold && (
          <div className="mb-4 bg-teal-50 rounded-2xl p-3 space-y-1">
            {task.pieces.concat(["Екеуін бірге айтып көр."]).slice(0, scaffoldStep + 1).map((s, i) => (
              <p key={i} className="text-sm text-teal-800 font-semibold">
                {i + 1}-қадам: {LETTERS.includes ? s : s}
              </p>
            ))}
            {scaffoldStep < task.pieces.length && (
              <button className="text-xs font-bold text-teal-600 underline" onClick={() => setScaffoldStep((s) => s + 1)}>
                Келесі қадам
              </button>
            )}
          </div>
        )}
        <div className="grid grid-cols-3 gap-3">
          {task.options.map((o, i) => (
            <button
              key={i}
              onClick={() => onAnswer(o.correct, o)}
              className="py-4 rounded-2xl bg-white shadow-sm border-2 border-stone-100 hover:border-amber-300 active:scale-95 transition text-lg font-extrabold text-stone-700"
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (task.type === "comprehension") {
    return (
      <div>
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 flex items-start gap-2">
          <p className="text-stone-700 font-medium leading-relaxed flex-1">{task.text}</p>
          <SoundButton text={task.text} />
        </div>
        <p className="font-bold text-stone-800 mb-3">{task.prompt}</p>
        <div className="grid grid-cols-3 gap-3">
          {task.options.map((o, i) => (
            <button
              key={i}
              onClick={() => onAnswer(o.correct, o)}
              className="py-4 rounded-2xl bg-white shadow-sm border-2 border-stone-100 hover:border-amber-300 active:scale-95 transition text-sm font-bold text-stone-700"
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (task.type === "dictation") {
    return <DictationTask task={task} onAnswer={onAnswer} />;
  }

  if (task.type === "fluency") {
    return <FluencyTask task={task} onAnswer={onAnswer} />;
  }

  return null;
}

function DictationTask({ task, onAnswer }) {
  const [typed, setTyped] = useState([]);
  const letters = "АӘБВГҒДЕЖЗИЙКҚЛМНҢОӨПРСТУҰҮФХҺЦЧШЩЫІЭЮЯ".split("");
  const target = task.answer;
  useEffect(() => {
    speak(target);
  }, [task]);
  const submit = () => {
    const attempt = typed.join("");
    onAnswer(attempt === target, { attempt });
  };
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <p className="font-bold text-stone-800 flex-1">{task.prompt}</p>
        <SoundButton text={target} />
      </div>
      <div className="min-h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center gap-2 mb-3 px-3 flex-wrap py-2">
        {typed.length === 0 && <span className="text-stone-300 text-sm">Әріптерді бас</span>}
        {typed.map((l, i) => (
          <span key={i} className="text-xl font-extrabold text-orange-500">
            {l}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-8 gap-1.5 mb-4">
        {letters.map((l) => (
          <button
            key={l}
            onClick={() => setTyped((t) => [...t, l])}
            className="aspect-square rounded-lg bg-white shadow-sm text-xs font-bold text-stone-600 hover:bg-amber-50"
          >
            {l}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setTyped((t) => t.slice(0, -1))}
          className="flex-1 py-3 rounded-2xl bg-stone-100 text-stone-600 font-bold flex items-center justify-center gap-1"
        >
          <RotateCcw className="w-4 h-4" /> Өшіру
        </button>
        <button onClick={submit} disabled={typed.length === 0} className="flex-1 py-3 rounded-2xl bg-amber-400 text-amber-950 font-bold disabled:opacity-40">
          Тексеру
        </button>
      </div>
    </div>
  );
}

function FluencyTask({ task, onAnswer }) {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [seconds, setSeconds] = useState(60);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!started) return;
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          finish();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  const finish = () => {
    onAnswer(true, { wordsRead: idx });
  };

  if (!started) {
    return (
      <div className="text-center">
        <p className="font-bold text-stone-800 mb-4">{task.prompt}</p>
        <p className="text-sm text-stone-500 mb-5">Дайын болғанда «Бастау» батырмасын бас. Сен 60 секунд ішінде сөздерді оқисың.</p>
        <BigButton onClick={() => setStarted(true)}>Бастау</BigButton>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-4 inline-block bg-white rounded-full px-4 py-1 shadow-sm font-bold text-orange-500">{seconds} сек</div>
      <div className="bg-white rounded-3xl shadow-md py-10 mb-5">
        <p className="text-4xl font-extrabold text-stone-800 tracking-wide">{task.words[idx % task.words.length]}</p>
      </div>
      <BigButton onClick={() => setIdx((i) => i + 1)}>Келесі сөз</BigButton>
      <button onClick={finish} className="mt-3 text-sm text-stone-400 underline">
        Аяқтау
      </button>
    </div>
  );
}

/* ---------------------------------- ЭКРАНДАР ------------------------------ */

function ScreenWelcome({ onStart }) {
  return (
    <Screen>
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-28 h-28 rounded-full bg-amber-100 flex items-center justify-center text-6xl shadow-inner">🦊</div>
        <div>
          <h1 className="text-3xl font-extrabold text-stone-800 tracking-tight">САНАЛЫ СӘБИ</h1>
          <p className="text-orange-500 font-bold mt-1">«Оқуды бірге үйренеміз!»</p>
        </div>
        <p className="text-stone-500 text-sm max-w-xs">{MASCOT_LINES.welcome}</p>
      </div>
      <div className="space-y-3">
        <BigButton onClick={onStart}>
          Бастау <ChevronRight className="w-5 h-5" />
        </BigButton>
        <p className="text-center text-xs text-stone-400">Қазақ тіліндегі оқу тренажері</p>
      </div>
    </Screen>
  );
}

function ScreenProfile({ onDone }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState(7);
  const [avatar, setAvatar] = useState(AVATARS[0]);
  return (
    <Screen>
      <TopBar title="Бұл кім?" />
      <div className="flex-1 space-y-6">
        <div className="flex justify-center gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => setAvatar(a)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition ${
                avatar === a ? "bg-amber-300 scale-110" : "bg-white"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
        <div>
          <label className="text-sm font-bold text-stone-600 mb-1 block">Бала аты</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Мысалы: Айша"
            className="w-full rounded-2xl border-2 border-stone-200 focus:border-amber-400 outline-none px-4 py-3 text-lg font-semibold text-stone-700"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-stone-600 mb-2 block">Жасы</label>
          <div className="grid grid-cols-6 gap-2">
            {[5, 6, 7, 8, 9, 10].map((a) => (
              <button
                key={a}
                onClick={() => setAge(a)}
                className={`py-3 rounded-xl font-bold transition ${age === a ? "bg-amber-400 text-amber-950" : "bg-white text-stone-500"}`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>
      <BigButton disabled={!name.trim()} onClick={() => onDone({ name: name.trim(), age, avatar, createdAt: Date.now() })}>
        Жалғастыру
      </BigButton>
    </Screen>
  );
}

function ScreenDiagnostic({ profile, onDone }) {
  const [step, setStep] = useState(0);
  const [results, setResults] = useState([]);
  const q = DIAGNOSTIC_STEPS[step];

  const answer = (correct) => {
    const updated = [...results, { skill: q.skill, correct }];
    if (step + 1 < DIAGNOSTIC_STEPS.length) {
      setResults(updated);
      setTimeout(() => setStep((s) => s + 1), 500);
    } else {
      onDone(updated);
    }
  };

  return (
    <Screen>
      <TopBar title="Мен қазір нені білемін?" />
      <p className="text-xs font-bold text-stone-400 mb-1">
        {step + 1} / {DIAGNOSTIC_STEPS.length}
      </p>
      <ProgressBar value={((step + 1) / DIAGNOSTIC_STEPS.length) * 100} />
      <div className="flex-1 mt-6">
        <Mascot text={step === 0 ? MASCOT_LINES.diagnosticStart : q.prompt} />
        <div className="mt-6 bg-orange-50 rounded-3xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <p className="font-bold text-stone-800 flex-1">{q.prompt}</p>
            {q.audio && <SoundButton text={q.audio} isSound={q.audio.length === 1} />}
          </div>
          {q.emoji && <div className="text-6xl text-center mb-4">{q.emoji}</div>}
          <div className="grid grid-cols-3 gap-3">
            {q.options.map((o, i) => (
              <button
                key={i}
                onClick={() => answer(o.correct)}
                className="py-4 rounded-2xl bg-white shadow-sm border-2 border-transparent hover:border-amber-300 active:scale-95 transition flex flex-col items-center gap-1"
              >
                {o.emoji && <span className="text-2xl">{o.emoji}</span>}
                <span className="text-sm font-bold text-stone-700">{o.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  );
}

function ScreenResult({ diagResults, onContinue }) {
  const bySkill = {};
  diagResults.forEach((r) => {
    bySkill[r.skill] = bySkill[r.skill] || { correct: 0, total: 0 };
    bySkill[r.skill].total += 1;
    if (r.correct) bySkill[r.skill].correct += 1;
  });
  const rows = Object.entries(bySkill).map(([key, v]) => ({
    key,
    label: SKILLS.find((s) => s.key === key)?.label || key,
    pct: Math.round((v.correct / v.total) * 100),
  }));
  const weakest = rows.sort((a, b) => a.pct - b.pct)[0];

  return (
    <Screen>
      <TopBar title="Сенің оқу профилің" />
      <div className="flex-1 space-y-4 mt-2">
        {rows.map((r) => (
          <div key={r.key}>
            <div className="flex justify-between text-sm font-bold text-stone-600 mb-1">
              <span>{r.label}</span>
              <span>{r.pct}%</span>
            </div>
            <ProgressBar value={r.pct} colorClass="bg-teal-400" />
          </div>
        ))}
        {weakest && (
          <div className="bg-amber-50 rounded-2xl p-4 mt-4 flex gap-3 items-start">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-stone-600 font-medium">
              Саған <b>{weakest.label.toLowerCase()}</b> дағдысын көбірек жаттықтыру керек.
            </p>
          </div>
        )}
      </div>
      <BigButton onClick={onContinue}>Жаттығуды бастау</BigButton>
    </Screen>
  );
}

function ScreenDashboard({ profile, progress, rewards, onNav }) {
  const overall = Math.round(SKILLS.reduce((a, s) => a + progress[s.key].score, 0) / SKILLS.length);
  return (
    <Screen>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">{profile.avatar}</div>
        <div className="flex-1">
          <p className="font-extrabold text-stone-800">Сәлем, {profile.name}! 👋</p>
          <p className="text-xs text-stone-400">{MASCOT_LINES.dashboard(profile.name)}</p>
        </div>
        <SpeedToggle />
      </div>
      <VoiceInfo />

      <div className="bg-gradient-to-br from-amber-300 to-orange-300 rounded-3xl p-5 my-4 text-amber-950 shadow-md">
        <p className="font-bold text-sm mb-2">🧠 Оқу деңгейі</p>
        <ProgressBar value={overall} colorClass="bg-white/80" />
        <p className="text-xs font-bold mt-2">Сен {overall}% орындадың!</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-white rounded-2xl py-3 flex flex-col items-center shadow-sm">
          <Star className="w-5 h-5 text-amber-400" />
          <span className="font-extrabold text-stone-700">{rewards.stars}</span>
        </div>
        <div className="bg-white rounded-2xl py-3 flex flex-col items-center shadow-sm">
          <Gem className="w-5 h-5 text-sky-400" />
          <span className="font-extrabold text-stone-700">{rewards.diamonds}</span>
        </div>
        <div className="bg-white rounded-2xl py-3 flex flex-col items-center shadow-sm">
          <Award className="w-5 h-5 text-rose-400" />
          <span className="font-extrabold text-stone-700">{rewards.medals}</span>
        </div>
      </div>

      <p className="font-bold text-stone-700 mb-2 text-sm">Бүгінгі оқу — 10 минут</p>
      <BigButton onClick={() => onNav("lesson")} className="mb-3">
        Сабақты бастау <ChevronRight className="w-5 h-5" />
      </BigButton>
      <div className="grid grid-cols-2 gap-3">
        <BigButton variant="soft" onClick={() => onNav("game")}>
          <Gamepad2 className="w-5 h-5" /> Ойын
        </BigButton>
        <BigButton variant="secondary" onClick={() => onNav("progress")}>
          <BarChart3 className="w-5 h-5" /> Прогресс
        </BigButton>
      </div>

      <div className="flex-1" />
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button onClick={() => onNav("parent")} className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-stone-100 text-stone-500 font-bold text-sm">
          <Users className="w-4 h-4" /> Ата-ана
        </button>
        <button onClick={() => onNav("specialist")} className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-stone-100 text-stone-500 font-bold text-sm">
          <Stethoscope className="w-4 h-4" /> Маман
        </button>
      </div>
    </Screen>
  );
}

function ScreenLesson({ progress, onFinish, onBack }) {
  const queueRef = useRef(null);
  if (!queueRef.current) queueRef.current = buildLessonQueue(progress);
  const queue = queueRef.current;

  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null); // {ok, msg}
  const [wrongStreak, setWrongStreak] = useState(0);
  const [sessionResults, setSessionResults] = useState([]);

  const task = queue[idx];

  const handleAnswer = (correct, meta) => {
    let errorType = null;
    if (!correct && meta && meta.errorType) errorType = meta.errorType;
    if (!correct && task.type === "dictation" && meta && meta.attempt) {
      const target = task.answer;
      if (meta.attempt.length === target.length && [...meta.attempt].sort().join("") === [...target].sort().join(""))
        errorType = "order";
      else errorType = "phon";
    }

    setSessionResults((r) => [...r, { skill: task.skill, correct, errorType, task }]);
    setFeedback({ ok: correct, msg: correct ? randomOf(MASCOT_LINES.correct) : randomOf(MASCOT_LINES.wrong) });
    setWrongStreak((w) => (correct ? 0 : w + 1));

    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 < queue.length) {
        setIdx((i) => i + 1);
        setWrongStreak(0);
      } else {
        onFinish(sessionResultsWith(correct, task, errorType, sessionResults));
      }
    }, 1100);
  };

  function sessionResultsWith(correct, task, errorType, prev) {
    return [...prev, { skill: task.skill, correct, errorType, task }];
  }

  if (!task) return null;

  return (
    <Screen>
      <TopBar title="Сабақ" onBack={onBack} right={<span className="text-xs font-bold text-stone-400">{idx + 1}/{queue.length}</span>} />
      <ProgressBar value={((idx) / queue.length) * 100} />
      <div className="flex-1 mt-6 relative">
        <TaskCard key={task.id} task={task} onAnswer={handleAnswer} wrongStreak={wrongStreak} />
        {feedback && (
          <div
            className={`absolute inset-x-0 -bottom-2 rounded-2xl p-4 text-center font-bold shadow-lg ${
              feedback.ok ? "bg-teal-100 text-teal-800" : "bg-orange-100 text-orange-800"
            }`}
          >
            {feedback.msg}
          </div>
        )}
      </div>
    </Screen>
  );
}

function ScreenGame({ rewards, onBack }) {
  return (
    <Screen>
      <TopBar title="Сөз қазынасы" onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-5">
        <div className="text-7xl">🦊</div>
        <p className="font-extrabold text-stone-800">Бүгін {rewards.stars} жұлдыз жинадың!</p>
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-1">
            <Star className="w-8 h-8 text-amber-400" />
            <span className="font-bold text-stone-600">{rewards.stars}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Gem className="w-8 h-8 text-sky-400" />
            <span className="font-bold text-stone-600">{rewards.diamonds}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Award className="w-8 h-8 text-rose-400" />
            <span className="font-bold text-stone-600">{rewards.medals}</span>
          </div>
        </div>
        <p className="text-sm text-stone-400 max-w-xs">Сабақтарды жалғастырсаң, жаңа деңгей мен аватар ашыласың!</p>
      </div>
    </Screen>
  );
}

function ScreenProgress({ progress, fluencyHistory, onBack }) {
  return (
    <Screen>
      <TopBar title="Менің прогресім" onBack={onBack} />
      <div className="flex-1 space-y-4 mt-2">
        {SKILLS.map((s) => (
          <div key={s.key}>
            <div className="flex justify-between text-sm font-bold text-stone-600 mb-1">
              <span>{s.label}</span>
              <span>{progress[s.key].score}%</span>
            </div>
            <ProgressBar value={progress[s.key].score} colorClass="bg-amber-400" />
          </div>
        ))}
        {fluencyHistory.length > 0 && (
          <div className="bg-sky-50 rounded-2xl p-4 mt-4">
            <p className="text-sm font-bold text-sky-800 mb-1">Оқу жылдамдығы</p>
            <p className="text-2xl font-extrabold text-sky-900">
              {fluencyHistory[fluencyHistory.length - 1].wordsPerMinute} сөз/мин
            </p>
          </div>
        )}
      </div>
    </Screen>
  );
}

function ScreenParent({ profile, progress, errors, sessionsCompleted, fluencyHistory, onBack, onNav }) {
  const weakest = [...SKILLS].sort((a, b) => progress[a.key].score - progress[b.key].score)[0];
  return (
    <Screen>
      <TopBar title={`${profile.name} — оқу прогресі`} onBack={onBack} />
      <div className="flex-1 space-y-5 mt-2 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-3 shadow-sm text-center">
            <p className="text-xs text-stone-400 font-bold">Сабақ саны</p>
            <p className="text-xl font-extrabold text-stone-700">{sessionsCompleted} / 7</p>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-sm text-center">
            <p className="text-xs text-stone-400 font-bold">Оқу уақыты</p>
            <p className="text-xl font-extrabold text-stone-700">{sessionsCompleted * 8} мин</p>
          </div>
        </div>

        <div className="space-y-3">
          {SKILLS.map((s) => (
            <div key={s.key}>
              <div className="flex justify-between text-sm font-bold text-stone-600 mb-1">
                <span>{s.pro}</span>
                <span>{progress[s.key].score}%</span>
              </div>
              <ProgressBar value={progress[s.key].score} colorClass="bg-teal-400" />
            </div>
          ))}
        </div>

        {weakest && (
          <div className="bg-orange-50 rounded-2xl p-4">
            <p className="text-sm font-bold text-orange-800 mb-1">Жүйе ұсынысы</p>
            <p className="text-sm text-stone-600">
              {profile.name} «{weakest.pro.toLowerCase()}» дағдысында әлі қиналады.
            </p>
            <p className="text-xs text-stone-500 mt-2">Келесі 7 күнде: {weakest.pro} — 5 минут/күн ұсынылады.</p>
          </div>
        )}

        {errors.length > 0 && (
          <div>
            <p className="text-sm font-bold text-stone-700 mb-2">Соңғы қателер</p>
            <div className="space-y-1.5">
              {errors.slice(-5).reverse().map((e, i) => (
                <div key={i} className="bg-white rounded-xl px-3 py-2 flex justify-between items-center shadow-sm">
                  <span className="text-sm font-bold text-stone-600">{e.word}</span>
                  <span className="text-xs text-rose-500 font-semibold">{ERROR_TYPES[e.type]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-amber-50 rounded-2xl p-4 text-center">
          <p className="text-sm font-bold text-stone-700 mb-3">
            Балаңыздың оқу дағдыларын маманмен бірге тереңірек бағалағыңыз келе ме?
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => onNav("specialist")} className="py-3 rounded-2xl bg-white text-orange-600 font-bold text-sm shadow-sm">
              Маман кеңесі
            </button>
            <button className="py-3 rounded-2xl bg-amber-400 text-amber-950 font-bold text-sm shadow-sm">Диагностикаға жазылу</button>
          </div>
        </div>
      </div>
    </Screen>
  );
}

function ScreenSpecialist({ profile, progress, onBack }) {
  const [plan, setPlan] = useState(null);
  const strengths = SKILLS.filter((s) => progress[s.key].score >= 65);
  const weaknesses = SKILLS.filter((s) => progress[s.key].score < 65);

  const genPlan = () => {
    const focus = weaknesses.length ? weaknesses : SKILLS;
    const days = Array.from({ length: 14 }, (_, i) => ({
      day: i + 1,
      skill: focus[i % focus.length].label,
    }));
    setPlan(days);
  };

  return (
    <Screen>
      <TopBar title="Маман кабинеті" onBack={onBack} />
      <div className="flex-1 space-y-5 mt-2 overflow-y-auto">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="font-extrabold text-stone-800">
            {profile.name.toUpperCase()} · {profile.age} жас
          </p>
        </div>

        <div>
          <p className="text-sm font-bold text-teal-700 mb-2">Күшті жақтары</p>
          <div className="space-y-1.5">
            {strengths.length === 0 && <p className="text-xs text-stone-400">Әзірге анықталмаған</p>}
            {strengths.map((s) => (
              <div key={s.key} className="flex items-center gap-2 bg-teal-50 rounded-xl px-3 py-2">
                <span>🟢</span>
                <span className="text-sm font-bold text-stone-700">{s.pro}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-rose-600 mb-2">Дамытуды қажет етеді</p>
          <div className="space-y-1.5">
            {weaknesses.map((s) => (
              <div key={s.key} className="flex items-center gap-2 bg-rose-50 rounded-xl px-3 py-2">
                <span>🔴</span>
                <span className="text-sm font-bold text-stone-700">{s.pro}</span>
              </div>
            ))}
          </div>
        </div>

        {!plan ? (
          <BigButton onClick={genPlan}>Жеке бағдарлама жасау</BigButton>
        ) : (
          <div>
            <p className="text-sm font-bold text-stone-700 mb-2">14 күндік бағдарлама</p>
            <div className="grid grid-cols-2 gap-2">
              {plan.map((d) => (
                <div key={d.day} className="bg-white rounded-xl px-3 py-2 shadow-sm">
                  <p className="text-xs font-bold text-stone-400">{d.day}-күн</p>
                  <p className="text-sm font-bold text-stone-700">{d.skill}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Screen>
  );
}

/* --------------------------------- НЕГІЗГІ ҚОСЫМША ------------------------- */

export default function App() {
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState("welcome");
  const [state, setState] = useState(initialState());
  const [diagResults, setDiagResults] = useState([]);

  // Telegram Mini App ретінде ашылса — Telegram-ның WebApp SDK-сын
  // іске қосамыз: толық экранға жаю, жоғарыдан төмен сырғытып жабу
  // қаупін болдырмау, тақырыпты (theme) сәйкестендіру.
  useEffect(() => {
    try {
      const tg = window.Telegram && window.Telegram.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();
        if (tg.setHeaderColor) tg.setHeaderColor("#fff7ed"); // orange-50-ге сай
      }
    } catch (e) {
      /* Telegram сыртында ашылса — үнсіз елемей өтеміз */
    }
  }, []);

  // Экран ауысқан сайын алдыңғы дыбысты міндетті түрде тоқтатамыз —
  // әйтпесе алдыңғы бетте басталған дыбыс жаңа бетте де ойнай беруі мүмкін.
  useEffect(() => {
    stopCurrentAudio();
  }, [screen]);

  useEffect(() => {
    (async () => {
      const loaded = await loadState();
      if (loaded && loaded.profile) {
        setState(loaded);
        setScreen(loaded.diagnosticDone ? "dashboard" : "diagnostic");
      }
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (ready) saveState(state);
  }, [state, ready]);

  const handleProfileDone = (profile) => {
    setState((s) => ({ ...s, profile }));
    setScreen("diagnostic");
  };

  const handleDiagnosticDone = (results) => {
    setDiagResults(results);
    setState((s) => {
      const progress = { ...s.progress };
      const bySkill = {};
      results.forEach((r) => {
        bySkill[r.skill] = bySkill[r.skill] || { c: 0, t: 0 };
        bySkill[r.skill].t += 1;
        if (r.correct) bySkill[r.skill].c += 1;
      });
      Object.entries(bySkill).forEach(([key, v]) => {
        if (progress[key]) progress[key] = { ...progress[key], score: Math.round((v.c / v.t) * 100) };
      });
      return { ...s, progress, diagnosticDone: true };
    });
    setScreen("result");
  };

  const applyLessonResults = (results) => {
    setState((s) => {
      const progress = { ...s.progress };
      let newStars = s.rewards.stars;
      let newErrors = [...s.errors];
      results.forEach((r) => {
        const cur = progress[r.skill];
        const attempts = cur.attempts + 1;
        const correct = cur.correct + (r.correct ? 1 : 0);
        const delta = r.correct ? 4 : -1;
        const score = Math.min(100, Math.max(5, cur.score + delta));
        progress[r.skill] = { ...cur, attempts, correct, score, accuracy: Math.round((correct / attempts) * 100), lastPracticed: Date.now() };
        if (r.correct) newStars += 1;
        if (!r.correct && r.errorType) {
          const wordLabel = r.task.audio || r.task.answer || (r.task.pieces ? r.task.pieces.join("") : "");
          newErrors.push({ type: r.errorType, word: wordLabel, when: Date.now() });
        }
      });
      const diamonds = s.rewards.diamonds + (results.filter((r) => r.correct).length >= 5 ? 1 : 0);
      const medals = s.rewards.medals + (s.sessionsCompleted > 0 && (s.sessionsCompleted + 1) % 5 === 0 ? 1 : 0);
      return {
        ...s,
        progress,
        rewards: { stars: newStars, diamonds, medals },
        errors: newErrors.slice(-30),
        sessionsCompleted: s.sessionsCompleted + 1,
      };
    });
    setScreen("dashboard");
  };

  if (!ready) {
    return (
      <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-amber-50">
        <span className="text-4xl animate-bounce">🦊</span>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-[640px] max-w-sm mx-auto bg-orange-50 rounded-[2rem] overflow-hidden shadow-xl flex flex-col"
      style={{ fontFamily: "'Baloo 2','Nunito',system-ui,sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Nunito:wght@500;700;800&display=swap');
      `}</style>

      {screen === "welcome" && <ScreenWelcome onStart={() => setScreen(state.profile ? "dashboard" : "profile")} />}

      {screen === "profile" && <ScreenProfile onDone={handleProfileDone} />}

      {screen === "diagnostic" && state.profile && <ScreenDiagnostic profile={state.profile} onDone={handleDiagnosticDone} />}

      {screen === "result" && <ScreenResult diagResults={diagResults} onContinue={() => setScreen("dashboard")} />}

      {screen === "dashboard" && state.profile && (
        <ScreenDashboard profile={state.profile} progress={state.progress} rewards={state.rewards} onNav={setScreen} />
      )}

      {screen === "lesson" && (
        <ScreenLesson progress={state.progress} onFinish={applyLessonResults} onBack={() => setScreen("dashboard")} />
      )}

      {screen === "game" && <ScreenGame rewards={state.rewards} onBack={() => setScreen("dashboard")} />}

      {screen === "progress" && (
        <ScreenProgress progress={state.progress} fluencyHistory={state.fluencyHistory} onBack={() => setScreen("dashboard")} />
      )}

      {screen === "parent" && state.profile && (
        <ScreenParent
          profile={state.profile}
          progress={state.progress}
          errors={state.errors}
          sessionsCompleted={state.sessionsCompleted}
          fluencyHistory={state.fluencyHistory}
          onBack={() => setScreen("dashboard")}
          onNav={setScreen}
        />
      )}

      {screen === "specialist" && state.profile && (
        <ScreenSpecialist profile={state.profile} progress={state.progress} onBack={() => setScreen("dashboard")} />
      )}
    </div>
  );
}
