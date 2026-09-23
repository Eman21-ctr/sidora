import { WhatsAppMessage, DailyAnalytics } from '../types';

/**
 * Mendapatkan tanggal hari ini dalam format YYYY-MM-DD sesuai waktu lokal pengguna
 */
export function getTodayDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format tanggal YYYY-MM-DD ke Bahasa Indonesia (misal: "23 September 2026")
 */
export function formatIndoDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return dateStr;
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format tanggal ringkas (misal: "23 Sep")
 */
export function formatShortIndoDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return dateStr;
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Menghitung tren analitik 7 hari terakhir secara REAL-TIME dari array pesan WhatsApp riil.
 * Menghilangkan data dummy/bawaan dan menjamin angka 100% konsisten dengan log pesan Supabase.
 */
export function computeRealDailyAnalytics(
  messages: WhatsAppMessage[],
  referenceDateStr: string = getTodayDateStr()
): DailyAnalytics[] {
  const result: DailyAnalytics[] = [];
  const [refYear, refMonth, refDay] = referenceDateStr.split('-').map(Number);
  const baseDate = new Date(refYear, refMonth - 1, refDay);

  for (let i = 6; i >= 0; i--) {
    const targetDate = new Date(baseDate);
    targetDate.setDate(baseDate.getDate() - i);

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    const label = targetDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });

    // Cari pesan-pesan yang jatuh pada tanggal ini
    const dayMsgs = messages.filter((m) => {
      const rawDate = m.sentAt || m.scheduledAt || '';
      const msgDateKey = rawDate.slice(0, 10);
      return msgDateKey === dateKey;
    });

    const totalSent = dayMsgs.filter((m) => m.status !== 'queued').length;
    const delivered = dayMsgs.filter((m) => ['delivered', 'read', 'replied'].includes(m.status)).length;
    const read = dayMsgs.filter((m) => ['read', 'replied'].includes(m.status)).length;
    const replied = dayMsgs.filter((m) => m.status === 'replied').length;
    const failed = dayMsgs.filter((m) => m.status === 'failed').length;

    const kategoriObat = dayMsgs.filter((m) => m.category === 'minum_obat').length;
    const kategoriKontrol = dayMsgs.filter((m) => m.category === 'kontrol_dokter').length;
    const kategoriIter = dayMsgs.filter((m) => m.category === 'iter_resep').length;

    result.push({
      date: label,
      totalSent,
      delivered,
      read,
      replied,
      failed,
      kategoriObat,
      kategoriKontrol,
      kategoriIter,
    });
  }

  return result;
}
