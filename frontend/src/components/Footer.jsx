import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ExternalLink, Mail } from 'lucide-react';

const links = {
  Platform: [
    { label: 'All Schemes', to: '/schemes' },
    { label: 'Eligibility Calculator', to: '/calculator' },
    { label: 'Policy News', to: '/news' },
    { label: 'Document Vault', to: '/vault' },
  ],
  Account: [
    { label: 'Register', to: '/register' },
    { label: 'Sign In', to: '/login' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Profile', to: '/profile' },
  ],
  Official: [
    { label: 'India.gov.in', href: 'https://india.gov.in' },
    { label: 'MyScheme Portal', href: 'https://myscheme.gov.in' },
    { label: 'NSP Scholarships', href: 'https://scholarships.gov.in' },
    { label: 'Startup India', href: 'https://startupindia.gov.in' },
  ],
};

const Footer = () => (
  <footer className="bg-[#020617] border-t border-white/5 py-16 px-4 mt-auto">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-4 group">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl purple-glow group-hover:scale-110 transition-transform">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-black text-xl text-white">SmartGov Assist</span>
          </Link>
          <p className="text-slate-500 font-medium leading-relaxed max-w-xs mb-6">
            AI-powered sovereign platform connecting citizens to government welfare schemes across India and the world.
          </p>
          <div className="flex items-center gap-2 text-slate-600 text-sm font-bold">
            <Mail className="w-4 h-4" />
            support@smartgov.in
          </div>
        </div>

        {/* Link Groups */}
        {Object.entries(links).map(([group, items]) => (
          <div key={group}>
            <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-6">{group}</h4>
            <ul className="space-y-3">
              {items.map(item => (
                <li key={item.label}>
                  {item.to ? (
                    <Link to={item.to} className="text-slate-500 hover:text-white font-medium text-sm transition-colors flex items-center gap-2 group">
                      {item.label}
                    </Link>
                  ) : (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white font-medium text-sm transition-colors flex items-center gap-2 group">
                      {item.label}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-700 text-sm font-medium">
          © 2026 SmartGov Assist. Built for citizens of India. Data sourced from official government portals.
        </p>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-widest bg-primary/5 border border-primary/10 px-4 py-2 rounded-full">
            AES-256 Encrypted
          </span>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-widest bg-white/5 border border-white/5 px-4 py-2 rounded-full">
            DPDP Act Compliant
          </span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
