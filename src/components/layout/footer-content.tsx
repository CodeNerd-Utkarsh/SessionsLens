
"use client";

import { useState, useEffect } from 'react';

export function FooterContent() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  if (currentYear === null) {
    return <p>&copy; SessionLens. All rights reserved.</p>;
  }

  return <p>&copy; {currentYear} SessionLens. All rights reserved.</p>;
}
