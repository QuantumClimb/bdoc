/**
 * SettingsPage Component
 * Settings page with 5 tabs
 * Pixel-perfect match to 6-Settings Page.html
 */

import { useState } from 'react';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'bi-person' },
    { id: 'notifications', label: 'Notifications', icon: 'bi-bell' },
    { id: 'security', label: 'Security', icon: 'bi-shield-check' },
    { id: 'preferences', label: 'Preferences', icon: 'bi-sliders' },
    { id: 'about', label: 'About', icon: 'bi-info-circle' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account and application preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            <i className={`${tab.icon}`}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-dark border border-gray-300 dark:border-gray-700 rounded-xl p-6">
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'preferences' && <PreferencesTab />}
        {activeTab === 'about' && <AboutTab />}
      </div>
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
              <input
                type="text"
                defaultValue="John"
                className="w-full px-4 py-2.5 bg-darker border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
              <input
                type="text"
                defaultValue="Doe"
                className="w-full px-4 py-2.5 bg-darker border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              defaultValue="john.doe@example.com"
              className="w-full px-4 py-2.5 bg-darker border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
            <input
              type="text"
              defaultValue="Administrator"
              disabled
              className="w-full px-4 py-2.5 bg-darker border border-gray-700 rounded-lg text-gray-500"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
        <button className="px-6 py-2.5 bg-darker border border-gray-700 text-gray-300 rounded-lg hover:border-primary hover:text-primary transition-all">
          Cancel
        </button>
        <button className="px-6 py-2.5 bg-primary text-darker font-semibold rounded-lg hover:bg-primary-600 transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          {[
            { label: 'Email notifications', description: 'Receive email updates about your documents' },
            { label: 'Push notifications', description: 'Get push notifications in your browser' },
            { label: 'Document approvals', description: 'Notify when documents need approval' },
            { label: 'Weekly summary', description: 'Receive weekly activity summaries' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-darker rounded-lg">
              <div>
                <p className="text-white font-medium">{item.label}</p>
                <p className="text-gray-400 text-sm mt-1">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Security Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              className="w-full px-4 py-2.5 bg-darker border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-2.5 bg-darker border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full px-4 py-2.5 bg-darker border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
        <button className="px-6 py-2.5 bg-primary text-darker font-semibold rounded-lg hover:bg-primary-600 transition-all">
          Update Password
        </button>
      </div>
    </div>
  );
}

function PreferencesTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Application Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
            <select className="w-full px-4 py-2.5 bg-darker border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
            <select className="w-full px-4 py-2.5 bg-darker border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary">
              <option>UTC-05:00 (Eastern Time)</option>
              <option>UTC-06:00 (Central Time)</option>
              <option>UTC-08:00 (Pacific Time)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date Format</label>
            <select className="w-full px-4 py-2.5 bg-darker border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
        <button className="px-6 py-2.5 bg-primary text-darker font-semibold rounded-lg hover:bg-primary-600 transition-all">
          Save Preferences
        </button>
      </div>
    </div>
  );
}

function AboutTab() {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-24 h-24 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <i className="bi bi-file-earmark-text text-darker text-5xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">BDoc</h2>
        <p className="text-gray-400 mb-1">Document Management System</p>
        <p className="text-primary font-semibold mb-6">Version 2.1.0</p>
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/20 border border-green-500 rounded-full text-green-400 text-sm font-medium">
          <i className="bi bi-check-circle-fill"></i>
          <span>Up to date</span>
        </div>
      </div>
      <div className="space-y-4 pt-6 border-t border-gray-700">
        <div className="flex items-center justify-between p-4 bg-darker rounded-lg">
          <span className="text-gray-300">License</span>
          <span className="text-white font-medium">Enterprise</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-darker rounded-lg">
          <span className="text-gray-300">Developer</span>
          <span className="text-white font-medium">BAuraTech</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-darker rounded-lg">
          <span className="text-gray-300">Support</span>
          <a href="#" className="text-primary hover:text-primary-600 font-medium">support@bauratech.com</a>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
