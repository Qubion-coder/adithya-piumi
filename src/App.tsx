import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Calendar, Clock, ChevronDown, Send, Heart } from "lucide-react";
import { PREFIXES, decodeGuest, guestGreeting } from "./guestLink";

const INVITATION = {
  couple: {
    bride: "පියුමි",
    groom: "ආදිත්‍ය",
    brideFull: "පියුමි සන්දීපනී",
    groomFull: "ආදිත්‍ය ඉඳුවර",
  },
  date: {
    displayNumeric: "27 . 01 . 2027",
    displayLong: "වර්ෂ 2027 ක් වූ ජනවාරි මස 27 වන දින",
    countdownTarget: "2027-01-27T09:29:00+05:30",
    countdownCaption: "2027 ජනවාරි 27 බදාදා",
  },
  time: {
    ceremonyStart: "පෙ.ව. 9:29",
    ceremonyEnd: "ප.ව. 3:30",
    registration: "පෙ.ව. 11:00",
    welcome: "පෙ.ව. 9:00",
  },
  venue: {
    name: "Cinnamon Grand",
    city: "Colombo",
    nameSinhala: "සිනමන් ග්‍රෑන්ඩ්",
    addressSinhala: "අංක 77, ගාලු පාර, කොළඹ 03.",
    image: "/Gemini_Generated_Image_vhxsegvhxsegvhxs.jpg",
    mapQuery: "Cinnamon Grand, 77 Galle Road, Colombo 03",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Cinnamon+Grand+Colombo",
  },

} as const;

const MAX_RSVP_GUESTS = 10;

const backgroundMusic = "/ssstik.io_1787238853044.mp3";
const googleScriptUrl =
  "https://script.google.com/macros/s/AKfycbyFKvYH0cioVJ33qlPhQ6F0S4MA5eDrXaKoq1cIs1Dym7Wrqkwt4SYAs16uqV7vHlcLgw/exec";

const publicImagePath = (fileName: string) => `/images/${fileName.replaceAll(" ", "%20")}`;
const preImagePath = (fileName: string) => `/pre/${fileName.replaceAll(" ", "%20")}`;

const PRE_IMAGES = [
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.13.jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.34 (1).jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.34.jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.35.jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.20.09.jpeg"),
];

const HERO_BACKGROUND_IMAGE = PRE_IMAGES[4];

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

    const colors = ["#e7cf8c", "#a2c5a0", "#c5a059", "#d4af37", "#584625"];
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
          className="absolute drop-shadow-[0_2px_10px_rgba(27,67,50,0.3)]"
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

