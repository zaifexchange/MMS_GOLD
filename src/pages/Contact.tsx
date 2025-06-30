import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Headphones } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'support@mmsgold.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: '24/7 phone support'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: '123 Gold Street, Financial District',
      description: 'New York, NY 10001'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: '24/7 Available',
      description: 'We never sleep, markets never close'
    }
  ];

  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      action: 'Start Chat'
    },
    {
      icon: Headphones,
      title: 'Phone Support',
      description: 'Speak directly with our experts',
      action: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send detailed questions via email',
      action: 'Send Email'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get in touch with our team of experts. We're here to help you succeed in gold trading.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <info.icon className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-lg font-semibold text-yellow-600 mb-2">{info.details}</p>
                <p className="text-gray-600">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Support Options */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="trading">Trading Support</option>
                    <option value="technical">Technical Issue</option>
                    <option value="account">Account Management</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Support Options */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Get Instant Support</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Need immediate assistance? Choose from our various support channels.
                </p>
              </div>

              <div className="space-y-6">
                {supportOptions.map((option, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-12 h-12 rounded-full flex items-center justify-center">
                        <option.icon className="h-6 w-6 text-black" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
                        <p className="text-gray-600 mb-4">{option.description}</p>
                        <button className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                          {option.action}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Link */}
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-black">
                <h3 className="text-xl font-bold mb-2">Frequently Asked Questions</h3>
                <p className="mb-4">
                  Find quick answers to common questions about our platform and services.
                </p>
                <button className="bg-black text-yellow-500 px-6 py-2 rounded-lg font-bold hover:bg-gray-900 transition-colors">
                  View FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Our Office</h2>
            <p className="text-lg text-gray-600">
              Located in the heart of the financial district
            </p>
          </div>
          
          <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Interactive map would be integrated here</p>
              <p className="text-sm text-gray-500 mt-2">123 Gold Street, Financial District, New York, NY 10001</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;