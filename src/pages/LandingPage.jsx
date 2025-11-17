import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Link as LinkIcon, TrendingUp, Sparkles, Shield, Zap, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <LinkIcon className="w-6 h-6" />,
      title: "All Your Links in One Place",
      description: "Consolidate your Airbnb, Booking.com, social media, and reservation platforms into a single, beautiful page."
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Built for Hospitality",
      description: "Designed specifically for hotels, Airbnbs, restaurants, cafes, and venues with industry-specific features."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Track Your Performance",
      description: "Monitor link clicks and understand how your guests discover and engage with your business."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Fully Customizable",
      description: "Match your brand with custom colors, styles, and layouts. Make it uniquely yours."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Built with modern technology for instant loading and seamless user experience."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security powered by Firebase."
    }
  ];

  const platforms = [
    "Airbnb", "Booking.com", "Vrbo", "OpenTable", "TripAdvisor", "Expedia",
    "Yelp", "Instagram", "Facebook", "Google Maps"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient orbs background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-8 animate-fade-in-down">
              <Sparkles className="w-4 h-4 mr-2" />
              Open Source & Free Forever
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 animate-fade-in-up" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em' }}>
              One Link for Your
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2 animate-glow">
                Hospitality Business
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 animate-fade-in-up animation-delay-200">
              Connect your guests to all your booking platforms, social media, and services.
              Perfect for Airbnbs, restaurants, hotels, and venues.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up animation-delay-400">
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="relative flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
              <Link
                to="/login"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 hover:border-indigo-300"
              >
                Sign In
              </Link>
            </div>

            {/* Platform Badges */}
            <div className="max-w-4xl mx-auto animate-fade-in-up animation-delay-600">
              <p className="text-sm text-gray-500 mb-4 uppercase tracking-wide font-medium">
                Integrates with your favorite platforms
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {platforms.map((platform, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white rounded-full text-sm text-gray-600 shadow-sm border border-gray-100"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for the hospitality industry with features that matter
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-indigo-300 hover:-translate-y-2 gpu-accelerated"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-indigo-500/50">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple to Set Up
            </h2>
            <p className="text-xl text-gray-600">
              Get your link hub live in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 stagger-animation">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white text-2xl font-bold mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 group-hover:shadow-indigo-500/50">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">Create Your Account</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Sign up for free in seconds. No credit card required.
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full text-white text-2xl font-bold mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 group-hover:shadow-purple-500/50">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Add Your Links</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Add booking platforms, social media, and custom links. Customize colors and style.
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full text-white text-2xl font-bold mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 group-hover:shadow-pink-500/50">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">Share & Grow</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Share your link and watch your bookings grow. Track performance in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl mb-10 text-indigo-100">
            Join hospitality businesses worldwide using Booking Bridge to connect with their guests
          </p>
          <Link
            to="/register"
            className="group inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-indigo-600 bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Start For Free
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <p className="mt-6 text-indigo-200 text-sm">
            Free forever. No credit card required. Open source.
          </p>
        </div>
      </div>

      {/* Custom animations CSS */}
      <style>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
