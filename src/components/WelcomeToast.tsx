"use client";

import { useEffect, useState } from "react";

export default function WelcomeToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("welcomeMsg");
      if (!raw) return;
      setMessage(raw);
      // remove it so it doesn't show again
      localStorage.removeItem("welcomeMsg");

      // auto-dismiss
      const t = setTimeout(() => setMessage(null), 3500);
      return () => clearTimeout(t);
    } catch (e) {
      // ignore
    }
  }, []);

  if (!message) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="pointer-events-auto bg-gradient-to-r from-accent-gold to-yellow-400 text-primary-dark px-6 py-3 rounded-full shadow-xl font-semibold">
        {message}
      </div>
    </div>
  );
}
