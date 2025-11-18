/**
 * NavbarTemplate Component
 * Glass-effect header with navigation icons and user profile
 * Pixel-perfect match to 4-HeaderFooter.html
 */

import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export function NavbarTemplate({ 
  user, 
  activePage = 'dashboard',
  onNavigate,
  onDownload,
  onUpload,
  onSearch,
  onUndo,
  onRedo
}) {
  const { isDark, toggleTheme } = useTheme();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
  const navItems = [
    { id: 'dashboard', icon: 'bi-house-door', label: 'Dashboard', path: '/dashboard' },
    { id: 'documents', icon: 'bi-file-earmark-text', label: 'Documents', path: '/documents' }
  ];

  const actionItems = [
    { id: 'undo', icon: 'bi-arrow-counterclockwise', label: 'Undo', onClick: onUndo },
    { id: 'redo', icon: 'bi-arrow-clockwise', label: 'Redo', onClick: onRedo },
    { id: 'upload', icon: 'bi-upload', label: 'Upload', onClick: onUpload },
    { id: 'download', icon: 'bi-download', label: 'Download', onClick: onDownload }
  ];

  const handleSearchToggle = () => {
    setSearchExpanded(!searchExpanded);
    if (searchExpanded) {
      setSearchValue('');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchValue.trim()) {
      onSearch(searchValue);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#2a363b] border-b border-gray-300 dark:border-gray-700 z-50 transition-colors" style={isDark ? {backgroundColor: '#2a363b'} : {}}>
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Section: Logo + Navigation + Actions */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <img src={isDark ? "/logo_dark.png" : "/logo_light.png"} alt="BDoc Logo" className="h-8" />
          
          {/* Navigation Icons */}
          <nav className="flex items-center space-x-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.path)}
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                  activePage === item.id 
                    ? 'text-primary bg-primary/10' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-darker'
                }`}
                title={item.label}
              >
                <i className={`${item.icon} text-xl`}></i>
              </button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pl-3 border-l border-gray-300 dark:border-gray-700">
            {actionItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-darker border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-200 dark:hover:bg-dark hover:border-primary transition-all group"
                title={item.label}
              >
                <i className={`${item.icon} text-lg group-hover:icon-glow`}></i>
              </button>
            ))}

            {/* Search with expandable input */}
            <div className="relative flex items-center">
              <button
                onClick={handleSearchToggle}
                className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-darker border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-200 dark:hover:bg-dark hover:border-primary transition-all group z-10"
                title="Search"
              >
                <i className="bi-search text-lg group-hover:icon-glow"></i>
              </button>
              
              {/* Expandable Search Input */}
              <form
                onSubmit={handleSearchSubmit}
                className={`absolute left-0 transition-all duration-300 ${
                  searchExpanded ? 'w-64 opacity-100' : 'w-9 opacity-0 pointer-events-none'
                }`}
              >
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search..."
                  className={`w-full h-9 pl-11 pr-3 rounded-lg bg-gray-100 dark:bg-darker border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:border-primary transition-all ${
                    searchExpanded ? '' : 'pointer-events-none'
                  }`}
                  autoFocus={searchExpanded}
                />
              </form>
            </div>
          </div>
        </div>

        {/* Right Section: Theme + Settings + Avatar */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-darker border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-200 dark:hover:bg-dark hover:border-primary transition-all group"
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            <i className={`${isDark ? 'bi-sun' : 'bi-moon'} text-lg group-hover:icon-glow`}></i>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => onNavigate('/settings')}
            className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-darker border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-200 dark:hover:bg-dark hover:border-primary transition-all group"
            title="Settings"
          >
            <i className="bi-gear text-lg group-hover:icon-glow"></i>
          </button>

          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center ml-2">
            <span className="text-darker font-bold text-lg">
              {user?.firstLetter || 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavbarTemplate;
