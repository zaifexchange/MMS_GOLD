import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Shield, Camera, Save, Edit, Upload } from 'lucide-react';
import { supabase, KYCDocument } from '../../lib/supabase';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    date_of_birth: user?.date_of_birth || '',
    nationality: user?.nationality || '',
    occupation: user?.occupation || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        date_of_birth: user.date_of_birth || '',
        nationality: user.nationality || '',
        occupation: user.occupation || ''
      });
      fetchKYCDocuments();
    }
  }, [user]);

  const fetchKYCDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('user_id', user?.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setKycDocuments(data || []);
    } catch (error) {
      console.error('Error fetching KYC documents:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentType}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(fileName);

      // Save document record
      const { error: dbError } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: user.id,
          document_type: documentType,
          document_url: publicUrl,
          status: 'pending'
        });

      if (dbError) throw dbError;

      alert('Document uploaded successfully!');
      fetchKYCDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document');
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-8 text-black">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
              <span className="text-yellow-500 font-bold text-3xl">
                {user?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">{user?.full_name}</h2>
            <p className="text-lg opacity-90">{user?.email}</p>
            <div className="flex items-center space-x-4 mt-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user?.kyc_status === 'approved' 
                  ? 'bg-green-100 text-green-800' 
                  : user?.kyc_status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                KYC: {user?.kyc_status?.charAt(0).toUpperCase() + user?.kyc_status?.slice(1)}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {user?.role === 'admin' ? 'Administrator' : 'Client'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={loading}
              className="flex items-center space-x-2 bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50"
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              <span>{loading ? 'Saving...' : isEditing ? 'Save' : 'Edit'}</span>
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{formData.full_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address
                </label>
                <p className="text-gray-900 font-medium">{formData.email}</p>
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{formData.phone || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{formData.date_of_birth || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                Address
              </label>
              {isEditing ? (
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 font-medium">{formData.address || 'Not provided'}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{formData.nationality || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{formData.occupation || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* KYC Verification */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">KYC Verification</h3>
          </div>

          <div className="space-y-4">
            {kycDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{doc.document_type}</h4>
                  <p className="text-sm text-gray-600">
                    Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  doc.status === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : doc.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload ID Document
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload(e, 'ID Document')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Proof of Address
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload(e, 'Proof of Address')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Change Password</h4>
              <p className="text-sm text-gray-600">Update your account password</p>
            </div>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
              Change
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Login Notifications</h4>
              <p className="text-sm text-gray-600">Get notified of new login attempts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;