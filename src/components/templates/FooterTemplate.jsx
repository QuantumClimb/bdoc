/**
 * FooterTemplate Component
 * Glass-effect footer with copyright information
 * Pixel-perfect match to 4-HeaderFooter.html
 */

export function FooterTemplate() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-12 bg-white/80 dark:bg-dark/80 backdrop-blur-md border-t border-gray-300 dark:border-gray-700 z-40 transition-colors">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Copyright */}
        <p className="text-xs text-gray-600 dark:text-gray-400">
          © {currentYear} BDoc by BAuraTech. All rights reserved.
        </p>

        {/* Version & Links */}
        <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
          <span>Version 2.1.0</span>
          <span className="text-gray-400 dark:text-gray-600">|</span>
          <a href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <span className="text-gray-400 dark:text-gray-600">|</span>
          <a href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </a>
          <span className="text-gray-400 dark:text-gray-600">|</span>
          <a href="#" className="hover:text-primary transition-colors">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}

export default FooterTemplate;
