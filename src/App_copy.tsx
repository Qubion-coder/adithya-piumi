import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Calendar, Clock, Send, ChevronDown } from "lucide-react";
import { IntroVideo } from "./components/IntroVideo";

const INVITATION = {
  couple: {
    bride: "ජනිත",
    groom: "ජිලක්ෂි",
    brideFull: "ජනිත",
    groomFull: "ජිලක්ෂි",
  },
  date: {
    displayNumeric: "04 . 09 . 2026",
    displayLong: "September 4, 2026",
    countdownTarget: "2026-09-04T10:00:00+05:30",
  },
  time: {
    ceremonyStart: "ප.ව. 04:00",
    ceremonyEnd: "ප.ව. 10:00",
    registration: "පෙ.ව. 10:45",
    welcome: "දහවල් 12:30",
  },
  venue: {
    name: "Vihaga reception hall",
    city: "",
    mapQuery: "Vihaga reception hall",
    googleMapsLink: "https://maps.app.goo.gl/Ni6VajQYDf1uvteYA?g_st=iw",
  },
  rsvpContacts: ["ජනිත: 071-XXXXXXX", "ජිලක්ෂි: 071-XXXXXXX", "පවුල: 071-XXXXXXX"],
} as const;

const backgroundMusic = "/Brooklyn Duo - A Thousand Years [WEDDING VERSION].mp3";
const googleScriptUrl =
  "https://script.google.com/macros/s/AKfycbzOO0aaem2gP9B8fb0poTE0ebuQWgfrpsV-WfkFPYDHOE0JeSZDNxoq8uNHeQ8R4uy21A/exec";

const HERO_BACKGROUND_IMAGE = "/ChatGPT Image May 22, 2026, 12_24_57 AM.png";
const DETAILS_BACKGROUND_IMAGE = "/ChatGPT Image May 22, 2026, 12_26_02 AM.png";
const TIMELINE_BACKGROUND_IMAGE = "/ChatGPT Image May 22, 2026, 12_28_21 AM.png";
const WISHES_BACKGROUND_IMAGE = "/ChatGPT Image May 14, 2026, 03_54_56 PM.png";