function CountdownTimer() {
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
    <div className="mx-auto mt-8 grid w-full max-w-lg grid-cols-4 gap-2.5 sm:gap-4">
      {stats.map((stat, i) => {
        const value = Math.max(0, stat.value).toString().padStart(2, "0");

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="flex aspect-[3/4] flex-col items-center justify-center rounded-2xl px-1 bg-[#fcf8ee] border border-[#b98a2f]/40 shadow-[0_14px_30px_-22px_rgba(120,86,30,0.55),inset_0_1px_0_rgba(255,255,255,0.7)]"
          >
            <div className="relative flex h-[1.35em] items-center justify-center overflow-hidden text-[clamp(1.7rem,6.5vw,3.1rem)]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={value}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35 }}
                  className="countdown-number block tabular-nums leading-[1.2] font-semibold text-[#8c6420]"
                >
                  {value}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="my-2 h-px w-7 bg-[#d8b45f]" aria-hidden="true" />
            <span className="text-[0.72rem] font-semibold text-[#8a7a60]">{stat.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}


function Gallery() {
  const marqueeImages = [...PRE_IMAGES, ...PRE_IMAGES, ...PRE_IMAGES];

  return (
    <section className="relative py-14 md:py-40 bg-transparent overflow-hidden">
      <div className="w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 mb-10 md:mb-16 px-6"
        >
          <div className="flex flex-col items-center gap-4">
            <span className="text-[#93763f] font-bold tracking-[0.8em] text-sm md:text-base opacity-40 uppercase">
              Captured Moments
            </span>
            <div className="h-px w-16 bg-[#e7cf8c]/30" />
          </div>
          <h2 className="text-5xl md:text-8xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#d4af37] bg-clip-text text-transparent italic leading-none">
            සුන්දර මතක
          </h2>
          <p className="text-[#c5a059]/70 text-sm md:text-base tracking-[0.3em] font-medium max-w-2xl mx-auto pt-2 leading-loose">
            අපගේ ආදර කතාවේ සුන්දරතම මොහොතක් ඔබ සමඟ බෙදා ගැනීමට අප සතුටින් බලා සිටිමු.
          </p>
        </motion.div>

        <div className="relative flex overflow-x-hidden w-full py-4 mask-gradient">
          <motion.div
            className="flex gap-6 md:gap-10 pr-6 md:pr-10 shrink-0"
            animate={{
              x: [0, "-33.33%"],
            }}
            transition={{
              ease: "linear",
              duration: 25,
              repeat: Infinity,
            }}
          >
            {marqueeImages.map((img, i) => (
              <div
                key={`${img}-${i}`}
                className="relative w-[280px] h-[380px] md:w-[350px] md:h-[480px] shrink-0 overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(45,90,39,0.15)] group"
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-4 rounded-[2rem] z-20 pointer-events-none group-hover:inset-6 transition-all duration-700" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function WeddingInvitation() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAttemptedAutoplay, setHasAttemptedAutoplay] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const guestCode = searchParams.get("g");
  const decodedGuest = guestCode ? decodeGuest(guestCode) : null;
  const guestName = decodedGuest
    ? guestGreeting(decodedGuest.name, decodedGuest.prefix)
    : searchParams.get("to");

  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    attending: true,
    guestCount: 1,
    message: "",
  });

  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const introVideoRef = React.useRef<HTMLVideoElement>(null);

  const submitToGoogleSheet = async (payload: Record<string, string>) => {
    if (!googleScriptUrl) {
      throw new Error("Google Script URL tl ilid ke;");
    }

    const response = await fetch(googleScriptUrl, {
      method: "POST",
      body: new URLSearchParams(payload),
    });

    if (!response.ok) {
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
        guests: rsvpForm.attending ? String(rsvpForm.guestCount) : "0",
        dietaryNotes: "",
        message: rsvpForm.message.trim(),
        invitedAs: guestName ?? "",
      });

      setRsvpStatus("success");
      setRsvpForm({ name: "", attending: true, guestCount: 1, message: "" });
    } catch {
      setRsvpStatus("error");
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

  useEffect(() => {
    if (introVideoRef.current && !hasStarted) {
      introVideoRef.current.play().catch((err) => {
        console.log("Intro video autoplay failed:", err);
      });
    }
  }, [hasStarted]);

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
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
          >
            <video
              ref={introVideoRef}
              muted={true}
              playsInline
              preload="auto"
              autoPlay
              loop={!hasStarted}
              className={`w-full h-full object-cover transition-all duration-[2000ms] ease-out ${!hasStarted ? "blur-md scale-105 opacity-80" : "blur-0 scale-100 opacity-100"
                }`}
              onEnded={() => setIsOpened(true)}
              onError={(e) => { console.error("Video error:", e); setIsOpened(true); }}
            >
              <source src="/Traditional_dancers_opening_wedd…_202608202002.mp4" type="video/mp4" />
            </video>

            {!hasStarted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-[120] bg-black/40 backdrop-blur-[2px]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-12"
                  >
                    <h2 className="text-4xl md:text-6xl text-white mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] font-bold">
                      විවාහ ආරාධනයයි
                    </h2>
                    <p className="text-xl md:text-2xl text-white tracking-[0.2em] md:tracking-[0.3em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] mt-4">
                      {INVITATION.couple.bride} සහ {INVITATION.couple.groom}
                    </p>
                  </motion.div>

                  <button
                    onClick={() => {
                      setHasStarted(true);

                      if (introVideoRef.current) {
                        introVideoRef.current.loop = false;
                        introVideoRef.current.currentTime = 0;
                        introVideoRef.current.play().catch((err) => console.log(err));
                      }

                      if (audioRef.current && !isPlaying) {
                        audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.log("Audio play failed:", err));
                      }
                    }}
                    className="group relative px-12 py-5 overflow-hidden rounded-full transition-all duration-500 hover:scale-105 active:scale-95"
                  >
                    <div className="absolute inset-0 bg-white opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative z-10 font-bold text-[#c5a059] text-sm tracking-[0.35em]">
                      ආරාධනය විවෘත කරන්න
                    </span>
                  </button>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ delay: 1.5 }}
                    className="mt-8 text-[#c5a059]/80 text-xs tracking-[0.35em]"
                  >
                    ආරම්භ කිරීමට ක්ලික් කරන්න
                  </motion.div>
                </motion.div>
              </div>
            )}

            {hasStarted && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-start pt-[8vh] md:pt-32 z-[105] pointer-events-none text-center px-6"
                >
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 0.8 }}
                    className="text-3xl md:text-6xl text-white mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] font-bold"
                  >
                    විවාහ ආරාධනයයි!
                  </motion.h2>

                  <div className="flex flex-col items-center w-full max-w-xl mx-auto gap-4 md:gap-8">
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 2, delay: 1.2 }}
                      className="text-4xl md:text-6xl text-white tracking-[0.2em] font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] text-center leading-normal whitespace-nowrap"
                    >
                      {INVITATION.couple.bride} <span className="text-3xl md:text-5xl opacity-90 italic mx-1 md:mx-3">&</span> {INVITATION.couple.groom}
                    </motion.p>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setIsOpened(true)}
                  className="absolute bottom-10 right-10 z-[110] px-8 py-3 bg-white/40 backdrop-blur-md text-white text-xs tracking-[0.35em] rounded-full hover:bg-white/60 transition-all font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                >
                  ආරාධනයට පිවිසෙන්න
                </motion.button>
              </>
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
              className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg text-[#c5a059] hover:bg-emerald-50 transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className="text-[11px] tracking-widest font-bold">වසා දමන්න</div>
              </div>
            </motion.button>

            <section className="w-full relative flex items-start justify-center overflow-hidden bg-transparent min-h-[100dvh] md:min-h-[85vh] pt-20 md:pt-32">
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url("/ChatGPT%20Image%20Jun%208,%202026,%2002_43_56%20AM.png")` }}
                aria-hidden="true"
              />

              <div className="relative z-10 w-full max-w-5xl px-6 text-center mt-12 md:mt-0">

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.8 }}
                  className="mt-10"
                >
                  <h1 className="text-6xl sm:text-7xl md:text-8xl text-[#c5a059] italic leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
                    {INVITATION.couple.bride}
                  </h1>

                  <div className="mt-6 flex items-center justify-center gap-5">
                    <div className="h-px w-14 bg-white/40" />
                    <span className="text-4xl md:text-5xl text-[#c5a059] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] font-bold">සහ</span>
                    <div className="h-px w-14 bg-white/40" />
                  </div>

                  <h1 className="mt-6 text-6xl sm:text-7xl md:text-8xl text-[#c5a059] italic leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
                    {INVITATION.couple.groom}
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.8 }}
                  className="mt-4 md:mt-12"
                >
                  <p className="mt-1 md:mt-5 text-[#93763f] text-sm md:text-base tracking-[0.15em] font-medium leading-loose max-w-2xl mx-auto">
                    අපගේ ජීවිතයේ අමතක නොවන සුබ මොහොත ඔබ සමඟ බෙදා ගැනීමට කැමැත්තෙමු!
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 1.1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
              >
                <div className="w-px h-14 bg-gradient-to-b from-[#c5a059]/30 to-transparent rounded-full overflow-hidden">
                  <motion.div
                    animate={{ y: [-56, 56] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-1/2 bg-[#d4af37]/45"
                  />
                </div>
              </motion.div>
            </section>

            <section
              id="details"
              className="relative pt-8 md:pt-20 pb-12 md:pb-32 w-full flex flex-col items-center overflow-hidden"
              style={{
                backgroundImage: 'url("/vintage_paper.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-4 md:inset-8 ] pointer-events-none z-10" />
              <div className="absolute inset-5 md:inset-10 ] pointer-events-none z-10" />

              <div className="max-w-[1100px] w-full flex flex-col items-center text-center relative z-20 px-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center mb-16 space-y-6"
                >
                  <div className="flex items-center gap-4 opacity-40">
                    <div className="h-px w-8 bg-white" />
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <div className="h-px w-8 bg-white" />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-[6px] border-[#d4af37]/20 shadow-[0_0_20px_rgba(212,175,55,0.15)] mx-auto mt-4 mb-8"
                  >
                    <img
                      src="/Gemini_Generated_Image_16oydy16oydy16oy.jpg"
                      alt="Couple Cartoon"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>

                  <div className="relative w-full max-w-[600px] mx-auto rounded-[160px_160px_28px_28px] p-[1.5px] bg-gradient-to-b from-[#e7cf8c] via-[#b98a2f] to-[#8c6420] shadow-[0_40px_80px_-40px_rgba(120,86,30,0.6)]">
                    <div
                      className="absolute left-1/2 -top-6 z-10 -translate-x-1/2 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#e7cf8c] via-[#b98a2f] to-[#8c6420] shadow-[0_8px_20px_-6px_rgba(120,86,30,0.7)] ring-4 ring-[#fcf8ee]"
                      aria-hidden="true"
                    >
                      <Sparkles className="h-5 w-5 text-[#fdf8ec]" />
                    </div>

                    <div className="relative rounded-[158px_158px_26.5px_26.5px] bg-[#fcf8ee]/95 px-6 pt-16 pb-10 md:px-14 md:pt-20 md:pb-12 flex flex-col items-center leading-relaxed text-[0.95rem] md:text-lg">
                      <div className="pointer-events-none absolute inset-2.5 rounded-[148px_148px_20px_20px] border border-[#b98a2f]/25" aria-hidden="true" />
                      <div className="pointer-events-none absolute bottom-5 left-5 h-7 w-7 border-b border-l border-[#b98a2f]/50 rounded-bl-lg" aria-hidden="true" />
                      <div className="pointer-events-none absolute bottom-5 right-5 h-7 w-7 border-b border-r border-[#b98a2f]/50 rounded-br-lg" aria-hidden="true" />

                      {[
                        <div key="title" className="flex flex-col items-center">
                          <h2 className="text-xl md:text-2xl font-bold tracking-[0.35em] bg-gradient-to-b from-[#d8b45f] to-[#8c6420] bg-clip-text text-transparent">
                            ශ්‍රී සුබ මංගලම්
                          </h2>
                          <div className="mt-4 flex items-center justify-center gap-3" aria-hidden="true">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#b98a2f]" />
                            <div className="w-2 h-2 rotate-45 bg-gradient-to-b from-[#d8b45f] to-[#8c6420]" />
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#b98a2f]" />
                          </div>
                        </div>,

                        <div key="bride" className="mt-8 flex flex-col items-center">
                          <p className="text-[#6b5a40]">
                            බී.ඒ. බාලසූරිය මහතා සහ
                            <br />
                            එස්.ඒ. චම්පිකා මල්කාන්ති මහත්මියගේ ආදරණීය දියණිය
                          </p>
                          <h3 className="mt-3 text-[2rem] md:text-[2.6rem] font-bold leading-tight bg-gradient-to-b from-[#d8b45f] via-[#b98a2f] to-[#8c6420] bg-clip-text text-transparent">
                            පියුමි සන්දීපනී
                          </h3>
                        </div>,

                        <div key="with" className="my-6 flex items-center justify-center gap-4" aria-hidden="true">
                          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#b98a2f]/70" />
                          <span className="grid h-10 w-10 place-items-center rounded-full border border-[#b98a2f]/50 bg-[#b98a2f]/10">
                            <Heart className="h-4 w-4 text-[#b98a2f] fill-[#b98a2f]" />
                          </span>
                          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#b98a2f]/70" />
                        </div>,

                        <div key="groom" className="flex flex-col items-center">
                          <p className="text-[#6b5a40]">
                            කේ.ඩබ්. නේරංජ මහතා සහ
                            <br />
                            එච්.කේ.කේ. චමරි මධුවන්ති මහත්මියගේ ආදරණීය පුත්
                          </p>
                          <h3 className="mt-3 text-[2rem] md:text-[2.6rem] font-bold leading-tight bg-gradient-to-b from-[#d8b45f] via-[#b98a2f] to-[#8c6420] bg-clip-text text-transparent">
                            ආදිත්‍ය ඉඳුවර
                          </h3>
                          <p className="mt-3 text-lg italic tracking-[0.3em] text-[#8a7a60]">සමඟ</p>
                        </div>,

                        <div key="invite" className="mt-8 w-full rounded-2xl border border-dashed border-[#b98a2f]/45 bg-[#b98a2f]/[0.06] px-5 py-6 md:px-8 flex flex-col items-center">
                          <p className="text-[#6b5a40]">අතිනත ගැනීමේ ප්‍රීති නිමිත්තෙන්</p>
                          {decodedGuest ? (
                            <>
                              <p className="mt-4 text-[#8a7a60]">
                                ආදරණීය{" "}
                                <span className="text-2xl md:text-3xl font-bold text-[#8c6420]">{decodedGuest.name}</span>
                              </p>
                              <p className="mt-1 text-xl md:text-2xl font-bold text-[#8c6420]">{decodedGuest.prefix}</p>
                            </>
                          ) : (
                            <p className="mt-4 text-2xl md:text-3xl font-bold text-[#8c6420]">
                              {guestName ?? PREFIXES[0]}
                            </p>
                          )}
                          <p className="mt-4 text-[#6b5a40]">කෙරෙන සුහද ඇරයුමයි මේ.</p>
                        </div>,
                      ].map((block, i) => (
                        <motion.div
                          key={block.key}
                          initial={{ opacity: 0, y: 14 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.12, duration: 0.7 }}
                          className="relative w-full flex justify-center"
                        >
                          {block}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <div className="relative w-full flex flex-col items-center justify-center my-8 md:my-12 mb-12 md:mb-24">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9 }}
                    className="relative z-20 w-full max-w-[560px] rounded-[28px] p-[1.5px] bg-gradient-to-b from-[#e7cf8c] via-[#b98a2f] to-[#8c6420] shadow-[0_40px_80px_-40px_rgba(120,86,30,0.6)]"
                  >
                    <div className="relative rounded-[26.5px] bg-[#fcf8ee] px-6 py-10 md:px-12 md:py-12 text-center">
                      <div className="pointer-events-none absolute inset-2.5 rounded-[20px] border border-[#b98a2f]/25" aria-hidden="true" />
                      <div className="pointer-events-none absolute top-5 left-5 h-7 w-7 border-t border-l border-[#b98a2f]/50 rounded-tl-lg" aria-hidden="true" />
                      <div className="pointer-events-none absolute top-5 right-5 h-7 w-7 border-t border-r border-[#b98a2f]/50 rounded-tr-lg" aria-hidden="true" />
                      <div className="pointer-events-none absolute bottom-5 left-5 h-7 w-7 border-b border-l border-[#b98a2f]/50 rounded-bl-lg" aria-hidden="true" />
                      <div className="pointer-events-none absolute bottom-5 right-5 h-7 w-7 border-b border-r border-[#b98a2f]/50 rounded-br-lg" aria-hidden="true" />

                      <div className="relative flex flex-col items-center">
                        {[
                          {
                            icon: Calendar,
                            latin: "Date",
                            label: "දිනය",
                            value: INVITATION.date.displayLong,
                          },
                          {
                            icon: Clock,
                            latin: "Time",
                            label: "වේලාව",
                            value: `පෝරුව චාරිත්‍ර ${INVITATION.time.ceremonyStart}ට`,
                          },
                          {
                            icon: MapPin,
                            latin: "Venue",
                            label: "ස්ථානය",
                            value: `${INVITATION.venue.name}, ${INVITATION.venue.city}`,
                          },
                        ].map((item, i) => (
                          <React.Fragment key={item.latin}>
                            {i > 0 && (
                              <div className="my-6 flex items-center justify-center gap-3" aria-hidden="true">
                                <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#b98a2f]/60" />
                                <div className="w-1.5 h-1.5 rotate-45 bg-[#b98a2f]/70" />
                                <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#b98a2f]/60" />
                              </div>
                            )}

                            <motion.div
                              initial={{ opacity: 0, y: 12 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.15 + i * 0.12, duration: 0.6 }}
                              className="flex flex-col items-center"
                            >
                              <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#e7cf8c] via-[#b98a2f] to-[#8c6420] shadow-[0_8px_18px_-8px_rgba(120,86,30,0.7)] ring-4 ring-[#b98a2f]/10">
                                <item.icon className="h-5 w-5 text-[#fdf8ec]" />
                              </div>
                              <span className="label-latin text-[0.6rem] uppercase tracking-[0.34em] text-[#b98a2f]">
                                {item.latin}
                              </span>
                              <span className="mt-0.5 text-[0.8rem] font-semibold text-[#8a7a60]">
                                {item.label}
                              </span>
                              <span className="mt-1.5 text-[1.05rem] md:text-[1.2rem] font-bold leading-snug text-[#8c6420]">
                                {item.value}
                              </span>
                            </motion.div>
                          </React.Fragment>
                        ))}

                        <a
                          href={INVITATION.venue.googleMapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#b98a2f]/50 px-5 py-2 text-[0.85rem] font-semibold text-[#8c6420] transition-colors hover:bg-[#b98a2f] hover:text-[#fdf8ec]"
                        >
                          <MapPin className="h-3.5 w-3.5" />
                          සිතියමෙන් බලන්න
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            <section
              id="countdown"
              className="relative overflow-hidden px-6 py-12 md:py-20 text-center"
              style={{
                backgroundImage: 'url("/ChatGPT%20Image%20Jul%2021,%202026,%2006_25_22%20PM.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                className="relative mx-auto max-w-2xl"
              >
                <span className="mb-2 label-latin block text-[0.66rem] uppercase tracking-[0.34em] text-[#b98a2f]">
                  Countdown
                </span>
                <h2 className="font-bold text-[#8c6420] text-[clamp(1.6rem,4vw,2.3rem)]">
                  සුබ මොහොත එළඹෙන තුරු
                </h2>
                <div className="mt-4 flex items-center justify-center gap-3" aria-hidden="true">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#b98a2f]" />
                  <div className="w-2 h-2 rotate-45 bg-gradient-to-b from-[#d8b45f] to-[#8c6420]" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#b98a2f]" />
                </div>

                <CountdownTimer />

                <p className="mt-6 text-[0.95rem] text-[#8a7a60]">
                  {INVITATION.date.countdownCaption}
                </p>
              </motion.div>
            </section>

            <section
              id="venue"
              className="relative py-12 md:py-20 flex flex-col items-center overflow-hidden"
              style={{
                backgroundImage: 'url("/vintage_paper%20-%20Copy.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="w-full max-w-5xl px-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-10 md:mb-14 text-center"
                >
                  <span className="mb-2 label-latin block text-[0.66rem] uppercase tracking-[0.34em] text-[#b98a2f]">
                    Location
                  </span>
                  <h2 className="leading-tight font-bold text-[#8c6420] text-[clamp(1.7rem,4.2vw,2.6rem)]">
                    උත්සව ස්ථානය
                  </h2>
                  <div className="mt-4 flex items-center justify-center gap-3" aria-hidden="true">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#b98a2f]" />
                    <div className="w-2 h-2 rotate-45 bg-gradient-to-b from-[#d8b45f] to-[#8c6420]" />
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#b98a2f]" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9 }}
                  className="grid items-stretch gap-5 sm:gap-8 md:grid-cols-[0.85fr_1.15fr]"
                >
                  <div className="flex flex-col justify-center">
                    <div className="flex flex-col items-center gap-3 px-8 py-9 text-center bg-[#fcf8ee] border border-[#b98a2f]/35 rounded-[26px_26px_18px_18px] shadow-[0_16px_36px_-26px_rgba(120,86,30,0.45)]">
                      <img
                        src={INVITATION.venue.image}
                        alt={INVITATION.venue.nameSinhala}
                        loading="lazy"
                        draggable={false}
                        className="mb-2 w-full max-w-[440px] select-none rounded-2xl opacity-95"
                      />
                      <div className="flex flex-col gap-1">
                        <span className="label-latin text-[0.62rem] uppercase tracking-[0.3em] text-[#b98a2f]">
                          Venue
                        </span>
                        <h3 className="font-bold text-[#8c6420] text-[1.2rem] leading-[1.35]">
                          {INVITATION.venue.nameSinhala}
                        </h3>
                        <p className="text-[0.95rem] text-[#8a7a60]">
                          {INVITATION.venue.addressSinhala}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-[18px] border border-[#b98a2f]/40 shadow-[0_28px_56px_-34px_rgba(120,86,30,0.5)]">
                      <iframe
                        title={`Map of ${INVITATION.venue.nameSinhala}`}
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(INVITATION.venue.mapQuery)}&z=15&hl=en&output=embed`}
                        className="absolute inset-0 h-full w-full border-0 [filter:grayscale(0.2)_saturate(0.9)]"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                      />
                    </div>

                    <a
                      href={INVITATION.venue.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 self-center rounded-full px-7 py-3 text-[0.95rem] font-semibold text-[#fdf8ec] bg-gradient-to-br from-[#b98a2f] to-[#8c6420] shadow-[0_14px_26px_-14px_rgba(120,86,30,0.7)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
                    >
                      <MapPin className="h-4 w-4" />
                      සිතියමෙන් බලන්න
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>

            <section
              id="rsvp"
              className="relative overflow-hidden px-6 py-14 md:py-24"
              style={{
                backgroundImage: 'url("/ChatGPT%20Image%20Jul%2021,%202026,%2006_25_22%20PM%20-%20Copy.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                viewport={{ once: true }}
                className="mx-auto max-w-xl text-center"
              >
                <span className="label-latin mb-2 block text-[0.66rem] uppercase tracking-[0.34em] text-[#b98a2f]">
                  RSVP
                </span>
                <h2 className="font-bold text-[#8c6420] text-[clamp(1.6rem,4vw,2.3rem)]">
                  පැමිණීම දන්වන්න
                </h2>
                <div className="mt-4 flex items-center justify-center gap-3" aria-hidden="true">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#b98a2f]" />
                  <div className="w-2 h-2 rotate-45 bg-gradient-to-b from-[#d8b45f] to-[#8c6420]" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#b98a2f]" />
                </div>
                <p className="mx-auto mb-9 mt-5 max-w-[44ch] leading-[1.85] text-[#8a7a60]">
                  ඔබගේ පැමිණීම අපට මහත් සතුටකි. කරුණාකර කලින් දන්වන්න.
                </p>

                <div className="relative mt-6 rounded-[124px_124px_26px_26px] p-[1.5px] bg-gradient-to-b from-[#e7cf8c] via-[#b98a2f] to-[#8c6420] shadow-[0_40px_80px_-40px_rgba(120,86,30,0.6)]">
                  <div
                    className="absolute left-1/2 -top-6 z-10 -translate-x-1/2 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#e7cf8c] via-[#b98a2f] to-[#8c6420] shadow-[0_8px_20px_-6px_rgba(120,86,30,0.7)] ring-4 ring-[#fcf8ee]"
                    aria-hidden="true"
                  >
                    <Heart className="h-5 w-5 text-[#fdf8ec] fill-[#fdf8ec]" />
                  </div>

                <form
                  className="relative rounded-[122px_122px_24px_24px] px-6 pb-10 pt-16 sm:px-12 sm:pt-20 text-left bg-[#fcf8ee]/95 backdrop-blur-sm"
                  onSubmit={handleRsvpSubmit}
                >
                  <div
                    className="pointer-events-none absolute inset-2.5 rounded-[112px_112px_18px_18px] border border-[#b98a2f]/25"
                    aria-hidden="true"
                  />
                  <div className="pointer-events-none absolute bottom-5 left-5 h-8 w-8 border-b border-l border-[#b98a2f]/50 rounded-bl-lg" aria-hidden="true" />
                  <div className="pointer-events-none absolute bottom-5 right-5 h-8 w-8 border-b border-r border-[#b98a2f]/50 rounded-br-lg" aria-hidden="true" />
                  <div className="relative mb-5 flex flex-col gap-1.5">
                    <label htmlFor="rsvp-name" className="text-[0.9rem] font-semibold text-[#8c6420]">
                      සම්පූර්ණ නම
                    </label>
                    <input
                      id="rsvp-name"
                      type="text"
                      placeholder="ඔබගේ නම"
                      value={rsvpForm.name}
                      onChange={(e) => {
                        setRsvpStatus("idle");
                        setRsvpForm((prev) => ({ ...prev, name: e.target.value }));
                      }}
                      className="w-full px-4 py-3 rounded-[10px] bg-[#fcf8ee] border border-[#b98a2f]/45 text-[#5a4a33] placeholder:text-[#b9a888] focus:outline-none focus:border-[#8c6420] focus:ring-1 focus:ring-[#b98a2f]/40 transition-colors"
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <p className="mb-2.5 text-[0.9rem] font-semibold text-[#8c6420]">සහභාගි වෙනවාද?</p>
                    <div className="flex gap-3">
                      {[
                        { value: true, label: "සතුටින් සහභාගි වෙමි" },
                        { value: false, label: "සහභාගි විය නොහැක" },
                      ].map((option) => {
                        const selected = rsvpForm.attending === option.value;

                        return (
                          <button
                            key={option.label}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => {
                              setRsvpStatus("idle");
                              setRsvpForm((prev) => ({ ...prev, attending: option.value }));
                            }}
                            className={`flex-1 px-3 py-3.5 text-center rounded-[10px] border font-semibold transition-colors ${selected
                              ? "bg-gradient-to-br from-[#b98a2f] to-[#8c6420] border-transparent text-[#fdf8ec] shadow-[0_10px_20px_-12px_rgba(120,86,30,0.7)]"
                              : "bg-transparent border-[#b98a2f]/45 text-[#8a7a60] hover:bg-[#b98a2f]/10"
                              }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {rsvpForm.attending && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-5 overflow-hidden"
                      >
                        <p className="mb-2.5 text-[0.9rem] font-semibold text-[#8c6420]">පැමිණෙන ගණන</p>
                        <div className="flex items-center justify-center gap-6">
                          <button
                            type="button"
                            aria-label="Decrease guest count"
                            disabled={rsvpForm.guestCount <= 1}
                            onClick={() => {
                              setRsvpStatus("idle");
                              setRsvpForm((prev) => ({ ...prev, guestCount: Math.max(1, prev.guestCount - 1) }));
                            }}
                            className="grid h-11 w-11 place-items-center rounded-full text-xl bg-[#b98a2f]/10 text-[#8c6420] border border-[#b98a2f]/50 transition-all hover:opacity-80 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            −
                          </button>
                          <span className="countdown-number min-w-[3rem] text-center leading-none text-[2.6rem] text-[#8c6420]">
                            {rsvpForm.guestCount}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase guest count"
                            disabled={rsvpForm.guestCount >= MAX_RSVP_GUESTS}
                            onClick={() => {
                              setRsvpStatus("idle");
                              setRsvpForm((prev) => ({ ...prev, guestCount: Math.min(MAX_RSVP_GUESTS, prev.guestCount + 1) }));
                            }}
                            className="grid h-11 w-11 place-items-center rounded-full text-xl bg-[#b98a2f]/10 text-[#8c6420] border border-[#b98a2f]/50 transition-all hover:opacity-80 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative mb-6 flex flex-col gap-1.5">
                    <label htmlFor="rsvp-message" className="text-[0.9rem] font-semibold text-[#8c6420]">
                      සුබ පැතුම් <span className="font-normal text-[#8a7a60]">(අවශ්‍ය නම්)</span>
                    </label>
                    <textarea
                      id="rsvp-message"
                      rows={4}
                      placeholder="නව යුවළට ඔබගේ ආදරණීය සුබ පැතුම් ලියන්න..."
                      value={rsvpForm.message}
                      onChange={(e) => {
                        setRsvpStatus("idle");
                        setRsvpForm((prev) => ({ ...prev, message: e.target.value }));
                      }}
                      className="w-full px-4 py-3 rounded-[10px] bg-[#fcf8ee] border border-[#b98a2f]/45 text-[#5a4a33] placeholder:text-[#b9a888] focus:outline-none focus:border-[#8c6420] focus:ring-1 focus:ring-[#b98a2f]/40 transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {(rsvpStatus === "success" || rsvpStatus === "error") && (
                    <p
                      className={`mb-4 text-sm text-center font-semibold ${rsvpStatus === "success" ? "text-emerald-700" : "text-red-600"
                        }`}
                    >
                      {rsvpStatus === "success"
                        ? "ඔබගේ පිළිතුර සාර්ථකව යවා ඇත. ස්තූතියි!"
                        : "කරුණාකර ඔබගේ නම ඇතුළත් කර නැවත උත්සාහ කරන්න."}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={rsvpStatus === "sending"}
                    className="relative z-10 inline-flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-[1.02rem] font-bold text-[#fdf8ec] bg-gradient-to-br from-[#b98a2f] to-[#8c6420] shadow-[0_14px_30px_-12px_rgba(120,86,30,0.6)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {rsvpStatus === "sending" ? "යවමින්..." : "පිළිතුර යවන්න"}
                  </button>
                </form>
                </div>
              </motion.div>
            </section>







            <footer className="relative w-full overflow-hidden bg-[linear-gradient(180deg,#3a2a14_0%,#2a1e0e_100%)] px-6 pt-16 pb-10 md:pt-24 md:pb-12 text-center">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d8b45f] to-transparent" aria-hidden="true" />
              <div
                className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[520px] h-[260px] rounded-b-full bg-[#d8b45f]/10 blur-3xl"
                aria-hidden="true"
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative mx-auto max-w-xl"
              >
                <span className="label-latin mb-3 block text-[0.66rem] uppercase tracking-[0.34em] text-[#d8b45f]/80">
                  Thank You
                </span>
                <h2 className="font-bold text-[clamp(2.2rem,6vw,3.4rem)] leading-tight bg-gradient-to-b from-[#f3dfa6] via-[#d8b45f] to-[#b98a2f] bg-clip-text text-transparent">
                  ස්තූතියි
                </h2>
                <div className="mt-4 flex items-center justify-center gap-3" aria-hidden="true">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d8b45f]" />
                  <div className="w-2 h-2 rotate-45 bg-gradient-to-b from-[#f3dfa6] to-[#b98a2f]" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d8b45f]" />
                </div>

                <p className="mx-auto mt-6 max-w-[42ch] leading-[1.9] text-[#e9dcc0]/80">
                  සෙනෙහසින් ලියැවෙන අපගේ ජීවිත කතාවේ සුන්දරතම දිනය, ඔබගේ පැමිණීමෙන් තවත් අර්ථවත් වනු ඇතැයි අප විශ්වාස කරමු.
                </p>

                <div className="mx-auto mt-10 inline-flex flex-col items-center rounded-[90px_90px_18px_18px] border border-[#d8b45f]/35 bg-[#d8b45f]/[0.06] px-10 pt-8 pb-6">
                  <p className="flex items-center text-[1.6rem] md:text-[2rem] font-bold text-[#f3dfa6] leading-tight">
                    {INVITATION.couple.bride}
                    <motion.span
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                      className="mx-3 inline-flex"
                      aria-label="සහ"
                    >
                      <Heart className="w-5 h-5 md:w-6 md:h-6 text-[#d8b45f] fill-[#d8b45f]" />
                    </motion.span>
                    {INVITATION.couple.groom}
                  </p>
                  <span className="my-3 h-px w-10 bg-[#d8b45f]/60" aria-hidden="true" />
                  <p className="countdown-number tracking-[0.3em] text-sm text-[#d8b45f]">
                    {INVITATION.date.displayNumeric}
                  </p>
                </div>
              </motion.div>

              <div className="relative mx-auto mt-14 max-w-xl border-t border-[#d8b45f]/20 pt-6 space-y-2">
                <p className="label-latin inline-flex items-center gap-1.5 text-[0.65rem] tracking-[0.3em] uppercase text-[#e9dcc0]/50">
                  © 2027 · Made with
                  <Heart className="w-3 h-3 text-[#d8b45f] fill-[#d8b45f]" aria-label="love" />
                </p>
                <p className="label-latin text-[0.65rem] tracking-[0.15em] text-[#e9dcc0]/50">
                  Want a wedding website like this? Create yours with{" "}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#d8b45f] hover:text-[#f3dfa6] underline underline-offset-4 transition-colors"
                    href="https://wa.me/94707819074"
                  >
                    invitemint
                  </a>
                </p>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src={backgroundMusic} loop />

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-[60] bg-white text-[#d4af37] p-3 rounded-full shadow-lg hover:bg-[#d4af37]/10 transition-colors"
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

            .dl-manel-bold .countdown-number {
              font-family: 'Playfair Display', Georgia, serif !important;
            }

            .dl-manel-bold .label-latin {
              font-family: 'Montserrat', Arial, sans-serif !important;
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
              background: #d4af3766;
              border-radius: 10px;
            }
          `,
        }}
      />
    </main>
  );
}
