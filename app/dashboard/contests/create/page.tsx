import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DashboardShell from "@/src/components/dashboard/DashboardShell";
import ContestCreateForm from "./contest-create-form";

export const dynamic = "force-dynamic";

export default function CreateContestPage() {
  return (
    <DashboardShell
      title="Créer un concours"
      description="Ajoutez les informations, définissez le prix du vote et présentez vos candidats."
      action={
        <Link
          href="/dashboard/contests"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="size-4" /> Mes concours
        </Link>
      }
    >
      <ContestCreateForm />
    </DashboardShell>
  );
}
