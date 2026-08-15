import { FacialAgeResult, FacialSignal } from "./types";

/**
 * Runs real pretrained neural networks client-side via TensorFlow.js
 * (@vladmandic/face-api, MIT licensed, weights vendored into
 * /public/models — https://github.com/vladmandic/face-api):
 *
 *  - TinyFaceDetector — face bounding-box detection
 *  - AgeGenderNet — age regression + gender classification
 *  - FaceExpressionNet — 7-class expression classification
 *  - FaceLandmark68Net — 68-point facial landmark localization
 *
 * All four are genuine trained-network outputs. What's NOT a trained
 * network: the two "wellness signal" numbers below (under-eye darkness,
 * skin texture roughness). Those are honest pixel-statistics heuristics —
 * average brightness and edge-gradient magnitude computed inside regions
 * that the *real* landmark model located — not a dermatology-grade
 * classifier. They're surfaced as general wellness cues with that
 * limitation stated, never as a diagnosis.
 */

let modelsLoaded = false;
let loadingPromise: Promise<void> | null = null;

async function ensureModelsLoaded() {
  if (modelsLoaded) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const faceapi = await import("@vladmandic/face-api");
    const MODEL_URL = "/models";
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
  })();

  return loadingPromise;
}

export class NoFaceDetectedError extends Error {
  constructor() {
    super("No face was detected in the uploaded image.");
    this.name = "NoFaceDetectedError";
  }
}

interface Point {
  x: number;
  y: number;
}

/** Draws the image at its natural resolution and returns pixel data + dims. */
function rasterize(imageElement: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  canvas.width = imageElement.naturalWidth || imageElement.width;
  canvas.height = imageElement.naturalHeight || imageElement.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  return { ctx, width: canvas.width, height: canvas.height };
}

function clampBox(x: number, y: number, w: number, h: number, maxW: number, maxH: number) {
  const cx = Math.max(0, Math.min(x, maxW - 1));
  const cy = Math.max(0, Math.min(y, maxH - 1));
  const cw = Math.max(1, Math.min(w, maxW - cx));
  const ch = Math.max(1, Math.min(h, maxH - cy));
  return { x: Math.round(cx), y: Math.round(cy), w: Math.round(cw), h: Math.round(ch) };
}

/** Average grayscale brightness (0-255) within a box. */
function regionBrightness(ctx: CanvasRenderingContext2D, box: { x: number; y: number; w: number; h: number }) {
  const { data } = ctx.getImageData(box.x, box.y, box.w, box.h);
  let sum = 0;
  const count = box.w * box.h;
  for (let i = 0; i < data.length; i += 4) {
    sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  return sum / count;
}

/** Average local gradient magnitude (texture/edge density proxy) within a box. */
function regionEdgeDensity(ctx: CanvasRenderingContext2D, box: { x: number; y: number; w: number; h: number }) {
  if (box.w < 3 || box.h < 3) return 0;
  const { data, width, height } = ctx.getImageData(box.x, box.y, box.w, box.h);
  const gray = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    gray[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
  }
  let sum = 0;
  let count = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const gx = gray[idx + 1] - gray[idx - 1];
      const gy = gray[idx + width] - gray[idx - width];
      sum += Math.sqrt(gx * gx + gy * gy);
      count++;
    }
  }
  return count > 0 ? sum / count : 0;
}

function boxFromPoints(points: Point[], padX: number, padY: number) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs) - padX;
  const maxX = Math.max(...xs) + padX;
  const minY = Math.min(...ys) - padY;
  const maxY = Math.max(...ys) + padY;
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

/**
 * Computes the two pixel-heuristic wellness signals using real 68-point
 * landmark positions to locate the regions. iBUG 68-point indices:
 * right eye 36-41, left eye 42-47, jaw 0-16, eyebrows 17-26.
 */
function computeSignals(
  ctx: CanvasRenderingContext2D,
  imgWidth: number,
  imgHeight: number,
  landmarks: Point[]
): FacialSignal {
  const rightEye = landmarks.slice(36, 42);
  const leftEye = landmarks.slice(42, 48);
  const eyeBox = boxFromPoints([...rightEye, ...leftEye], 4, 2);
  const eyeHeight = eyeBox.h;

  const underEyeBox = clampBox(eyeBox.x, eyeBox.y + eyeHeight * 1.1, eyeBox.w, eyeHeight * 0.9, imgWidth, imgHeight);
  const cheekBox = clampBox(eyeBox.x, eyeBox.y + eyeHeight * 2.6, eyeBox.w, eyeHeight * 1.2, imgWidth, imgHeight);

  const underEyeBrightness = regionBrightness(ctx, underEyeBox);
  const cheekBrightness = regionBrightness(ctx, cheekBox);
  const underEyeDarknessIndex = Math.max(0, Math.min(1, (cheekBrightness - underEyeBrightness) / 60));

  const brows = landmarks.slice(17, 27);
  const browBox = boxFromPoints(brows, 6, 0);
  const foreheadBox = clampBox(
    browBox.x,
    Math.max(0, browBox.y - browBox.h * 2.2),
    browBox.w,
    browBox.h * 1.6,
    imgWidth,
    imgHeight
  );
  const foreheadTexture = regionEdgeDensity(ctx, foreheadBox);
  const cheekTexture = regionEdgeDensity(ctx, cheekBox);
  const avgTexture = (foreheadTexture + cheekTexture) / 2;
  const skinTextureIndex = Math.max(0, Math.min(1, (avgTexture - 6) / 20));

  return {
    underEyeDarknessIndex: Math.round(underEyeDarknessIndex * 100) / 100,
    skinTextureIndex: Math.round(skinTextureIndex * 100) / 100,
  };
}

export async function estimateFacialAge(imageElement: HTMLImageElement): Promise<FacialAgeResult> {
  if (typeof window === "undefined") {
    throw new Error("estimateFacialAge can only run in the browser.");
  }

  await ensureModelsLoaded();
  const faceapi = await import("@vladmandic/face-api");

  const detection = await faceapi
    .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions({ inputSize: 320 }))
    .withFaceLandmarks()
    .withFaceExpressions()
    .withAgeAndGender();

  if (!detection) {
    throw new NoFaceDetectedError();
  }

  let signals: FacialSignal | null = null;
  try {
    const raster = rasterize(imageElement);
    if (raster) {
      const points = detection.landmarks.positions as Point[];
      signals = computeSignals(raster.ctx, raster.width, raster.height, points);
    }
  } catch (e) {
    console.warn("Facial signal computation failed:", e);
  }

  const expressions = detection.expressions as unknown as Record<string, number>;
  const topExpression = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0];

  return {
    estimatedAge: Math.round(detection.age * 10) / 10,
    estimatedGender: detection.gender as "male" | "female",
    genderProbability: Math.round(detection.genderProbability * 100) / 100,
    detectionConfidence: Math.round(detection.detection.score * 100) / 100,
    expression: topExpression ? topExpression[0] : null,
    expressionProbability: topExpression ? Math.round(topExpression[1] * 100) / 100 : null,
    signals,
    modelSource:
      "@vladmandic/face-api — TinyFaceDetector + AgeGenderNet + FaceExpressionNet + FaceLandmark68Net (TensorFlow.js, on-device)",
  };
}

export function isModelReady() {
  return modelsLoaded;
}

export function preloadModels() {
  if (typeof window !== "undefined") {
    void ensureModelsLoaded();
  }
}
