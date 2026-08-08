"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Button } from "@/components/Button";
import { ArrowRightIcon } from "@/components/Icon";
import { playSuccessTone, playErrorTone } from "@/lib/sound";

const GATE_STORAGE_KEY = "dgem_scanner_gate";
const QUICK_GATES = ["Gate A", "Gate B", "Gate C", "Main Entrance"];

type Result =
  | { state: "idle" }
  | { state: "granted"; attendee: { fullName: string; ticketId: string; school: string; level: string; department: string }; gate: string; time: string }
  | { state: "already"; attendee: { fullName: string; ticketId: string }; firstScannedAt: string | null; firstGate: string | null; firstSteward: string | null }
  | { state: "crew"; volunteer: { fullName: string; role: string; crewId: string }; gate: string; time: string }
  | { state: "crew_already"; volunteer: { fullName: string; role: string; crewId: string }; firstScannedAt: string | null; firstGate: string | null }
  | { state: "invalid"; query?: string };

function GateSetup({ onSet }: { onSet: (gate: string) => void }) {
  const [custom, setCustom] = useState("");

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 px-4 py-10">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">This device is</p>
        <h1 className="font-display mt-1 text-xl font-extrabold">Which gate is this?</h1>
        <p className="mt-2 text-xs text-bodyfg">
          Every scan from this device is recorded under this gate. Set it once per device — you can run as many
          scanners as you have phones, each with its own gate.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {QUICK_GATES.map((g) => (
          <button
            key={g}
            onClick={() => onSet(g)}
            className="rounded-xl border border-ink px-4 py-3 text-sm font-bold shadow-sm transition-colors hover:bg-ink hover:text-white"
          >
            {g}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Or type a custom gate name"
          className="h-11 flex-1 rounded-lg border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none"
        />
        <Button disabled={!custom.trim()} onClick={() => onSet(custom.trim())}>
          Set
        </Button>
      </div>
    </div>
  );
}

export function ScannerClient({ stewardName }: { stewardName: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const [gate, setGate] = useState<string | null>(null);
  const [gateLoaded, setGateLoaded] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [result, setResult] = useState<Result>({ state: "idle" });
  const [manual, setManual] = useState("");
  const [scanCount, setScanCount] = useState(0);
  const lastSubmit = useRef<string>("");
  const submitting = useRef(false);

  useEffect(() => {
    setGate(localStorage.getItem(GATE_STORAGE_KEY));
    setGateLoaded(true);
  }, []);

  const setAndStoreGate = (g: string) => {
    localStorage.setItem(GATE_STORAGE_KEY, g);
    setGate(g);
  };

  const clearGate = () => {
    localStorage.removeItem(GATE_STORAGE_KEY);
    setGate(null);
  };

  const submit = useCallback(async (query: string, override = false) => {
    if (submitting.current || !query || !gate) return;
    submitting.current = true;
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, gate, override }),
      });
      const data = await res.json();
      if (data.state === "granted" || data.state === "crew") {
        playSuccessTone();
        setScanCount((c) => c + 1);
      } else if (data.state === "already" || data.state === "crew_already") {
        playErrorTone();
        setScanCount((c) => c + 1);
      } else {
        playErrorTone();
      }
      setResult(data.state === "invalid" ? { state: "invalid", query } : data);
    } catch {
      playErrorTone();
      setResult({ state: "invalid", query });
    } finally {
      submitting.current = false;
    }
  }, [gate]);

  useEffect(() => {
    if (!gate) return;
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (cancelled) return;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        tick();
      } catch {
        setCameraError("Camera unavailable. Use manual entry below.");
      }
    }

    function tick() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code?.data && code.data !== lastSubmit.current) {
            lastSubmit.current = code.data;
            submit(code.data);
            setTimeout(() => { lastSubmit.current = ""; }, 3000);
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    start();
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [gate, submit]);

  const reset = () => setResult({ state: "idle" });

  if (!gateLoaded) return null;
  if (!gate) return <GateSetup onSet={setAndStoreGate} />;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between text-xs font-bold">
        <span>
          {gate} · {stewardName}
          <button
            onClick={clearGate}
            className="ml-2 font-semibold text-mutefg underline decoration-dotted hover:text-gold"
          >
            Change gate
          </button>
        </span>
        <span className="rounded-full border border-ink px-2.5 py-1 text-[10px] uppercase tracking-wider">{scanCount} scanned</span>
      </div>

      {result.state === "idle" && (
        <div className="overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-lg">
          <div className="relative aspect-square overflow-hidden bg-ink">
            <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
            <canvas ref={canvasRef} className="hidden" />
            <div className="pointer-events-none absolute inset-8 rounded-2xl border-2 border-gold" />
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/90 p-4 text-center text-xs text-white">
                {cameraError}
              </div>
            )}
          </div>
          <div className="p-3 text-xs text-mutefg">Point at the QR code…</div>
        </div>
      )}

      {result.state === "granted" && (
        <div className="animate-scale-in overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-lg">
          <div className="bg-gold p-5">
            <div className="font-display text-xl font-extrabold">Access granted</div>
          </div>
          <div className="space-y-2 p-5">
            <div className="placeholder-fill h-14 w-14 rounded-full border border-line" />
            <div className="text-base font-bold">{result.attendee.fullName}</div>
            <p className="text-xs leading-relaxed text-bodyfg">
              {result.attendee.ticketId}
              <br />
              {result.attendee.school} · {result.attendee.level} · {result.attendee.department}
              <br />
              General admission
            </p>
            <p className="text-xs text-mutefg">
              Checked in {new Date(result.time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} · {result.gate}
            </p>
            <Button full onClick={reset}>Scan next</Button>
          </div>
        </div>
      )}

      {result.state === "already" && (
        <div className="animate-scale-in overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-lg">
          <div className="bg-ink p-5 text-white">
            <div className="font-display text-xl font-extrabold">Already checked in</div>
          </div>
          <div className="space-y-2 p-5">
            <div className="text-base font-bold">{result.attendee.fullName}</div>
            <p className="text-xs leading-relaxed text-bodyfg">
              First scanned {result.firstScannedAt ? new Date(result.firstScannedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "earlier"}
              {result.firstGate ? ` at ${result.firstGate}` : ""}
              {result.firstSteward ? ` by ${result.firstSteward}.` : "."}
            </p>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => submit(result.attendee.ticketId, true)}>Override</Button>
              <Button tone="onDark" onClick={reset}>Scan next</Button>
            </div>
          </div>
        </div>
      )}

      {result.state === "crew" && (
        <div className="animate-scale-in overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-lg">
          <div className="bg-ink p-5 text-white">
            <div className="font-display text-xl font-extrabold">Crew access granted</div>
          </div>
          <div className="space-y-2 p-5">
            <div className="placeholder-fill h-14 w-14 rounded-full border border-line" />
            <div className="text-base font-bold">{result.volunteer.fullName}</div>
            <p className="text-xs leading-relaxed text-bodyfg">
              {result.volunteer.crewId}
              <br />
              {result.volunteer.role}
              <br />
              D-GEM crew
            </p>
            <p className="text-xs text-mutefg">
              Scanned {new Date(result.time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} · {result.gate}
            </p>
            <Button full onClick={reset}>Scan next</Button>
          </div>
        </div>
      )}

      {result.state === "crew_already" && (
        <div className="animate-scale-in overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-lg">
          <div className="bg-mist p-5">
            <div className="font-display text-xl font-extrabold">Crew badge already scanned</div>
          </div>
          <div className="space-y-2 p-5">
            <div className="text-base font-bold">{result.volunteer.fullName}</div>
            <p className="text-xs leading-relaxed text-bodyfg">
              {result.volunteer.role}
              <br />
              First scanned {result.firstScannedAt ? new Date(result.firstScannedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "earlier"}
              {result.firstGate ? ` at ${result.firstGate}.` : "."}
            </p>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => submit(result.volunteer.crewId, true)}>Override</Button>
              <Button onClick={reset}>Scan next</Button>
            </div>
          </div>
        </div>
      )}

      {result.state === "invalid" && (
        <div className="animate-scale-in overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-lg">
          <div className="bg-mist p-5">
            <div className="font-display text-xl font-extrabold">Not recognised</div>
          </div>
          <div className="space-y-3 p-5">
            <p className="text-xs leading-relaxed text-bodyfg">
              This code isn&apos;t in the register. Search by name, email or phone to check.
            </p>
            <input
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="Search attendees"
              className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none"
            />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => submit(manual)}>Search / check in</Button>
              <a href="/register" target="_blank" rel="noreferrer" className="group inline-flex items-center justify-center gap-2 rounded-full border border-ink px-5 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors hover:bg-ink hover:text-white">
                Register at gate
                <ArrowRightIcon className="h-3.5 w-3.5 text-gold transition-transform duration-150 group-hover:translate-x-0.5" />
              </a>
              <Button onClick={reset}>Scan next</Button>
            </div>
          </div>
        </div>
      )}

      {result.state === "idle" && (
        <div className="rounded-2xl border border-line p-3">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-mutefg">
            Enter ID manually
          </div>
          <div className="flex gap-2">
            <input
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="Ticket ID, email or phone"
              className="h-10 flex-1 rounded-lg border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none"
            />
            <Button onClick={() => submit(manual)}>Go</Button>
          </div>
        </div>
      )}
    </div>
  );
}
