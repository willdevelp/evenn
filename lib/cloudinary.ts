/**
 * Téléversement d'images vers Cloudinary (upload non signé).
 *
 * Utilisé pour la couverture d'un événement et le logo d'une organisation.
 * Le `upload_preset` doit être configuré côté Cloudinary en mode « unsigned ».
 */
export const CLOUDINARY_UPLOAD_PRESET = "evenn_upload";

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    throw new Error(
      "Cloudinary n'est pas configuré (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME manquant).",
    );
  }

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body },
  );

  if (!response.ok) {
    throw new Error("Échec du téléchargement de l'image.");
  }

  const data = (await response.json()) as { secure_url?: string };
  if (!data.secure_url) {
    throw new Error("Cloudinary n'a pas renvoyé d'URL d'image.");
  }

  return data.secure_url;
}
