import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MessageCircle, Phone, Mail, Clock, Search, ChevronDown, ChevronUp, Headphones, FileText, Users, Zap } from 'lucide-react';

const Support = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const supportChannels = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: '24/7',
      responseTime: 'Instant',
      action: 'Start Chat'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our experts',
      availability: '24/5',
      responseTime: 'Immediate',
      action: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send detailed questions via email',
      availability: '24/7',
      responseTime: '< 2 hours',
      action: 'Send Email'
    },
    {
      icon: FileText,
      title: 'Help Center',
      description: 'Browse our comprehensive knowledge base',
      availability: '24/7',
      responseTime: 'Instant',
      action: 'Browse Articles'
    }
  ];

  const faqs = [
    {
      question: 'How do I open a trading account?',
      answer: 'Opening a trading account is simple. Click on "Sign Up" in the top menu, fill out the registration form with your personal details, verify your email, and complete the KYC process by uploading required documents. Once approved, you can fund your account and start trading.'
    },
    {
      question: 'What is the minimum deposit required?',
      answer: 'The minimum deposit is $100 for standard accounts. We accept various payment methods including bank transfers, credit/debit cards, and e-wallets. Deposits are typically processed instantly for most payment methods.'
    },
    {
      question: 'How long do withdrawals take?',
      answer: 'Withdrawal processing times vary by method: E-wallets (instant to 24 hours), Credit/Debit cards (1-3 business days), Bank transfers (3-5 business days). All withdrawals are processed within 24 hours of request during business days.'
    },
    {
      question: 'What leverage is available for gold trading?',
      answer: 'We offer leverage up to 1:100 for gold trading (XAU/USD). Leverage allows you to control larger positions with smaller capital, but remember that it also increases risk. Please ensure you understand leverage before trading.'
    },
    {
      question: 'Are there any trading fees?',
      answer: 'We operate on a spread-based model with no commission fees. The spread for XAU/USD typically ranges from 0.3 to 0.5 pips during normal market conditions. There are no hidden fees or charges for trading.'
    },
    {
      question: 'Is my money safe with MMS Gold?',
      answer: 'Yes, client funds are held in segregated accounts with tier-1 banks, separate from company funds. We are regulated by financial authorities and maintain strict security protocols including SSL encryption and two-factor authentication.'
    },
    {
      question: 'Can I trade on mobile devices?',
      answer: 'Yes, our platform is fully responsive and works on all devices. We also offer dedicated mobile apps for iOS and Android with full trading functionality, real-time charts, and account management features.'
    },
    {
      question: 'What educational resources are available?',
      answer: 'We provide comprehensive educational materials including video tutorials, trading guides, webinars, market analysis, and a trading glossary. Our education center covers everything from basics to advanced strategies.'
    },
    {
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page, enter your email address, and you\'ll receive a password reset link. Follow the instructions in the email to create a new password. If you need help, contact our support team.'
    },
    {
      question: 'What are the trading hours for gold?',
      answer: 'Gold (XAU/USD) trades 24 hours a day, 5 days a week, from Sunday 22:00 GMT to Friday 21:00 GMT. The market is closed on weekends and major holidays. The most active trading sessions are London and New York overlaps.'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Support Center</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Get the help you need, when you need it. Our dedicated support team is here 
              to assist you with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105">
                Contact Support
              </button>
              <button className="border-2 border-yellow-500 text-yellow-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 hover:text-black transition-all">
                Browse Help Center
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Can We Help You?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose your preferred support channel and get the assistance you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportChannels.map((channel, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <channel.icon className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{channel.title}</h3>
                <p className="text-gray-600 mb-6">{channel.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Availability:</span>
                    <span className="font-medium text-gray-900">{channel.availability}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Response Time:</span>
                    <span className="font-medium text-green-600">{channel.responseTime}</span>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all">
                  {channel.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find quick answers to common questions about our platform and services
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-8 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No FAQs found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Can't find what you're looking for? Send us a message and we'll get back to you quickly.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <form className="space-y-6">
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
                >
                  <option value="">Select a subject</option>
                  <option value="account">Account Issues</option>
                  <option value="trading">Trading Support</option>
                  <option value="technical">Technical Problems</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="education">Educational Resources</option>
                  <option value="other">Other</option>
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
                  placeholder="Please describe your issue or question in detail..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Support Statistics */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Support by the Numbers</h2>
            <p className="text-xl text-gray-300">Our commitment to exceptional customer service</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">24/7</div>
              <div className="text-gray-300">Support Availability</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">&lt;2min</div>
              <div className="text-gray-300">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">98%</div>
              <div className="text-gray-300">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">15+</div>
              <div className="text-gray-300">Languages Supported</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Support;