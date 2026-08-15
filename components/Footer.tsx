export default function Footer() {
  return (
    <footer className="no-print border-t border-white/5 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-white/40 font-body">
        <p>
          Genexis is a screening &amp; awareness tool, not a diagnostic device. It does not
          replace professional medical advice.
        </p>
        <p className="font-mono text-xs text-white/30">v1.0 · built on the Genexis SDD</p>
      </div>
    </footer>
  );
}
