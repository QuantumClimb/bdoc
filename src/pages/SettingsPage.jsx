/**
 * SettingsPage Component
 * Settings page with sidebar navigation
 * Pixel-perfect match to 2-Settings.html
 */

import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const { isDark } = useTheme();

  const navItems = [
    { id: 'profile', label: 'Profile Settings', icon: 'bi-person' },
    { id: 'account', label: 'Account & Security', icon: 'bi-shield-lock' },
    { id: 'preferences', label: 'Preferences', icon: 'bi-sliders' },
    { id: 'notifications', label: 'Notifications', icon: 'bi-bell' },
    { id: 'system', label: 'System Settings', icon: 'bi-gear' },
    { id: 'billing', label: 'Billing', icon: 'bi-credit-card' },
    { id: 'integrations', label: 'Integrations', icon: 'bi-plugin' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6 -mt-3">
        <h1 className="text-3xl font-bold text-[#2a363b] dark:text-white">Settings</h1>
      </div>

      {/* Grid Layout: Sidebar + Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white dark:bg-dark rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-300 dark:border-gray-700" style={isDark ? {backgroundColor: '#2a363b'} : {}}>
              <h3 className="text-[#2a363b] dark:text-white font-semibold text-sm uppercase tracking-wider">Navigation</h3>
            </div>
            <nav className="p-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all ${
                    activeSection === item.id
                      ? 'bg-primary/10 border-l-3 text-primary'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  style={activeSection === item.id ? { borderLeft: '3px solid #FBCC5F' } : {}}
                >
                  <i className={`bi ${item.icon} text-lg`}></i>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="col-span-12 lg:col-span-9">
          {activeSection === 'profile' && <ProfileSection />}
          {activeSection === 'account' && <AccountSection />}
          {activeSection === 'preferences' && <PreferencesSection />}
          {activeSection === 'notifications' && <NotificationsSection />}
          {activeSection === 'system' && <SystemSection />}
          {activeSection === 'billing' && <BillingSection />}
          {activeSection === 'integrations' && <IntegrationsSection />}
        </div>
      </div>
    </div>
  );
}

function ProfileSection() {
  return (
    <div className="bg-white dark:bg-dark rounded-xl border border-gray-300 dark:border-gray-700 p-8 mb-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#2a363b] dark:text-white mb-2">Profile Settings</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Update your personal information and profile picture</p>
        </div>
        <button className="bg-primary hover:bg-yellow-400 text-[#2a363b] px-6 py-2 rounded-lg font-semibold transition-all">
          Save Changes
        </button>
      </div>

      {/* Profile Picture */}
      <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-300 dark:border-gray-700">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <i className="bi bi-person-fill text-5xl text-gray-400 dark:text-gray-500"></i>
          </div>
          <button className="absolute bottom-0 right-0 bg-primary hover:bg-yellow-400 text-[#2a363b] w-8 h-8 rounded-lg flex items-center justify-center transition-all">
            <i className="bi bi-camera text-sm"></i>
          </button>
        </div>
        <div>
          <h3 className="text-[#2a363b] dark:text-white font-semibold text-lg mb-1">Profile Picture</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">JPG, PNG or GIF. Max size 2MB</p>
          <div className="flex space-x-3">
            <button className="text-primary hover:text-yellow-400 text-sm font-medium transition-colors">Upload New</button>
            <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">Remove</button>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">First Name</label>
          <input 
            type="text" 
            defaultValue="Admin" 
            className="w-full bg-gray-50 dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-[#2a363b] dark:text-white focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">Last Name</label>
          <input 
            type="text" 
            defaultValue="User" 
            className="w-full bg-gray-50 dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-[#2a363b] dark:text-white focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">Email Address</label>
          <input 
            type="email" 
            defaultValue="admin@bauratech.com" 
            className="w-full bg-gray-50 dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-[#2a363b] dark:text-white focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">Phone Number</label>
          <input 
            type="tel" 
            defaultValue="+1 234 567 8900" 
            className="w-full bg-gray-50 dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-[#2a363b] dark:text-white focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">Job Title</label>
          <input 
            type="text" 
            defaultValue="System Administrator" 
            className="w-full bg-gray-50 dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-[#2a363b] dark:text-white focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">Department</label>
          <select className="w-full bg-gray-50 dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-[#2a363b] dark:text-white focus:border-primary focus:outline-none transition-colors">
            <option>IT Department</option>
            <option>Finance</option>
            <option>Operations</option>
            <option>Management</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">Bio</label>
          <textarea 
            rows={4}
            className="w-full bg-gray-50 dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-[#2a363b] dark:text-white focus:border-primary focus:outline-none transition-colors" 
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>
    </div>
  );
}

