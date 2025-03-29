
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <h3 className="text-2xl font-medium mb-4">
              Spirit<span className="text-material-primary">less</span>
            </h3>
            <p className="text-gray-400 max-w-xs">
              The premier platform for discovering and sharing non-alcoholic cocktail experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-medium mb-4">About</h4>
              <ul className="space-y-2">
                <li><Link to="/mission" className="text-gray-400 hover:text-white">Our Mission</Link></li>
                <li><Link to="/mission#team" className="text-gray-400 hover:text-white">Team</Link></li>
                <li><Link to="/mission#partners" className="text-gray-400 hover:text-white">Partners</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/resources" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link to="/resources" className="text-gray-400 hover:text-white">Recipes</Link></li>
                <li><Link to="/resources" className="text-gray-400 hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/legal?tab=privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/legal?tab=terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link to="/legal?tab=cookies" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-gray-400 text-sm text-center">
          <p>© {new Date().getFullYear()} Spiritless. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
