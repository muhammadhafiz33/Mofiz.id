import { X, ShieldCheck, Info } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div 
        className="max-w-xl w-full rounded-2xl border bg-gray-950 p-6 text-left shadow-2xl relative max-h-[85vh] overflow-y-auto"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-xl border border-white/5 hover:border-white/20 transition-all"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Privacy Notice</h3>
            <p className="text-xs text-gray-400 font-mono">Analytics & Location Privacy Policy</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-gray-300 leading-relaxed font-sans">
          <p>
            Website portfolio Hafiz.dev menggunakan sistem analytics internal sederhana untuk memahami preferensi pengunjung dan mengoptimalkan pengalaman pengguna.
          </p>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-1.5 text-xs font-mono">
              <Info size={14} className="text-blue-400" />
              Data Analytics yang Dicatat:
            </h4>
            <ul className="list-disc list-inside text-gray-400 space-y-1 pl-1">
              <li>Anonymous Session ID (tanpa identitas pribadi)</li>
              <li>Tipe Browser & Sistem Operasi</li>
              <li>Perangkat (Desktop, Mobile, Tablet)</li>
              <li>Halaman yang dikunjungi & Referrer</li>
              <li>Anonymized IP & Estimated IP Location (Negara, Kota perkiraan, ISP)</li>
            </ul>
          </div>

          <div className="border border-blue-500/20 bg-blue-500/5 p-3.5 rounded-xl space-y-2">
            <h4 className="font-semibold text-blue-300 text-xs font-mono">Kebijakan Browser GPS Location:</h4>
            <p className="text-blue-200/90 font-mono italic text-[11px]">
              "Browser GPS location is collected only after you explicitly grant location permission through your browser."
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 text-[11px]">
              <li>Estimated IP Location <strong>BUKAN</strong> data GPS akurat.</li>
              <li>Data GPS presisi hanya didapatkan jika Anda menekan <em>"Allow Location"</em>.</li>
              <li>Anda berhak penuh menolak akses lokasi. Website tetap berfungsi 100% normal jika akses lokasi ditolak.</li>
              <li>Akurasi GPS dapat berbeda-beda tergantung perangkat dan sinyal GPS.</li>
              <li>Website ini <strong>TIDAK PERNAH</strong> menyimpan nama lengkap, nomor telepon, atau alamat pribadi Anda.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
