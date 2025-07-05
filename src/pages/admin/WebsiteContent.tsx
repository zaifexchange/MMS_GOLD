import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save, Edit, Plus, Trash2, Eye, Globe } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const WebsiteContent = () => {
  const [activeTab, setActiveTab] = useState('homepage');
  const [content, setContent] = useState({
    homepage: {
      hero_title: 'MMS Gold',
      hero_subtitle: 'Your all-in-all gold trading platform with AI-powered solutions',
      hero_description: 'Trade gold with institutional-grade tools, real-time data, and advanced analytics.',
      features: []
    },
    about: {
      mission: '',
      vision: '',
      values: []
    },
    services: {
      trading: '',
      deposits: '',
      ai_trading: ''
    },
    contact: {
      email: 'support@mmsgold.com',
      phone: '+1 (555) 123-4567',
      address: '123 Gold Street, Financial District'
    }
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .in('key', ['homepage_content', 'about_content', 'services_content', 'contact_content']);

      if (error) throw error;

      if (data) {
        const contentMap = {};
        data.forEach(item => {
          const key = item.key.replace('_content', '');
          contentMap[key] = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
        });
        setContent(prev => ({ ...prev, ...contentMap }));
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(content).map(([key, value]) => ({
        key: `${key}_content`,
        value: JSON.stringify(value),
        description: `${key.charAt(0).toUpperCase() + key.slice(1)} page content`
      }));

      for (const update of updates) {
        await supabase
          .from('system_settings')
          .upsert(update, { onConflict: 'key' });
      }

      alert('Content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const updateContent = (section: string, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'homepage', label: 'Homepage', icon: Globe },
    { id: 'about', label: 'About Us', icon: Edit },
    { id: 'services', label: 'Services', icon: Plus },
    { id: 'contact', label: 'Contact', icon: Eye }
  ];

  const renderHomepageEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
        <input
          type="text"
          value={content.homepage.hero_title}
          onChange={(e) => updateContent('homepage', 'hero_title', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
        <input
          type="text"
          value={content.homepage.hero_subtitle}
          onChange={(e) => updateContent('homepage', 'hero_subtitle', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hero Description</label>
        <textarea
          rows={4}
          value={content.homepage.hero_description}
          onChange={(e) => updateContent('homepage', 'hero_description', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Live Preview</h4>
        <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            {content.homepage.hero_title}
          </h1>
          <p className="text-xl mb-4">{content.homepage.hero_subtitle}</p>
          <p className="text-gray-300">{content.homepage.hero_description}</p>
        </div>
      </div>
    </div>
  );

  const renderAboutEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement</label>
        <textarea
          rows={4}
          value={content.about.mission}
          onChange={(e) => updateContent('about', 'mission', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
          placeholder="Enter your company mission..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Vision Statement</label>
        <textarea
          rows={4}
          value={content.about.vision}
          onChange={(e) => updateContent('about', 'vision', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
          placeholder="Enter your company vision..."
        />
      </div>
    </div>
  );

  const renderServicesEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Trading Services</label>
        <textarea
          rows={4}
          value={content.services.trading}
          onChange={(e) => updateContent('services', 'trading', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
          placeholder="Describe your trading services..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fixed Deposits</label>
        <textarea
          rows={4}
          value={content.services.deposits}
          onChange={(e) => updateContent('services', 'deposits', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
          placeholder="Describe your fixed deposit services..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">AI Trading</label>
        <textarea
          rows={4}
          value={content.services.ai_trading}
          onChange={(e) => updateContent('services', 'ai_trading', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
          placeholder="Describe your AI trading services..."
        />
      </div>
    </div>
  );

  const renderContactEditor = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={content.contact.email}
            onChange={(e) => updateContent('contact', 'email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={content.contact.phone}
            onChange={(e) => updateContent('contact', 'phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          rows={3}
          value={content.contact.address}
          onChange={(e) => updateContent('contact', 'address', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
        />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'homepage':
        return renderHomepageEditor();
      case 'about':
        return renderAboutEditor();
      case 'services':
        return renderServicesEditor();
      case 'contact':
        return renderContactEditor();
      default:
        return renderHomepageEditor();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Website Content Management</h1>
            <p className="text-gray-600 mt-2">Edit and manage your website content</p>
          </div>
          <button
            onClick={saveContent}
            disabled={saving}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-yellow-600 border-b-2 border-yellow-600 bg-yellow-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-8">
            {loading ? (
              <div className="flex justify-center items-center h-64">Loading...</div>
            ) : (
              renderContent()
            )}
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">SEO Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="MMS Gold - Professional Gold Trading Platform"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="gold trading, forex, investment, XAU/USD"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Professional gold trading platform with AI-powered tools and real-time market data..."
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default WebsiteContent;