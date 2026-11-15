"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { createContest } from "@/lib/actions/votes/create-contest";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

type CandidateDraft = {
  key: number;
  name: string;
  number: string;
  bio: string;
  photo: File | null;
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function localDateTimeToIso(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("Date de concours invalide.");
  return date.toISOString();
}

export default function ContestCreateForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [pricePerVote, setPricePerVote] = useState("100");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [candidates, setCandidates] = useState<CandidateDraft[]>([
    { key: 1, name: "", number: "", bio: "", photo: null },
  ]);
  const [uploading, setUploading] = useState(false);

  const validateImage = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      throw new Error("Formats autorisés : JPG, PNG ou WEBP.");
    }
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error("Chaque image doit faire 10 Mo maximum.");
    }
  };

  const selectImage = (
    file: File | undefined,
    onValid: (file: File) => void,
  ) => {
    if (!file) return;
    try {
      validateImage(file);
      onValid(file);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image invalide.");
    }
  };

  const updateCandidate = (key: number, patch: Partial<CandidateDraft>) => {
    setCandidates((items) =>
      items.map((candidate) => (candidate.key === key ? { ...candidate, ...patch } : candidate)),
    );
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (candidates.length === 0 || candidates.some((candidate) => !candidate.name.trim())) {
      toast.error("Ajoutez au moins un candidat et renseignez son nom.");
      return;
    }
    const numbers = candidates
      .map((candidate) => candidate.number.trim())
      .filter(Boolean);
    if (new Set(numbers).size !== numbers.length) {
      toast.error("Chaque numéro de candidat doit être unique.");
      return;
    }

    startTransition(async () => {
      setUploading(true);
      try {
        const coverUrl = coverPhoto ? await uploadImageToCloudinary(coverPhoto) : null;
        const candidateData = await Promise.all(
          candidates.map(async (candidate) => ({
            name: candidate.name.trim(),
            number: candidate.number ? Number(candidate.number) : null,
            bio: candidate.bio.trim() || null,
            photoUrl: candidate.photo ? await uploadImageToCloudinary(candidate.photo) : null,
          })),
        );
        await createContest({
          title,
          description: description.trim() || null,
          coverUrl,
          rules: rules.trim() || null,
          pricePerVote: Number(pricePerVote),
          startsAt: localDateTimeToIso(startsAt),
          endsAt: localDateTimeToIso(endsAt),
          status,
          candidates: candidateData,
        });
        toast.success(status === "published" ? "Concours publié." : "Brouillon de concours enregistré.");
        router.push("/dashboard/contests");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Impossible de créer le concours.");
      } finally {
        setUploading(false);
      }
    });
  };

  const busy = isPending || uploading;

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Informations du concours</h2>
          <p className="mt-1 text-sm text-slate-500">Le prix est défini par vote, sans packs.</p>
        </div>
        <label className="block text-sm font-medium text-slate-700">
          Nom du concours
          <input required minLength={3} maxLength={160} value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Description
          <textarea maxLength={5000} rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Prix par vote (XAF)
            <input required type="number" min={1} step={1} value={pricePerVote} onChange={(e) => setPricePerVote(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Publication
            <select value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100">
              <option value="published">Publier maintenant</option>
              <option value="draft">Enregistrer en brouillon</option>
            </select>
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Début des votes
            <input required type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Fin des votes
            <input required type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" />
          </label>
        </div>
        <label className="block text-sm font-medium text-slate-700">
          Règlement
          <textarea maxLength={10000} rows={4} value={rules} onChange={(e) => setRules(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" />
        </label>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-700">
          <ImagePlus className="size-5 text-brand-600" />
          <span>{coverPhoto ? coverPhoto.name : "Photo de couverture du concours"}</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => selectImage(e.target.files?.[0], setCoverPhoto)} />
        </label>
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Candidats et photos</h2>
            <p className="mt-1 text-sm text-slate-500">Les candidats ajoutés seront visibles dès la publication.</p>
          </div>
          <button type="button" onClick={() => setCandidates((items) => [...items, { key: Date.now(), name: "", number: "", bio: "", photo: null }])} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Plus className="size-4" /> Ajouter un candidat
          </button>
        </div>
        <div className="space-y-4">
          {candidates.map((candidate, index) => (
            <article key={candidate.key} className="rounded-xl border border-slate-200 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Candidat {index + 1}</h3>
                {candidates.length > 1 ? (
                  <button type="button" aria-label={`Supprimer le candidat ${index + 1}`} onClick={() => setCandidates((items) => items.filter((item) => item.key !== candidate.key))} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="size-4" />
                  </button>
                ) : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
                <label className="block text-sm font-medium text-slate-700">
                  Nom
                  <input required maxLength={120} value={candidate.name} onChange={(e) => updateCandidate(candidate.key, { name: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Numéro (facultatif)
                  <input type="number" min={1} max={9999} value={candidate.number} onChange={(e) => updateCandidate(candidate.key, { number: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" />
                </label>
              </div>
              <label className="mt-4 block text-sm font-medium text-slate-700">
                Présentation
                <textarea maxLength={2000} rows={2} value={candidate.bio} onChange={(e) => updateCandidate(candidate.key, { bio: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" />
              </label>
              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 p-3 text-sm text-slate-700">
                <Upload className="size-4 text-brand-600" />
                <span>{candidate.photo ? candidate.photo.name : "Choisir la photo du candidat (JPG, PNG, WEBP · 10 Mo max)"}</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => selectImage(e.target.files?.[0], (photo) => updateCandidate(candidate.key, { photo }))} />
              </label>
            </article>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
          {busy ? "Enregistrement..." : status === "published" ? "Créer et publier" : "Enregistrer le brouillon"}
        </button>
      </div>
    </form>
  );
}