function AccountSection() {
  return (
    <div className="bg-white dark:bg-dark rounded-xl border border-gray-300 dark:border-gray-700 p-8 mb-6">
      <h2 className="text-2xl font-bold text-[#2a363b] dark:text-white mb-6">Account & Security</h2>
      
      <div className="space-y-6">
        <div className="pb-6 border-b border-gray-300 dark:border-gray-700">
          <h3 className="text-[#2a363b] dark:text-white font-semibold mb-4">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">Current Password</label>
              <input 
                type="password" 
                className="w-full bg-gray-50 dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-[#2a363b] dark:text-white focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">New Password</label>
              <input 
                type="password" 
                className="w-full bg-gray-50 dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-[#2a363b] dark:text-white focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">Confirm New Password</label>
              <input 
                type="password" 
                className="w-full bg-gray-50 dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-[#2a363b] dark:text-white focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <button className="bg-primary hover:bg-yellow-400 text-[#2a363b] px-6 py-2 rounded-lg font-semibold transition-all">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreferencesSection() {
  return (
    <div className="bg-white dark:bg-dark rounded-xl border border-gray-300 dark:border-gray-700 p-8 mb-6">
      <h2 className="text-2xl font-bold text-[#2a363b] dark:text-white mb-6">Preferences</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">Language</label>
          <select className="w-full bg-gray-50 dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-[#2a363b] dark:text-white focus:border-primary focus:outline-none transition-colors">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">Timezone</label>
          <select className="w-full bg-gray-50 dark:bg-darker border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-[#2a363b] dark:text-white focus:border-primary focus:outline-none transition-colors">
            <option>UTC-05:00 (Eastern Time)</option>
            <option>UTC-06:00 (Central Time)</option>
            <option>UTC-07:00 (Mountain Time)</option>
            <option>UTC-08:00 (Pacific Time)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function NotificationsSection() {
  const notifications = [
    { label: 'Email notifications', description: 'Receive email updates about your documents' },
    { label: 'Push notifications', description: 'Get push notifications in your browser' },
    { label: 'Document approvals', description: 'Notify when documents need approval' },
    { label: 'Weekly summary', description: 'Receive weekly activity summaries' }
  ];

  return (
    <div className="bg-white dark:bg-dark rounded-xl border border-gray-300 dark:border-gray-700 p-8 mb-6">
      <h2 className="text-2xl font-bold text-[#2a363b] dark:text-white mb-6">Notification Preferences</h2>
      
      <div className="space-y-4">
        {notifications.map((item, index) => (
          <div key={`notification-${index}`} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-darker rounded-lg">
            <div>
              <p className="text-[#2a363b] dark:text-white font-medium">{item.label}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function SystemSection() {
  return (
    <div className="bg-white dark:bg-dark rounded-xl border border-gray-300 dark:border-gray-700 p-8 mb-6">
      <h2 className="text-2xl font-bold text-[#2a363b] dark:text-white mb-6">System Settings</h2>
      <p className="text-gray-600 dark:text-gray-400">System configuration options will be displayed here.</p>
    </div>
  );
}

function BillingSection() {
  return (
    <div className="bg-white dark:bg-dark rounded-xl border border-gray-300 dark:border-gray-700 p-8 mb-6">
      <h2 className="text-2xl font-bold text-[#2a363b] dark:text-white mb-6">Billing</h2>
      <p className="text-gray-600 dark:text-gray-400">Billing and subscription information will be displayed here.</p>
    </div>
  );
}

function IntegrationsSection() {
  return (
    <div className="bg-white dark:bg-dark rounded-xl border border-gray-300 dark:border-gray-700 p-8 mb-6">
      <h2 className="text-2xl font-bold text-[#2a363b] dark:text-white mb-6">Integrations</h2>
      <p className="text-gray-600 dark:text-gray-400">Third-party integrations and API settings will be displayed here.</p>
    </div>
  );
}

export default SettingsPage;
