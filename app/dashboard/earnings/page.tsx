"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ---------------------------------------------------------
   HELPER FUNCTION GOES HERE
--------------------------------------------------------- */
async function isImageBlurry(file: File): Promise<boolean> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  ctx.drawImage(bitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let sharpness = 0;

  for (let i = 0; i < data.length - 4; i += 4) {
    const diff =
      Math.abs(data[i] - data[i + 4]) +
      Math.abs(data[i + 1] - data[i + 5]) +
      Math.abs(data[i + 2] - data[i + 6]);

    sharpness += diff;
  }

  const threshold = 5000000;
  return sharpness < threshold;
}
export default function TripEarningsPage() {
  // component logic here
}


/* ---------------------------------------------------------
   HELPER: Detect Blurry Images (MVP-friendly)
--------------------------------------------------------- */
async function isImageBlurry(file: File): Promise<boolean> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  ctx.drawImage(bitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let sharpness = 0;

  // Simple edge detection (MVP-friendly)
  for (let i = 0; i < data.length - 4; i += 4) {
    const diff =
      Math.abs(data[i] - data[i + 4]) +
      Math.abs(data[i + 1] - data[i + 5]) +
      Math.abs(data[i + 2] - data[i + 6]);

    sharpness += diff;
  }

  // Threshold — adjust if needed
  const threshold = 5000000;

  return sharpness < threshold;
}

/* ---------------------------------------------------------
   PAGE COMPONENT
--------------------------------------------------------- */
export default function TripEarningsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<any>(null);
  const [expandedTrip, setExpandedTrip] = useState<number | null>(null);

  /* ---------------------------------------------------------
     FETCH EARNINGS
  --------------------------------------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchEarnings() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/earnings/tr
