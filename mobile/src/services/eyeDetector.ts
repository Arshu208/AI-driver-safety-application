import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import { createDetector, FaceLandmarksDetector, SupportedModels } from '@tensorflow-models/face-landmarks-detection';
import { toByteArray } from 'base64-js';

export type EyeDetection = {
  faceDetected: boolean;
  eyesClosed: boolean;
  landmarkCount: number;
};

let detector: FaceLandmarksDetector | null = null;
let detectorPromise: Promise<FaceLandmarksDetector> | null = null;

export async function initializeEyeDetector() {
  if (detector) return detector;
  if (detectorPromise) return detectorPromise;

  detectorPromise = (async () => {
    await tf.ready();
    if (tf.getBackend() !== 'cpu') {
      await tf.setBackend('cpu');
      await tf.ready();
    }

    const nextDetector = await createDetector(SupportedModels.MediaPipeFaceMesh, {
      runtime: 'tfjs',
      maxFaces: 1,
      refineLandmarks: true,
    });
    detector = nextDetector;
    return nextDetector;
  })();

  try {
    return await detectorPromise;
  } catch (error) {
    detectorPromise = null;
    throw error;
  }
}

function distance(first: { x: number; y: number }, second: { x: number; y: number }) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function eyeAspectRatio(
  keypoints: Array<{ x: number; y: number }>,
  horizontal: [number, number],
  upper: [number, number],
  lower: [number, number],
) {
  const width = distance(keypoints[horizontal[0]], keypoints[horizontal[1]]);
  const heightOne = distance(keypoints[upper[0]], keypoints[lower[0]]);
  const heightTwo = distance(keypoints[upper[1]], keypoints[lower[1]]);
  return width > 0 ? (heightOne + heightTwo) / (2 * width) : 1;
}

export async function detectEyesFromImage(base64Image: string): Promise<EyeDetection> {
  const activeDetector = await initializeEyeDetector();
  const imageBytes = toByteArray(base64Image);
  const imageTensor = decodeJpeg(imageBytes, 3);

  try {
    const faces = await activeDetector.estimateFaces(imageTensor, {
      flipHorizontal: true,
      staticImageMode: false,
    });

    const face = faces[0];
    if (!face) {
      return { faceDetected: false, eyesClosed: false, landmarkCount: 0 };
    }

    const keypoints = face.keypoints;
    const leftRatio = eyeAspectRatio(keypoints, [33, 133], [160, 158], [144, 153]);
    const rightRatio = eyeAspectRatio(keypoints, [362, 263], [385, 387], [380, 373]);
    const eyesClosed = leftRatio < 0.22 && rightRatio < 0.22;

    return { faceDetected: true, eyesClosed, landmarkCount: keypoints.length };
  } finally {
    imageTensor.dispose();
  }
}

export function disposeEyeDetector() {
  detector?.dispose();
  detector = null;
  detectorPromise = null;
}