function FloatingPetals() {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [petals, setPetals] = useState<
    Array<{
      id: number;
      x: number;
      size: number;
      rotation: number;
      duration: number;
      delay: number;
      color: string;
      drift: number;
    }>
  >([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    setIsLowPowerMode(reduceMotion || isMobile);

    if (reduceMotion) {
      setPetals([]);
      return;
    }

    const colors = ["#38bdf8", "#0369a1", "#082f49", "#075985", "#bae6fd"];
    const petalCount = isMobile ? 10 : 18;

    const newPetals = Array.from({ length: petalCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 7 + 7,
      rotation: Math.random() * 360,
      duration: Math.random() * 11 + 16,
      delay: Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: Math.random() * 24 - 12,
    }));

    setPetals(newPetals);
  }, []);

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden z-40 ${isLowPowerMode ? "opacity-70" : ""}`}>
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute drop-shadow-[0_2px_10px_rgba(195,14,89,0.3)]"
          style={{ color: petal.color }}
          initial={{
            x: `${petal.x}vw`,
            y: "-10vh",
            rotate: petal.rotation,
            opacity: 0,
          }}
          animate={{
            y: "110vh",
            x: `${petal.x + petal.drift}vw`,
            rotate: petal.rotation + (isLowPowerMode ? 360 : 720),
            opacity: [0, 0.9, 0.8, 0],
          }}
          transition={{
            duration: isLowPowerMode ? petal.duration * 1.2 : petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
        >
          <svg width={petal.size} height={petal.size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2C12,2 10,6 10,10C10,14 12,22 12,22C12,22 14,14 14,10C14,6 12,2 12,2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function CountdownTimer({ isDark = false }: { isDark?: boolean }) {
  const targetDate = new Date(INVITATION.date.countdownTarget).getTime();
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate - Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const stats = [
    { label: "දින", value: days },
    { label: "පැය", value: hours },
    { label: "මිනිත්තු", value: minutes },
    { label: "තත්පර", value: seconds },
  ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-8 justify-center w-full max-w-4xl mx-auto mt-8 md:mt-16 z-20 px-2">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, type: "spring", stiffness: 80 }}
          className="relative group"
        >
          <div
            className={`relative w-[4.5rem] h-[6.5rem] sm:w-20 sm:h-28 md:w-32 md:h-44 rounded-t-full shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15)] border flex flex-col items-center justify-center overflow-hidden transition-all duration-700 group-hover:-translate-y-3 ${isDark ? "bg-[#082f49] border-white/20" : "bg-white border-sky-100/60"
              }`}
          >
            <div
              className={`absolute inset-1.5 sm:inset-2 md:inset-3 border-[0.5px] rounded-t-full pointer-events-none ${isDark ? "border-white/30" : "border-theme-300/50"
                }`}
            />

            <span
              className={`font-numeric text-2xl sm:text-3xl md:text-5xl leading-none relative z-10 drop-shadow-sm mt-3 sm:mt-4 md:mt-6 transition-transform duration-500 group-hover:scale-110 ${isDark ? "text-white" : "text-[#082f49]"
                }`}
            >
              {Math.max(0, stat.value).toString().padStart(2, "0")}
            </span>

            <div className="w-full flex justify-center mt-2 sm:mt-3 md:mt-6 mb-1 sm:mb-2 relative z-10">
              <span
                className={`text-[5px] sm:text-[6px] md:text-[8px] tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border shadow-sm whitespace-nowrap ${isDark
                  ? "bg-white/10 text-white border-white/20"
                  : "bg-stone-50 text-stone-500 border-sky-100/50"
                  }`}
              >
                {stat.label}
              </span>
            </div>

            <div
              className={`absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 w-[3px] h-[3px] sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 rotate-45 ${isDark ? "bg-white/40" : "bg-[#38bdf8]"
                }`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}


export default function WeddingInvitation() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAttemptedAutoplay, setHasAttemptedAutoplay] = useState(false);

  // URL Parsing logic for personalized invites
  const path = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();
  const decodedPath = decodeURIComponent(path);
  const nameMap: Record<string, string> = {
    sanjaya: "සංජය",
  };
  const initialGuestName = decodedPath ? (nameMap[decodedPath] || decodedPath) : "";
  const [guestName] = useState(initialGuestName);

  const [rsvpForm, setRsvpForm] = useState({
    name: guestName,
    guests: "1",
  });

  const [wishForm, setWishForm] = useState({
    name: guestName,
    message: "",
  });

  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [wishStatus, setWishStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const audioRef = React.useRef<HTMLAudioElement>(null);

  const submitToGoogleSheet = async (payload: Record<string, string>) => {
    if (!googleScriptUrl) {
      throw new Error("Google Script URL tl ilid ke;");
    }

    try {
      await fetch(googleScriptUrl, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams(payload),
      });
      // In no-cors mode, the response is opaque, so we can't check response.ok
      // We assume success if the fetch didn't throw a network error
    } catch (e) {
      throw new Error("b,a,Su id¾:l fkdùh");
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!rsvpForm.name.trim()) {
      setRsvpStatus("error");
      return;
    }

    setRsvpStatus("sending");

    try {
      await submitToGoogleSheet({
        action: "rsvp",
        name: rsvpForm.name.trim(),
        guests: rsvpForm.guests,
      });

      setRsvpStatus("success");
      setRsvpForm({ name: "", guests: "1" });
    } catch {
      setRsvpStatus("error");
    }
  };

  const handleWishSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!wishForm.name.trim() || !wishForm.message.trim()) {
      setWishStatus("error");
      return;
    }

    setWishStatus("sending");

    try {
      await submitToGoogleSheet({
        action: "wish",
        name: wishForm.name.trim(),
        message: wishForm.message.trim(),
      });

      setWishStatus("success");
      setWishForm({ name: "", message: "" });
    } catch {
      setWishStatus("error");
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isOpened && !isPlaying && !hasAttemptedAutoplay && audioRef.current) {
      setHasAttemptedAutoplay(true);

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          const playOnInteraction = () => {
            if (audioRef.current && !isPlaying) {
              audioRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  window.removeEventListener("click", playOnInteraction);
                })
                .catch(() => { });
            }
          };

          window.addEventListener("click", playOnInteraction);
        });
    }
  }, [isOpened, isPlaying, hasAttemptedAutoplay]);

  return (
    <main
      className={`dl-manel-bold h-[100dvh] w-full bg-white transition-all duration-1000 ${isOpened ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden flex items-center justify-center"
        } relative scroll-smooth`}
    >
      <FloatingPetals />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="video-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2 } }}
            className="fixed inset-0 z-[100] bg-white flex items-center justify-center overflow-hidden"
          >
            {!hasStarted ? (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center z-[120] bg-cover bg-center"
                style={{ backgroundImage: 'url("/pre/CI1A8263.jpg")' }}
              >
                <div className="absolute inset-0 bg-white/30" aria-hidden="true" />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-center relative z-10 w-full h-full flex flex-col items-center justify-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-8 left-0 right-0 md:relative md:top-auto md:mb-12"
                  >
                    <h2 className="text-4xl md:text-6xl text-[#082f49] mb-2 drop-shadow-sm">
                      විවාහ මංගල්‍යය
                    </h2>
                    <p className="text-xl md:text-2xl text-[#075985] tracking-[0.3em]">
                      {INVITATION.couple.bride} සහ {INVITATION.couple.groom}
                    </p>
                  </motion.div>

                  <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center justify-center md:relative md:bottom-auto">
                    <button
                      onClick={() => setHasStarted(true)}
                      className="group relative px-12 py-5 overflow-hidden rounded-full transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl"
                    >
                      <div className="absolute inset-0 bg-[#082f49] opacity-90 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <span className="relative z-10 font-bold text-white text-sm tracking-[0.35em]">
                        ආරාධනය විවෘත කරන්න
                      </span>
                    </button>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="mt-8 text-[#082f49] text-sm tracking-[0.35em] font-bold drop-shadow-sm"
                    >
                      ආරම්භ කිරීමට ක්ලික් කරන්න
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            ) : (
              <IntroVideo onComplete={() => setIsOpened(true)} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="website-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="website-shell relative z-20 w-full"
          >
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsOpened(false)}
              className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-sky-100 text-[#082f49] hover:bg-sky-50 transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className="text-[8px] tracking-widest font-bold">වසා දමන්න</div>
              </div>
            </motion.button>

            <section className="w-full relative flex items-start justify-center overflow-hidden bg-white min-h-[90vh] pt-24 md:pt-36">
              <div
                className="absolute inset-0 bg-center bg-cover scale-[1.02] transform"
                style={{ backgroundImage: `url("${encodeURI(HERO_BACKGROUND_IMAGE)}")` }}
                aria-hidden="true"
              />
              {/* Gradient overlay removed for 100% image visibility */}
              <div className="absolute inset-4 md:inset-8 border border-white/60 pointer-events-none z-10 rounded-3xl" />

              <div className="relative z-10 w-full max-w-4xl px-4 sm:px-6 flex flex-col items-center text-center">
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="relative w-full p-8 sm:p-10 md:p-16 flex flex-col items-center"
                >
                  {/* Decorative corner accents */}
                  <div className="absolute top-6 left-6 w-8 h-8 md:w-10 md:h-10 border-t-2 border-l-2 border-[#D4AF37]/50 rounded-tl-2xl" />
                  <div className="absolute bottom-6 right-6 w-8 h-8 md:w-10 md:h-10 border-b-2 border-r-2 border-[#D4AF37]/50 rounded-br-2xl" />

                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-base md:text-lg tracking-[0.8em] md:tracking-[1em] font-bold text-[#D4AF37] uppercase drop-shadow-sm mb-10 md:mb-12"
                  >
                    විවාහ ආරාධනය
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="flex flex-col items-center w-full"
                  >
                    <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#082f49] italic leading-none drop-shadow-md">
                      {INVITATION.couple.bride}
                    </h1>

                    <div className="my-8 md:my-10 flex items-center justify-center gap-4 md:gap-6 w-full">
                      <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#D4AF37]/40 flex items-center justify-center bg-white/50 text-[#D4AF37] text-lg md:text-xl font-serif italic shadow-sm">
                        සහ
                      </div>
                      <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
                    </div>

                    <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#082f49] italic leading-none drop-shadow-md">
                      {INVITATION.couple.groom}
                    </h1>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 1 }}
                    className="mt-12 md:mt-14 space-y-5 md:space-y-6 flex flex-col items-center"
                  >
                    <p className="text-sm sm:text-base md:text-lg tracking-[0.2em] sm:tracking-[0.3em] text-[#082f49]/90 font-semibold uppercase">
                      {INVITATION.date.displayLong}
                    </p>
                    <div className="h-1.5 w-1.5 bg-[#D4AF37] rounded-full rotate-45" />
                    <p className="text-sm sm:text-base tracking-[0.2em] text-[#082f49]/80 font-medium">
                      {INVITATION.time.ceremonyStart}
                    </p>

                    <p className="text-[#082f49]/80 text-xs sm:text-sm md:text-base tracking-[0.15em] font-medium leading-relaxed max-w-xl mx-auto mt-4 md:mt-6 italic px-4">
                      අපගේ ආදරණීය පවුල් සමඟ එක්ව, අපගේ ජීවිතයේ සොඳුරුතම දිනය සැමරීමට ඔබගේ ගෞරවනීය පැමිණීම ආදරයෙන් බලාපොරොත්තු වෙමු.
                    </p>

                    <a
                      href="#details"
                      className="group relative inline-flex items-center justify-center gap-3 mt-8 md:mt-10 px-8 md:px-10 py-4 border border-[#D4AF37] text-[#D4AF37] text-xs md:text-sm font-bold tracking-[0.4em] overflow-hidden transition-all duration-500 hover:text-white"
                    >
                      <div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                      <span className="relative z-10 flex items-center gap-2">
                        විස්තර බලන්න
                        <ChevronDown className="w-4 h-4 group-hover:animate-bounce" />
                      </span>
                    </a>
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 hidden md:flex"
              >
                <div className="w-px h-16 bg-gradient-to-b from-[#082f49]/20 to-transparent rounded-full overflow-hidden">
                  <motion.div
                    animate={{ y: [-64, 64] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-1/2 bg-[#D4AF37]/60"
                  />
                </div>
              </motion.div>
            </section>

            <section
              id="details"
              className="relative pt-12 md:pt-20 pb-24 md:pb-32 w-full flex flex-col items-center overflow-hidden bg-white"
            >
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url("${encodeURI(DETAILS_BACKGROUND_IMAGE)}")` }}
                aria-hidden="true"
              />
              <div className="absolute inset-4 md:inset-8 border-[1.5px] border-[#082f49]/20 pointer-events-none z-10" />
              <div className="absolute inset-5 md:inset-10 border-[0.5px] border-[#38bdf8]/10 pointer-events-none z-10" />

              <div className="max-w-[1100px] w-full flex flex-col items-center text-center relative z-20 px-6">
                {guestName && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20 w-full max-w-4xl mx-auto flex flex-col items-center bg-white/70 backdrop-blur-md border border-[#D4AF37]/40 shadow-2xl rounded-3xl p-10 md:p-16 relative"
                  >
                    <div className="absolute top-5 left-5 w-8 h-8 border-t-[1.5px] border-l-[1.5px] border-[#D4AF37]/60 rounded-tl-xl" />
                    <div className="absolute bottom-5 right-5 w-8 h-8 border-b-[1.5px] border-r-[1.5px] border-[#D4AF37]/60 rounded-br-xl" />

                    <p className="text-2xl md:text-3xl text-[#082f49] font-bold mb-8 tracking-wider">
                      ආදරණීය {guestName},
                    </p>

                    <p className="text-base md:text-xl tracking-[0.15em] md:tracking-[0.2em] font-medium leading-[2.5] md:leading-[2.5] text-[#082f49] text-center">
                      අපගේ විවාහ මංගල්‍යයට සහභාගී වන මෙන්<br />
                      <span className="text-[#082f49] font-bold text-lg md:text-2xl mt-4 block tracking-widest">
                        ආදරයෙන් ඉල්ලා සිටිමු!
                      </span>
                    </p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center mb-16 space-y-6"
                >
                  <div className="flex items-center gap-4 opacity-90">
                    <div className="h-px w-8 bg-[#082f49]" />
                    <Sparkles className="w-4 h-4 text-[#075985]" />
                    <div className="h-px w-8 bg-[#082f49]" />
                  </div>

                  <div className="text-[#082f49] space-y-4">
                    <div className="space-y-4 mb-8">
                      <p className="text-[11px] md:text-sm tracking-[0.4em] mb-2 font-bold">
                        පවුල් දෙකක් ආදරයෙන් එක්වන මොහොතක්
                      </p>

                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="text-xl md:text-2xl font-bold text-[#075985] my-1">
                          {INVITATION.couple.brideFull}
                        </span>
                        <span className="text-2xl text-[#075985] italic my-2">සමඟ</span>
                        <span className="text-xl md:text-2xl font-bold text-[#075985] my-1">
                          {INVITATION.couple.groomFull}
                        </span>
                      </div>
                    </div>

                    <p className="text-base md:text-lg tracking-[0.2em] md:tracking-[0.4em] font-medium leading-loose max-w-3xl border-t border-b border-[#082f49]/50 py-6">
                      අතිනත ගැනීමේ ප්‍රීතිය නිමිත්තෙන් පැවැත්වෙන ප්‍රිය සම්භාෂණයට සහභාගී වන මෙන්
                      <br />
                      <span className="text-[#082f49] font-bold text-base md:text-lg my-2 block">
                        ඔබට කෙරෙන ගෞරවණීය ඇරයුමයි!
                      </span>
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <h2 className="text-xl md:text-2xl text-[#075985] tracking-[0.5em] font-bold">
                    විවාහ උත්සවය
                  </h2>
                </motion.div>

                <div className="relative w-full flex flex-col items-center justify-center my-12 mb-24">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative z-20 w-full max-w-[560px] bg-white p-8 md:p-14 shadow-[0_30px_70px_-15px_rgba(45,90,39,0.1)] border border-[#0369a1]/30 flex flex-col items-center justify-center text-center"
                  >
                    <div className="absolute inset-2 border-[0.5px] border-[#075985]/30 pointer-events-none" />

                    <div className="space-y-5 mb-10">
                      <div className="flex flex-col items-center gap-2">
                        <h3 className="text-5xl md:text-7xl text-[#075985] leading-none">
                          {INVITATION.couple.bride}
                        </h3>
                      </div>
                    </div>

                    <div className="py-2 flex items-center justify-center w-full relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-[#0369a1]/50" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-6 text-4xl text-[#075985]">සමඟ</span>
                      </div>
                    </div>

                    <div className="space-y-5 mt-10">
                      <div className="flex flex-col items-center gap-2">
                        <h3 className="text-5xl md:text-7xl text-[#075985] leading-none">
                          {INVITATION.couple.groom}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 w-full text-left">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full border border-[#075985]/20 flex items-center justify-center shrink-0">
                          <Calendar className="w-4 h-4 text-[#075985]" />
                        </div>
                        <div>
                          <div className="text-base md:text-lg tracking-[0.5em] font-bold text-[#082f49]/90">
                            දිනය
                          </div>
                          <div className="text-lg md:text-xl text-[#082f49] tracking-wide font-bold">
                            {INVITATION.date.displayLong}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full border border-[#082f49]/20 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4 text-[#082f49]" />
                        </div>
                        <div>
                          <div className="text-base md:text-lg tracking-[0.5em] font-bold text-[#082f49]/90">
                            වේලාව
                          </div>
                          <div className="text-lg md:text-xl text-[#082f49] tracking-wide font-bold">
                            උත්සවය ආරම්භය {INVITATION.time.ceremonyStart}ට
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full border border-[#082f49]/20 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-[#082f49]" />
                        </div>
                        <div>
                          <div className="text-base md:text-lg tracking-[0.5em] font-bold text-[#082f49]/90">
                            ස්ථානය
                          </div>
                          <div className="text-lg md:text-xl text-[#082f49] tracking-wide font-bold">
                            {INVITATION.venue.name}, {INVITATION.venue.city}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            <section className="relative py-28 md:py-48 overflow-hidden bg-white">
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url("${encodeURI(TIMELINE_BACKGROUND_IMAGE)}")` }}
                aria-hidden="true"
              />
              <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6 mb-12"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-[#082f49] font-bold tracking-[0.6em] text-sm md:text-base opacity-90">
                      දවසේ වැඩසටහන
                    </span>
                    <div className="h-px w-16 bg-[#082f49]/30" />
                  </div>

                  <h2 className="text-5xl md:text-7xl bg-gradient-to-r from-[#075985] via-[#082f49] to-[#075985] bg-clip-text text-transparent leading-none drop-shadow-sm italic">
                    කාලසටහන
                  </h2>

                  <p className="text-[#082f49]/90 text-sm md:text-base tracking-[0.3em] font-medium max-w-2xl mx-auto pt-2 leading-loose">
                    ඔබ සමඟ බෙදා ගැනීමට බලා සිටින අපගේ විශේෂ දිනයේ සරල වැඩසටහන.
                  </p>
                </motion.div>

                <div className="mx-auto max-w-2xl w-full text-left bg-white border border-[#0369a1]/40 shadow-[0_30px_70px_-20px_rgba(45,90,39,0.1)] rounded-[2rem]">
                  <div className="p-8 md:p-12 space-y-8">
                    {[
                      ["අමුත්තන් පිළිගැනීම", "ප.ව. 03:30"],
                      ["පෝරුව චාරිත්‍රය", INVITATION.time.ceremonyStart],
                      ["සංගීතය සහ විනෝදාස්වාදය", "ප.ව. 06:00"],
                      ["රාත්‍රී භෝජනය", "ප.ව. 08:00"],
                      ["උත්සවය අවසානය", INVITATION.time.ceremonyEnd],
                    ].map(([title, time]) => (
                      <div key={title} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full border border-[#075985]/20 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4 text-[#075985]" />
                        </div>
                        <div>
                          <div className="text-sm md:text-base tracking-widest font-bold text-[#082f49]/90">
                            {title}
                          </div>
                          <div className="text-base md:text-xl text-[#082f49] tracking-widest font-bold mt-1">
                            {time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="relative py-28 md:py-48 flex flex-col items-center overflow-hidden bg-[#082f49]">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="absolute -top-24 -right-24 w-96 h-96 bg-white blur-[100px] rounded-full pointer-events-none"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                className="absolute -bottom-24 -left-24 w-96 h-96 bg-white blur-[100px] rounded-full pointer-events-none"
              />

              <div className="w-full max-w-[1200px] px-6 flex flex-col items-center text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="relative mb-20"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] md:text-[220px] text-white/5 whitespace-nowrap pointer-events-none select-none tracking-wider">
                    සදාකාලික
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "80px" }}
                      viewport={{ once: true }}
                      className="h-px bg-white/40 mb-8"
                    />

                    <h2 className="text-3xl md:text-6xl text-white tracking-[0.25em] md:tracking-[0.4em] font-bold leading-tight">
                      මෙම දිනය <span className="mx-2 md:mx-4 text-[#bae6fd]">සුරකින්න</span>
                    </h2>

                    <div className="mt-10 flex items-center justify-center gap-6">
                      <div className="h-[0.5px] w-8 md:w-16 bg-[#bae6fd]/50" />
                      <span className="font-numeric text-3xl md:text-5xl text-[#bae6fd] drop-shadow-md">
                        {INVITATION.date.displayNumeric}
                      </span>
                      <div className="h-[0.5px] w-8 md:w-16 bg-[#bae6fd]/50" />
                    </div>
                  </div>
                </motion.div>

                <CountdownTimer isDark />

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.8 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="mt-20 flex flex-col items-center gap-4"
                >
                  <p className="text-sm md:text-base tracking-[0.6em] text-white font-bold text-center">
                    ආදරයෙන් පිරුණු මොහොතකට රැඳී සිටින්න
                  </p>

                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                        className="w-1 h-1 bg-[#bae6fd] rotate-45"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            <section className="relative py-28 md:py-48 overflow-hidden bg-white">
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url("${encodeURI(DETAILS_BACKGROUND_IMAGE)}")` }}
                aria-hidden="true"
              />
              <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-10 mb-24"
                >
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-[#082f49] font-bold tracking-[0.8em] text-sm md:text-base opacity-90">
                      උත්සව ස්ථානය
                    </span>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rotate-45 ${i === 2 ? "bg-[#075985]" : "bg-[#082f49]/20"}`}
                        />
                      ))}
                    </div>
                  </div>

                  <h2 className="text-5xl md:text-9xl bg-gradient-to-br from-[#075985] to-[#082f49] bg-clip-text text-transparent leading-tight font-light tracking-tight relative">
                    {INVITATION.venue.name}
                  </h2>

                  <div className="max-w-xl mx-auto pt-10 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-[#0369a1]" />
                    <p className="text-[#082f49]/80 text-sm md:text-base tracking-[0.2em] font-medium leading-loose pt-8">
                      සම්ප්‍රදාය, අලංකාරය සහ නව ඇරඹුමක සුන්දරත්වය එක්වන තැන
                    </p>
                  </div>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                  <div className="lg:col-span-5 text-left order-2 lg:order-1">
                    <motion.div
                      initial={{ opacity: 0, x: -40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      className="bg-white p-10 md:p-16 shadow-[0_60px_100px_-40px_rgba(45,90,39,0.1)] border border-[#0369a1]/30 relative group"
                    >
                      <div className="absolute inset-2 border-[0.5px] border-[#075985]/20 pointer-events-none group-hover:border-[#075985]/40 transition-colors duration-700" />

                      <div className="space-y-12 relative z-10">
                        <div className="space-y-6">
                          <p className="text-[#082f49] text-xl md:text-2xl font-light italic leading-relaxed text-center lg:text-left">
                            “අපගේ ආදර කතාවේ අලංකාරම පරිච්ඡේදය ඔබ සමඟ සැමරීමට අප සතුටින් බලා සිටිමු.”
                          </p>
                          <div className="h-0.5 w-12 bg-[#0369a1]/60 mx-auto lg:ml-0" />
                        </div>

                        <div className="space-y-10">
                          <div className="flex items-start gap-8">
                            <div className="w-12 h-12 rounded-full border border-[#075985]/20 flex items-center justify-center shrink-0">
                              <MapPin className="w-5 h-5 text-[#075985]" />
                            </div>
                            <div className="space-y-3">
                              <h4 className="text-[#082f49]/90 font-bold text-sm tracking-[0.5em]">
                                ගමනාන්තය
                              </h4>
                              <p className="text-xl md:text-2xl text-[#082f49] leading-relaxed tracking-wide font-bold">
                                {INVITATION.venue.name}, {INVITATION.venue.city}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-8">
                            <div className="w-12 h-12 rounded-full border border-[#075985]/20 flex items-center justify-center shrink-0">
                              <Clock className="w-5 h-5 text-[#075985]" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-[#082f49]/90 font-bold text-sm tracking-[0.5em]">
                                පෝරුව චාරිත්‍රය
                              </h4>
                              <p className="text-xl md:text-2xl text-[#082f49] leading-relaxed tracking-wide font-bold">
                                {INVITATION.time.ceremonyStart}
                              </p>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => window.open(INVITATION.venue.googleMapsLink, "_blank")}
                          className="w-full group relative inline-flex items-center justify-center gap-4 py-6 bg-[#082f49] text-white text-sm md:text-base font-bold tracking-[0.45em] overflow-hidden transition-all hover:bg-black shadow-xl mt-4"
                        >
                          <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                          <span className="relative z-10 flex items-center gap-3">
                            <MapPin className="w-4 h-4" />
                            සිතියම විවෘත කරන්න
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  </div>

                  <div className="lg:col-span-7 order-1 lg:order-2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "circOut" }}
                      className="relative w-full aspect-[4/3] md:aspect-video lg:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-[0_80px_150px_-30px_rgba(0,0,0,0.25)] group bg-white"
                    >
                      <iframe
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(INVITATION.venue.mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        className="w-full h-full grayscale-[0.85] contrast-150 sepia-[0.2] brightness-[1.05] hover:grayscale-0 hover:sepia-0 hover:contrast-100 transition-all duration-1000 scale-[1.02] group-hover:scale-100"
                      />

                      <div className="absolute inset-0 pointer-events-none border-[15px] md:border-[25px] border-white/95 rounded-[3rem]" />
                      <div className="absolute inset-8 md:inset-12 pointer-events-none border border-white/20 rounded-[2.5rem]" />

                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center rounded-bl-full shadow-2xl p-8 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-700">
                        <MapPin className="w-8 h-8 text-[#082f49] mb-2 opacity-80" />
                        <span className="text-[8px] font-bold tracking-widest text-[#082f49]/90">
                          බලන්න
                        </span>
                      </div>

                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-[#075985]/5 to-transparent mix-blend-overlay" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                      className="inline-flex items-center gap-4 mt-8 px-8 py-3 bg-white border border-[#0369a1]/40 shadow-lg rounded-full"
                    >
                      <Sparkles className="w-4 h-4 text-[#075985]" />
                      <span className="text-sm md:text-base font-bold text-[#082f49] tracking-widest">
                        {INVITATION.venue.city}
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative py-32 md:py-48 flex flex-col items-center overflow-hidden bg-white">
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url("${encodeURI(TIMELINE_BACKGROUND_IMAGE)}")` }}
                aria-hidden="true"
              />
              <div className="container mx-auto px-4 max-w-4xl flex flex-col items-center relative z-10 w-full">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl md:text-4xl text-slate-800 tracking-[0.3em] mb-12 text-center"
                >
                  පැමිණීම තහවුරු කිරීම
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="relative w-full max-w-[650px] bg-white p-6 md:p-10 shadow-[0_40px_100px_-25px_rgba(0,0,0,0.12)] border border-slate-100 flex flex-col items-center"
                >
                  <div className="w-full border border-slate-300 rounded-[1.5rem] p-6 md:p-8 flex flex-col items-center">
                    <h3 className="text-2xl md:text-4xl text-slate-800 mb-8 text-center">
                      ඔබ පැමිණෙන්නේද?
                    </h3>

                    <form className="w-full space-y-6 text-left" onSubmit={handleRsvpSubmit}>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 ml-1">ඔබගේ නම</label>
                        <input
                          type="text"
                          placeholder="ඔබගේ නම මෙහි ලියන්න..."
                          value={rsvpForm.name}
                          onChange={(e) => {
                            setRsvpStatus("idle");
                            setRsvpForm((prev) => ({ ...prev, name: e.target.value }));
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all text-base font-numeric"
                          required
                        />
                      </div>

                      <div className="space-y-4 pt-2">
                        <label className="text-xs font-bold text-slate-500 ml-1">
                          අපගේ විශේෂ දිනයට ඔබ පැමිණෙන්නේද?
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            setRsvpStatus("idle");
                            setRsvpForm((prev) => ({ ...prev, guests: "1" }));
                          }}
                          aria-pressed={rsvpForm.guests !== "0"}
                          className={`w-full py-5 md:py-6 rounded-xl text-[11px] md:text-sm tracking-wide transition-all shadow-sm flex items-center justify-center px-4 leading-relaxed active:scale-[0.98] ${rsvpForm.guests !== "0"
                            ? "bg-[#082f49] text-white font-bold"
                            : "bg-[#f3f3f3] hover:bg-slate-200 text-slate-700"
                            }`}
                        >
                          ඔව්, මම ආදරයෙන් පැමිණෙන්නම්!
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRsvpStatus("idle");
                            setRsvpForm((prev) => ({ ...prev, guests: "0" }));
                          }}
                          aria-pressed={rsvpForm.guests === "0"}
                          className={`w-full py-5 md:py-6 rounded-xl text-[11px] md:text-sm tracking-wide transition-all shadow-sm flex items-center justify-center px-4 leading-relaxed active:scale-[0.98] ${rsvpForm.guests === "0"
                            ? "bg-[#082f49] text-white font-bold"
                            : "bg-[#f3f3f3] hover:bg-slate-200 text-slate-700"
                            }`}
                        >
                          කණගාටුයි, මට පැමිණිය නොහැක. නමුත් මගේ ආශීර්වාදය ඔබ සමඟයි.
                        </button>
                      </div>

                      {(rsvpStatus === "success" || rsvpStatus === "error") && (
                        <p
                          className={`text-sm text-center font-semibold ${rsvpStatus === "success" ? "text-emerald-600" : "text-red-500"
                            }`}
                        >
                          {rsvpStatus === "success"
                            ? "ඔබගේ පැමිණීම තහවුරු කිරීම සාර්ථකව යවා ඇත."
                            : "කරුණාකර ඔබගේ නම ඇතුළත් කර නැවත උත්සාහ කරන්න."}
                        </p>
                      )}

                      <div className="pt-6">
                        <button
                          type="submit"
                          disabled={rsvpStatus === "sending"}
                          className="w-full bg-[#082f49] text-white py-4 md:py-5 rounded-xl text-sm md:text-base tracking-[0.2em] font-bold hover:bg-[#1a5c4a] transition-all shadow-md disabled:opacity-70"
                        >
                          {rsvpStatus === "sending" ? "යවමින්..." : "තහවුරු කරන්න"}
                        </button>

                        <p className="text-sm text-slate-400 mt-4 text-center leading-relaxed">
                          ඔබගේ ප්‍රතිචාරය පුද්ගලිකව තබා ගනු ලැබේ.
                        </p>
                      </div>
                    </form>
                  </div>
                </motion.div>

              </div>
            </section>

            <section className="relative py-28 md:py-48 overflow-hidden bg-white">
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url("${encodeURI(WISHES_BACKGROUND_IMAGE)}")` }}
                aria-hidden="true"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] text-[#075985]/5 whitespace-nowrap pointer-events-none select-none italic">
                මිහිරි පණිවිඩ
              </div>

              <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6 mb-20"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-[#082f49] font-bold tracking-[0.6em] text-sm md:text-base opacity-90">
                      අමුත්තන්ගේ සටහන් පොත
                    </span>
                    <div className="h-px w-16 bg-[#075985]/30" />
                  </div>

                  <h2 className="text-5xl md:text-8xl bg-gradient-to-r from-[#075985] via-[#082f49] to-[#075985] bg-clip-text text-transparent leading-none drop-shadow-sm italic">
                    ආදරණීය පැතුම්
                  </h2>

                  <p className="text-[#082f49]/90 text-sm md:text-base tracking-[0.3em] font-medium max-w-xl mx-auto pt-4 leading-loose">
                    ඔබගේ ආදරය සහ ආශීර්වාදය අපට ලැබෙන වටිනාම ත්‍යාගයකි. නව ජීවිතයට මතක සටහනක් තබා යන්න.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="max-w-3xl mx-auto"
                >
                  <div className="bg-white p-10 md:p-20 shadow-[0_40px_100px_-20px_rgba(45,90,39,0.1)] border border-[#0369a1]/40 relative overflow-hidden">
                    <div className="absolute inset-4 border border-[#0369a1]/20 pointer-events-none" />
                    <div className="absolute inset-6 border-[0.5px] border-[#075985]/10 pointer-events-none" />

                    <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-[#075985]/40 rounded-tl-xl" />
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-[#075985]/40 rounded-br-xl" />

                    <form className="space-y-16 text-left relative z-10" onSubmit={handleWishSubmit}>
                      <div className="space-y-6 group">
                        <label className="text-sm tracking-[0.4em] font-bold text-[#082f49]/90 group-focus-within:text-[#075985] transition-colors">
                          ඔබගේ නම
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="ඔබගේ නම"
                            value={wishForm.name}
                            onChange={(e) => {
                              setWishStatus("idle");
                              setWishForm((prev) => ({ ...prev, name: e.target.value }));
                            }}
                            className="w-full bg-transparent border-b border-[#0369a1]/60 px-0 py-4 text-[#082f49] placeholder:text-[#0369a1]/30 focus:outline-none focus:border-[#082f49] transition-all text-base tracking-widest font-numeric"
                            required
                          />
                          <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#082f49] transition-all duration-500 group-focus-within:w-full" />
                        </div>
                      </div>

                      <div className="space-y-6 group">
                        <label className="text-sm tracking-[0.4em] font-bold text-[#082f49]/90 group-focus-within:text-[#075985] transition-colors">
                          ඔබගේ පණිවිඩය
                        </label>
                        <div className="relative">
                          <textarea
                            rows={4}
                            placeholder="නව යුවළට ඔබගේ ආදරණීය පැතුම් ලියන්න..."
                            value={wishForm.message}
                            onChange={(e) => {
                              setWishStatus("idle");
                              setWishForm((prev) => ({ ...prev, message: e.target.value }));
                            }}
                            className="w-full bg-transparent border-b border-[#0369a1]/60 px-0 py-4 text-[#082f49] placeholder:text-[#0369a1]/30 focus:outline-none focus:border-[#082f49] transition-all text-sm tracking-widest resize-none leading-relaxed font-numeric"
                            required
                          />
                          <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#082f49] transition-all duration-500 group-focus-within:w-full" />
                        </div>
                      </div>

                      <AnimatePresence>
                        {(wishStatus === "success" || wishStatus === "error") && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`text-sm text-center font-bold tracking-widest ${wishStatus === "success" ? "text-emerald-600" : "text-red-500"
                              }`}
                          >
                            {wishStatus === "success"
                              ? "ඔබගේ ආදරණීය පණිවිඩය සාර්ථකව යවා ඇත"
                              : "කරුණාකර නම සහ පණිවිඩය සම්පූර්ණ කරන්න"}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      <div className="pt-8 flex justify-center">
                        <button
                          type="submit"
                          disabled={wishStatus === "sending"}
                          className="group relative px-16 py-6 bg-[#082f49] text-white font-bold tracking-[0.5em] text-sm hover:bg-slate-900 transition-all duration-500 shadow-xl disabled:opacity-70 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-white/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
                          <span className="relative z-10 flex items-center gap-3">
                            <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            {wishStatus === "sending" ? "යවමින්..." : "පැතුම් යවන්න"}
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </div>
            </section>

            <section className="w-full relative overflow-hidden py-24 md:py-32 bg-white">
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url("${encodeURI(DETAILS_BACKGROUND_IMAGE)}")` }}
                aria-hidden="true"
              />
              <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-center gap-3 opacity-70">
                    <div className="h-px w-10 bg-[#082f49]/20" />
                    <Sparkles className="w-4 h-4 text-[#075985]" />
                    <div className="h-px w-10 bg-[#082f49]/20" />
                  </div>

                  <h2 className="text-5xl md:text-7xl bg-gradient-to-r from-[#075985] via-[#082f49] to-[#075985] bg-clip-text text-transparent italic">
                    ස්තූතියි
                  </h2>

                  <p className="text-[#082f49]/90 text-sm md:text-base tracking-[0.25em] font-medium leading-loose max-w-3xl mx-auto">
                    අපගේ විශේෂ දිනය ඔබ සමඟ ආදරයෙන් සැමරීමට අපි බලා සිටිමු.
                  </p>

                  <p className="text-sm md:text-base tracking-[0.5em] text-[#082f49]/90 font-bold">
                    © 2026 {INVITATION.couple.bride} සහ {INVITATION.couple.groom}
                  </p>

                  <p className="text-[#D4AF37] text-sm md:text-base mt-6 font-sans tracking-wider font-semibold">
                    Want a beautiful wedding website like this? Create yours with{" "}
                    <a target="_blank" rel="noreferrer" className="text-[#082f49] font-bold hover:text-[#D4AF37] underline transition-colors" href="https://wa.me/94707819074">
                      invitemint
                    </a>
                  </p>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src={backgroundMusic} loop />

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-[60] bg-white text-[#87937a] p-3 rounded-full shadow-lg border border-[#ccbaa2]/40 hover:bg-[#87937a]/10 transition-colors"
      >
        <div className="flex flex-col items-center">
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </div>
      </motion.button>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .dl-manel-bold,
            .dl-manel-bold * {
              font-family: 'Abhaya Libre', Arial, sans-serif !important;
            }

            input,
            textarea,
            button {
              font-family: 'Abhaya Libre', Arial, sans-serif !important;
            }

            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }

            .animate-spin-slow {
              animation: spin-slow linear infinite;
            }

            ::-webkit-scrollbar {
              width: 8px;
            }

            ::-webkit-scrollbar-track {
              background: #ccbaa233;
            }

            ::-webkit-scrollbar-thumb {
              background: #87937a66;
              border-radius: 10px;
            }

            @media (max-width: 768px) {
              html {
                font-size: 120% !important;
              }
              
              .text-\[5px\] {
                font-size: 8px !important;
              }
              
              .text-\[8px\] {
                font-size: 11px !important;
              }
              
              .text-\[10px\] {
                font-size: 13px !important;
              }
              
              .text-\[11px\] {
                font-size: 14px !important;
              }
            }
          `,
        }}
      />
    </main>
  );
}