// app/dashboard/events/[id]/participants/page.js
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  CalendarDays,
  Ticket,
  Users,
  Calendar,
  Settings,
  LayoutDashboard,
  LogOut,
  BarChart3,
  ArrowRight,
  Search,
  Download,
  Mail,
  CheckCircle,
  XCircle,
  DollarSign,
  QrCode,
  Filter,
  ChevronDown,
  Trash2,
  Eye,
  X,
} from 'lucide-react';

type Participant = {
  id: number;
  name: string;
  email: string;
  ticketType: string;
  paid: boolean;
  qrValidated: boolean;
  phone: string;
};

// Mock data for participants
const mockParticipants: Participant[] = [
  { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com', ticketType: 'VIP', paid: true, qrValidated: true, phone: '+237 6XX XX XX' },
  { id: 2, name: 'Marie Koffi', email: 'marie.koffi@email.com', ticketType: 'Standard', paid: true, qrValidated: false, phone: '+237 6XX XX XX' },
  { id: 3, name: 'Pierre Ngono', email: 'pierre.ngono@email.com', ticketType: 'Standard', paid: false, qrValidated: true, phone: '+237 6XX XX XX' },
  { id: 4, name: 'Anne Essomba', email: 'anne.essomba@email.com', ticketType: 'VIP', paid: true, qrValidated: true, phone: '+237 6XX XX XX' },
  { id: 5, name: 'Luc Mballa', email: 'luc.mballa@email.com', ticketType: 'Étudiant', paid: true, qrValidated: false, phone: '+237 6XX XX XX' },
  { id: 6, name: 'Sophie Ngo', email: 'sophie.ngo@email.com', ticketType: 'Standard', paid: false, qrValidated: false, phone: '+237 6XX XX XX' },
  { id: 7, name: 'David Tchou', email: 'david.tchou@email.com', ticketType: 'VIP', paid: true, qrValidated: true, phone: '+237 6XX XX XX' },
  { id: 8, name: 'Céline Abomo', email: 'celine.abomo@email.com', ticketType: 'Étudiant', paid: true, qrValidated: true, phone: '+237 6XX XX XX' },
];

export default function ParticipantsPage() {
  const params = useParams<{ id?: string }>();
  const eventId = params.id ?? 'unknown';

  const [participants] = useState<Participant[]>(mockParticipants);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailRecipients, setEmailRecipients] = useState<string[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [filterPaid, setFilterPaid] = useState('all');
  const [filterValidated, setFilterValidated] = useState('all');

  // Filter participants
  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || p.ticketType === filterType;
    const matchesPaid = filterPaid === 'all' || (filterPaid === 'paid' ? p.paid : !p.paid);
    const matchesValidated = filterValidated === 'all' || (filterValidated === 'validated' ? p.qrValidated : !p.qrValidated);
    return matchesSearch && matchesType && matchesPaid && matchesValidated;
  });

  // Toggle selection
  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredParticipants.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredParticipants.map(p => p.id));
    }
  };

  // Export to Excel (CSV)
  const exportToExcel = () => {
    const headers = ['Nom', 'Email', 'Type billet', 'Payé', 'QR Code validé', 'Téléphone'];
    const rows = participants.map(p => [
      p.name,
      p.email,
      p.ticketType,
      p.paid ? 'Oui' : 'Non',
      p.qrValidated ? 'Oui' : 'Non',
      p.phone,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `participants_${eventId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Send email to selected or all
  const openEmailModal = () => {
    if (selectedIds.length === 0) {
      // If none selected, send to all filtered
      const allEmails = filteredParticipants.map(p => p.email);
      setEmailRecipients(allEmails);
    } else {
      const selectedEmails = participants
        .filter(p => selectedIds.includes(p.id))
        .map(p => p.email);
      setEmailRecipients(selectedEmails);
    }
    setShowEmailModal(true);
  };

  const sendEmails = () => {
    // Simulate sending email
    alert(`Email envoyé à ${emailRecipients.length} participant(s)\nSujet: ${emailSubject}\n\n${emailBody}`);
    setShowEmailModal(false);
    setEmailSubject('');
    setEmailBody('');
  };

  // Quick email to a single participant
  const sendSingleEmail = (participant: Participant) => {
    setEmailRecipients([participant.email]);
    setEmailSubject(`Information sur votre billet - ${participant.ticketType}`);
    setEmailBody(`Bonjour ${participant.name},\n\nNous vous remercions pour votre achat. Voici les détails de votre billet...`);
    setShowEmailModal(true);
  };

  return (
    <main className="font-sans antialiased bg-gray-50/50 text-gray-900 min-h-screen flex">

      {/* ===== SIDEBAR ===== */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0">
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="text-2xl font-extrabold text-[#2563EB] flex items-center gap-2">
            <CalendarDays size={28} /> Evenza
          </Link>
          <p className="text-xs text-gray-400 mt-1">Tableau de bord</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition">
            <LayoutDashboard size={20} /> Vue d&apos;ensemble
          </Link>
          <Link href="/dashboard/events" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition">
            <Calendar size={20} /> Mes événements
          </Link>
          <Link href={`/dashboard/events/${eventId}/tickets`} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition">
            <Ticket size={20} /> Billets
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 bg-[#2563EB]/10 text-[#2563EB] rounded-xl font-medium">
            <Users size={20} /> Participants
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition">
            <BarChart3 size={20} /> Statistiques
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition">
            <Settings size={20} /> Paramètres
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition">
            <LogOut size={20} /> Déconnexion
          </Link>
        </div>
      </aside>

      {/* ===== CONTENU PRINCIPAL ===== */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link href={`/dashboard/events/${eventId}`} className="text-gray-400 hover:text-gray-600 transition">
                <ArrowRight size={20} className="rotate-180" />
              </Link>
              <h1 className="text-xl font-bold text-gray-800">Participants</h1>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Événement : <span className="font-medium text-gray-700">Concert Afro Night</span>
              <span className="ml-3 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{participants.length} participants</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToExcel}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
            >
              <Download size={18} /> Exporter Excel
            </button>
            <button
              onClick={openEmailModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-xl text-sm font-semibold shadow-lg shadow-[#2563EB]/25 hover:shadow-[#2563EB]/40 hover:bg-[#1d4ed8] transition"
            >
              <Mail size={18} /> Envoyer email
              {selectedIds.length > 0 && (
                <span className="bg-white/20 text-xs rounded-full px-2 py-0.5">{selectedIds.length}</span>
              )}
            </button>
          </div>
        </header>

        {/* Filters & Search */}
        <div className="px-6 pt-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un participant..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition bg-white"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                <Filter size={16} /> Type <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 min-w-[160px] hidden group-hover:block z-20">
                {['all', 'VIP', 'Standard', 'Étudiant'].map(type => (
                  <label key={type} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer text-sm">
                    <input type="radio" name="typeFilter" value={type} checked={filterType === type} onChange={() => setFilterType(type)} />
                    {type === 'all' ? 'Tous' : type}
                  </label>
                ))}
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                <DollarSign size={16} /> Payé <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 min-w-[140px] hidden group-hover:block z-20">
                {['all', 'paid', 'unpaid'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer text-sm">
                    <input type="radio" name="paidFilter" value={opt} checked={filterPaid === opt} onChange={() => setFilterPaid(opt)} />
                    {opt === 'all' ? 'Tous' : opt === 'paid' ? 'Payé' : 'Non payé'}
                  </label>
                ))}
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                <QrCode size={16} /> QR Code <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 min-w-[140px] hidden group-hover:block z-20">
                {['all', 'validated', 'notvalidated'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer text-sm">
                    <input type="radio" name="validatedFilter" value={opt} checked={filterValidated === opt} onChange={() => setFilterValidated(opt)} />
                    {opt === 'all' ? 'Tous' : opt === 'validated' ? 'Validé' : 'Non validé'}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterPaid('all');
                setFilterValidated('all');
              }}
              className="text-sm text-[#2563EB] font-medium hover:underline"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="p-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredParticipants.length && filteredParticipants.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]/20"
                    />
                  </th>
                  <th className="px-6 py-4">Nom</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Type billet</th>
                  <th className="px-6 py-4">Payé</th>
                  <th className="px-6 py-4">QR Code</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredParticipants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                      Aucun participant trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredParticipants.map((participant) => (
                    <tr key={participant.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(participant.id)}
                          onChange={() => toggleSelect(participant.id)}
                          className="rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]/20"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] font-medium text-sm">
                            {participant.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-800">{participant.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{participant.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                          {participant.ticketType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {participant.paid ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-medium">
                            <CheckCircle size={14} /> Payé
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium">
                            <XCircle size={14} /> Non payé
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {participant.qrValidated ? (
                          <span className="inline-flex items-center gap-1 text-[#2563EB] bg-[#2563EB]/10 px-2 py-1 rounded-full text-xs font-medium">
                            <CheckCircle size={14} /> Validé
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                            <XCircle size={14} /> En attente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => sendSingleEmail(participant)}
                            className="p-2 text-gray-400 hover:text-[#2563EB] hover:bg-[#2563EB]/10 rounded-xl transition"
                            title="Envoyer un email"
                          >
                            <Mail size={18} />
                          </button>
                          <button
                            className="p-2 text-gray-400 hover:text-[#2563EB] hover:bg-[#2563EB]/10 rounded-xl transition"
                            title="Voir détails"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination (simulée) */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {filteredParticipants.length} participant(s) sur {participants.length}
            </p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition">Précédent</button>
              <button className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-sm font-semibold shadow-md shadow-[#2563EB]/20">1</button>
              <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition">2</button>
              <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition">Suivant</button>
            </div>
          </div>
        </div>

        {/* Modal d'envoi d'email */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Mail size={24} className="text-[#2563EB]" /> Envoyer un email
                </h3>
                <button onClick={() => setShowEmailModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Destinataires : {emailRecipients.length} participant(s)
                <span className="block text-xs text-gray-400 truncate">{emailRecipients.join(', ')}</span>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition"
                    placeholder="Sujet de l'email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition resize-y"
                    placeholder="Votre message..."
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={sendEmails}
                  className="px-5 py-2 bg-[#2563EB] text-white rounded-xl text-sm font-semibold shadow-lg shadow-[#2563EB]/25 hover:shadow-[#2563EB]/50 hover:bg-[#1d4ed8] transition flex items-center gap-2"
                >
                  <Mail size={18} /> Envoyer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-4 px-6 text-center text-sm text-gray-400 mt-8">
          © 2026 Evenza. Tous droits réservés.
        </footer>
      </div>
    </main>
  );
}