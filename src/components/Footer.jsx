import { ShieldCheck } from 'lucide-react';
import { brand } from '../config/brand.js';

export default function Footer() {
  return (
    <footer className="mt-10 bg-deep text-white">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-8">
        <section id="privacy" aria-labelledby="privacy-title" className="rounded-xl bg-primary p-4">
          <h2 id="privacy-title" className="flex items-center gap-2 font-semibold text-gold-light">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" /> Privacy notice
          </h2>
          <p className="mt-2 text-sm text-muted">
            Your photograph and details are processed only inside your own browser to create the card. Nothing is uploaded to a server,
            nothing is saved in a database, and no tracking tools are used. When you reset the form or close the page, the photograph is cleared from memory.
          </p>
          <p className="mt-2 text-sm text-muted">
            This is a self-generated digital card. It is not an official verification of membership.
          </p>
        </section>
        <p className="text-center text-xs text-muted">© {new Date().getFullYear()} {brand.name}. {brand.tagline}</p>
      </div>
    </footer>
  );
}
