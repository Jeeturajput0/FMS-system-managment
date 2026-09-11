import ImageKit from "imagekit";

const requiredVariables = [
  "IMAGEKIT_PUBLIC_KEY",
  "IMAGEKIT_PRIVATE_KEY",
  "IMAGEKIT_URL_ENDPOINT",
];

let imagekit;

export const getImageKit = () => {
  const missingVariables = requiredVariables.filter((name) => !process.env[name]);
  if (missingVariables.length) {
    throw new Error(
      `ImageKit is not configured. Missing: ${missingVariables.join(", ")}`,
    );
  }

  if (!imagekit) {
    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }

  return imagekit;
};
