"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Button } from "@/components/Button";

type Result =
  | { state: "idle" }
  | { state: "granted"; attendee: { fullName: string; ticketId: string; school: string; level: string; department: string }; gate: string; time: string }
  | { state: "already"; attendee: { fullName: string; ticketId: string }; firstScannedAt: string | null; firstGate: string | null; firstSteward: string | null }
  | { state: "invalid"; query?: string };

export function ScannerClient({ gate, stewardName }: { gate: string; stewardName: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [result, setResult] = useState<Result>({ state: "idle" });
  const [manual, setManual] = useState("");
  const [scanCount, setScanCount] = useState(0);
  const lastSubmit = useRef<string>("");
  const submitting = useRef(false);

  const submit = useCallback(async (query: string, override = false) => {
    if (submitting.current || !query) return;
    submitting.current = true;
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, gate, override }),
      });
      const data = await res.json();
      if (data.state === "granted" || data.state === "already") setScanCount((c) => c + 1);
      setResult(data.state === "invalid" ? { state: "invalid", query } : data);
    } catch {
      setResult({ state: "invalid", query });
    } finally {
      submitting.current = false;
    }
  }, [gate]);

  useEffect(() => {
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
        setCameraError("Camera unavailable — use manual entry below.");
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
  }, [submit]);

  const reset = () => setResult({ state: "idle" });

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between text-xs font-bold">
        <span>{gate} · {stewardName}</span>
        <span className="border border-ink px-2 py-1 text-[10px] uppercase tracking-wider">{scanCount} scanned</span>
      </div>

      {result.state === "idle" && (
        <div className="border-2 border-ink bg-white">
          <div className="relative aspect-square overflow-hidden bg-ink">
            <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
            <canvas ref={canvasRef} className="hidden" />
            <div className="pointer-events-none absolute inset-8 border-2 border-gold" />
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
        <div className="border-2 border-ink bg-white">
          <div className="bg-gold p-5">
            <div className="font-display text-xl font-extrabold">Access granted</div>
          </div>
          <div className="space-y-2 p-5">
            <div className="placeholder-fill h-14 w-14 border border-line" />
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
        <div className="border-2 border-ink bg-white">
          <div className="bg-ink p-5 text-white">
            <div className="font-display text-xl font-extrabold">Already checked in</div>
          </div>
          <div className="space-y-2 p-5">
            <div className="text-base font-bold">{result.attendee.fullName}</div>
            <p className="text-xs leading-relaxed text-bodyfg">
              First scanned {result.firstScannedAt ? new Date(result.firstScannedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "—"}
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

      {result.state === "invalid" && (
        <div className="border-2 border-ink bg-white">
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
              className="h-10 w-full border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none"
            />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => submit(manual)}>Search / check in</Button>
              <a href="/register" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center border border-ink px-5 py-3 text-[11px] font-bold uppercase tracking-wider hover:bg-ink hover:text-white">
                Register at gate
              </a>
              <Button onClick={reset}>Scan next</Button>
            </div>
          </div>
        </div>
      )}

      {result.state === "idle" && (
        <div className="border border-line p-3">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-mutefg">
            Enter ID manually
          </div>
          <div className="flex gap-2">
            <input
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="Ticket ID, email or phone"
              className="h-10 flex-1 border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none"
            />
            <Button onClick={() => submit(manual)}>Go</Button>
          </div>
        </div>
      )}
    </div>
  );
}
