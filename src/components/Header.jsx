import { brand } from '../config/brand.js';
import Logo from './Logo.jsx';

export default function Header() {
  return (
    <header className="bg-deep text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-3">
          {brand.logoUrl ? <img src={brand.logoUrl} alt="" className="h-12 w-12 object-contain" /> : <Logo size={48} />}
          <div>
            <p className="font-serif text-lg font-bold uppercase tracking-widest text-gold-light">{brand.name}</p>
            <p className="text-xs tracking-widest text-muted">{brand.tagline}</p>
          </div>
        </div>
        <nav aria-label="Page sections" className="flex gap-2 text-sm font-semibold">
          <a href="#create" className="inline-flex min-h-[44px] items-center rounded-lg px-3 text-gold-light">Create card</a>
          <a href="#privacy" className="inline-flex min-h-[44px] items-center rounded-lg px-3 text-gold-light">Privacy</a>
        </nav>
      </div>
      <div className="bg-primary">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="font-serif text-2xl font-bold leading-tight sm:text-4xl">{brand.appTitle}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
            Enter your details, add your photograph, check the live preview and download your membership card as a high-quality PNG image.
            It takes about one minute.
          </p>
        </div>
      </div>
    </header>
  );
}
