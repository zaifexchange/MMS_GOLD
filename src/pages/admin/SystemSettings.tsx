import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save, Settings, Database, Shield, Globe, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    platform_name: 'MMS Gold',
    maintenance_mode: false,
    max_leverage: 100,
    min_deposit: 100,
    withdrawal_fee: 0,
    trading_enabled: true,
    registration_enabled: true,
    kyc_required: true,
    fixed_deposit_rates: {
      '3_month': 6,
      '6_month': 8,
      '1_year': 10
    },
    referral_rates: {
      level_1: 10,
      level_2: 3,
      level_3: 2
    },
    gold_price: 2045.32,
    platform_fee: 0.1
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');

      if (error) throw error;

      if (data) {
        const settingsMap = {};
        data.forEach(item => {
          try {
            settingsMap[item.key] = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
          } catch {
            settingsMap[item.key] = item.value;
          }
        });
        setSettings(prev => ({ ...prev, ...settingsMap }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        description: getSettingDescription(key)
      }));

      for (const update of updates) {
        await supabase
          .from('system_settings')
          .upsert(update, { onConflict: 'key' });
      }

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const getSettingDescription = (key: string) => {
    const descriptions = {
      platform_name: 'Platform display name',
      maintenance_mode: 'Enable/disable maintenance mode',
      max_leverage: 'Maximum leverage allowed',
      min_deposit: 'Minimum deposit amount',
      withdrawal_fee: 'Withdrawal fee percentage',
      trading_enabled: 'Enable/disable trading functionality',
      registration_enabled: 'Enable/disable new user registration',
      kyc_required: 'Require KYC verification for new users',
      fixed_deposit_rates: 'Fixed deposit interest rates',
      referral_rates: 'Referral commission rates',
      gold_price: 'Current gold price for demo',
      platform_fee: 'Platform trading fee percentage'
    };
    return descriptions[key] || `${key} setting`;
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNestedSetting = (parent: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value
      }
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600 mt-2">Configure platform settings and parameters</p>
          </div>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Settings className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">General Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
              <input
                type="text"
                value={settings.platform_name}
                onChange={(e) => updateSetting('platform_name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Gold Price</label>
              <input
                type="number"
                step="0.01"
                value={settings.gold_price}
                onChange={(e) => updateSetting('gold_price', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="maintenance_mode"
                checked={settings.maintenance_mode}
                onChange={(e) => updateSetting('maintenance_mode', e.target.checked)}
                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <label htmlFor="maintenance_mode" className="text-sm font-medium text-gray-700">
                Maintenance Mode
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="trading_enabled"
                checked={settings.trading_enabled}
                onChange={(e) => updateSetting('trading_enabled', e.target.checked)}
                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <label htmlFor="trading_enabled" className="text-sm font-medium text-gray-700">
                Trading Enabled
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="registration_enabled"
                checked={settings.registration_enabled}
                onChange={(e) => updateSetting('registration_enabled', e.target.checked)}
                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <label htmlFor="registration_enabled" className="text-sm font-medium text-gray-700">
                Registration Enabled
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="kyc_required"
                checked={settings.kyc_required}
                onChange={(e) => updateSetting('kyc_required', e.target.checked)}
                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <label htmlFor="kyc_required" className="text-sm font-medium text-gray-700">
                KYC Required
              </label>
            </div>
          </div>
        </div>

        {/* Trading Settings */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-2 mb-6">
            <DollarSign className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">Trading Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Leverage</label>
              <input
                type="number"
                value={settings.max_leverage}
                onChange={(e) => updateSetting('max_leverage', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Deposit ($)</label>
              <input
                type="number"
                value={settings.min_deposit}
                onChange={(e) => updateSetting('min_deposit', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform Fee (%)</label>
              <input
                type="number"
                step="0.01"
                value={settings.platform_fee}
                onChange={(e) => updateSetting('platform_fee', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>

        {/* Fixed Deposit Rates */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Database className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-900">Fixed Deposit Rates</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">3 Month Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.fixed_deposit_rates['3_month']}
                onChange={(e) => updateNestedSetting('fixed_deposit_rates', '3_month', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">6 Month Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.fixed_deposit_rates['6_month']}
                onChange={(e) => updateNestedSetting('fixed_deposit_rates', '6_month', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">1 Year Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.fixed_deposit_rates['1_year']}
                onChange={(e) => updateNestedSetting('fixed_deposit_rates', '1_year', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>

        {/* Referral Rates */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Globe className="h-6 w-6 text-orange-600" />
            <h3 className="text-xl font-bold text-gray-900">Referral Commission Rates</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level 1 (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.referral_rates.level_1}
                onChange={(e) => updateNestedSetting('referral_rates', 'level_1', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level 2 (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.referral_rates.level_2}
                onChange={(e) => updateNestedSetting('referral_rates', 'level_2', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level 3 (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.referral_rates.level_3}
                onChange={(e) => updateNestedSetting('referral_rates', 'level_3', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="h-6 w-6 text-red-600" />
            <h3 className="text-xl font-bold text-gray-900">Security Settings</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-2">⚠️ Maintenance Mode</h4>
              <p className="text-red-800 text-sm">
                When enabled, the platform will show a maintenance page to all users except administrators.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">🔒 Security Features</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• SSL encryption enabled</li>
                <li>• Two-factor authentication available</li>
                <li>• Regular security audits</li>
                <li>• Secure password requirements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemSettings;