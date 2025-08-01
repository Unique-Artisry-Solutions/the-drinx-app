import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <h3 className="text-2xl font-medium mb-4">
              Myxxit
            </h3>
            <p className="text-muted-foreground max-w-xs">
              The premier platform for discovering and sharing non-alcoholic cocktail experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-medium mb-4">About</h4>
              <ul className="space-y-2">
                <li><Link to="/mission" className="text-muted-foreground hover:text-foreground transition-colors">Our Mission</Link></li>
                <li><Link to="/mission#team" className="text-muted-foreground hover:text-foreground transition-colors">Team</Link></li>
                <li><Link to="/mission#partners" className="text-muted-foreground hover:text-foreground transition-colors">Partners</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/resources" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="/resources" className="text-muted-foreground hover:text-foreground transition-colors">Recipes</Link></li>
                <li><Link to="/resources" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/legal?tab=privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/legal?tab=terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link to="/legal?tab=cookies" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 text-muted-foreground text-sm text-center">
          <p>© {new Date().getFullYear()} Myxxit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
