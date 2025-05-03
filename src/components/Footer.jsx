import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">Booking Bridge Link</h3>
            <p className="text-gray-400 mt-1">Connect your guests to all your booking platforms</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-6">
            <a href="#" className="text-gray-400 hover:text-white mb-2 md:mb-0">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white mb-2 md:mb-0">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white">Contact Us</a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} Booking Bridge Link. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;