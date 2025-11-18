/**
 * MainLayout Component
 * Wraps authenticated pages with NavbarTemplate and FooterTemplate
 * Provides consistent layout structure across Dashboard, Documents, and Settings pages
 */

import { NavbarTemplate } from "../templates/NavbarTemplate";
import { FooterTemplate } from "../templates/FooterTemplate";

export function MainLayout({ 
  children,
  user,
  activePage,
  onNavigate,
  onUpload,
  onRedo,
  onUndo,
  onDownload,
  onSearch,
  onLogout,
  onSettings
}) {
  return (
    <div className="min-h-screen bg-light dark:bg-darker overflow-x-hidden transition-colors">
      <NavbarTemplate
        user={user}
        activePage={activePage}
        onNavigate={onNavigate}
        onUpload={onUpload}
        onRedo={onRedo}
        onUndo={onUndo}
        onDownload={onDownload}
        onSearch={onSearch}
        onLogout={onLogout}
        onSettings={onSettings}
      />
      <main className="pt-20 pb-12 min-h-screen">
        <div className={`${activePage === 'documents' || activePage === 'dashboard' ? 'w-full px-6' : 'max-w-[1400px] mx-auto px-6'} py-6`}>
          {children}
        </div>
      </main>
      <FooterTemplate />
    </div>
  );
}

export default MainLayout;
