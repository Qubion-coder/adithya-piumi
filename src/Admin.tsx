import React, { useState } from 'react';
import { Link2, Copy, Check, MessageSquareText } from 'lucide-react';
import { PREFIXES, encodeGuest } from './guestLink';

const COUPLE_SIGNATURE = 'ආදිත්‍ය සහ පියුමි';

const buildMessage = (guestName: string, prefix: string, url: string) =>
  `ආදරණීය ${guestName}
${prefix} ❤️

අපේ ආදර කතාවේ සුන්දරම පරිච්ඡේදය ආරම්භ කරන මේ සුවිශේෂී මොහොතේ, අපේ ජීවිතයේ වටිනාම දිනය වන විවාහ මංගල්‍යය සමඟින් එක්වන්නට ${prefix} හදපිරි සෙනෙහසින් ආරාධනා කරමු. 💍🤍

අපගේ ආදරය, සතුට සහ අලුත් ජීවිතයක බලාපොරොත්තු පිරුණු මේ සුන්දර දිනයේ සියලු විස්තර පහත සබැඳිය ඔස්සේ නැරඹිය හැකියි.

විවාහ ආරාධනා පත්‍රය🌸
${url}

ආදරයෙන් හා සෙනෙහසින්

❤️ ${COUPLE_SIGNATURE} ❤️

දෙහදක් එක්වන, ආදරයෙන් ජීවිතය ලියැවෙන අලුත් ආරම්භයක්… ✨💐`;

export default function Admin() {
  const [prefix, setPrefix] = useState(PREFIXES[0]);
  const [guestName, setGuestName] = useState('');
  const [generated, setGenerated] = useState<{ url: string; message: string } | null>(null);
  const [copied, setCopied] = useState<'link' | 'message' | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const name = guestName.trim();
    if (!name) return;

    const url = `${window.location.origin}/?g=${encodeGuest(name, PREFIXES.indexOf(prefix))}`;
    setGenerated({ url, message: buildMessage(name, prefix, url) });
    setCopied(null);
  };

  const handleCopy = async (kind: 'link' | 'message') => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(kind === 'link' ? generated.url : generated.message);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const fieldClass =
    'w-full rounded-[10px] border border-[#b98a2f]/45 bg-[#fcf8ee] px-4 py-3 text-[#5a4a33] placeholder:text-[#b9a888] focus:border-[#8c6420] focus:outline-none focus:ring-1 focus:ring-[#b98a2f]/40 transition-colors';

  return (
    <div
      className="h-[100dvh] overflow-y-auto px-4 py-12"
      style={{ background: 'rgba(237, 223, 184, 0.4)', fontFamily: "'Abhaya Libre', Arial, sans-serif" }}
    >
      <div className="mx-auto max-w-xl rounded-[28px] bg-gradient-to-b from-[#e7cf8c] via-[#b98a2f] to-[#8c6420] p-[1.5px] shadow-[0_40px_80px_-40px_rgba(120,86,30,0.6)]">
        <div className="rounded-[26.5px] bg-[#fcf8ee] p-6 md:p-10">
          <h1
            className="mb-8 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.34em] text-[#8c6420]"
            style={{ fontFamily: "'Montserrat', Arial, sans-serif" }}
          >
            <Link2 className="h-5 w-5 text-[#b98a2f]" />
            Link Generator
          </h1>

          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="prefix" className="text-[0.9rem] font-semibold text-[#8c6420]">
                Select Prefix
              </label>
              <select id="prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)} className={fieldClass}>
                {PREFIXES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="guest-name" className="text-[0.9rem] font-semibold text-[#8c6420]">
                Guest Name
              </label>
              <input
                id="guest-name"
                type="text"
                placeholder="e.g. Nimal"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className={fieldClass}
                required
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-[#b98a2f] to-[#8c6420] py-4 text-[1.02rem] font-bold text-[#fdf8ec] shadow-[0_14px_30px_-12px_rgba(120,86,30,0.6)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <MessageSquareText className="h-4 w-4" />
              Generate Message
            </button>
          </form>

          {generated && (
            <div className="mt-8 space-y-4">
              <pre className="whitespace-pre-wrap break-words rounded-2xl border border-[#b98a2f]/35 bg-white/70 p-5 text-[0.95rem] leading-[1.8] text-[#5a4a33]" style={{ fontFamily: 'inherit' }}>
                {generated.message}
              </pre>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleCopy('link')}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#b98a2f]/50 px-5 py-3 font-semibold text-[#8c6420] transition-colors hover:bg-[#b98a2f]/10"
                >
                  {copied === 'link' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === 'link' ? 'Copied!' : 'Copy Link'}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy('message')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#b98a2f] to-[#8c6420] px-5 py-3 font-semibold text-[#fdf8ec] shadow-[0_10px_20px_-12px_rgba(120,86,30,0.7)] transition-transform hover:-translate-y-0.5"
                >
                  {copied === 'message' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === 'message' ? 'Copied!' : 'Copy Full Message'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
