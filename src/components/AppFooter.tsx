import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Mail, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const AppFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return <footer className="border-t mt-auto py-6 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Sparkles className="h-5 w-5 mr-2 text-material-primary" />
            <span className="font-medium">
              the Drinx <span className="font-light italic">app</span>
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <Link to="/mission" className="hover:text-material-primary flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              Our Mission
            </Link>
            <Link to="/resources" className="hover:text-material-primary flex items-center">
              <ExternalLink className="h-4 w-4 mr-1" />
              Resources
            </Link>
            <Link to="/legal" className="hover:text-material-primary flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              Legal
            </Link>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="text-xs text-center text-gray-500">
          <p>© {currentYear} the Drinx app. All rights reserved.</p>
          <p className="mt-1">Drink responsibly. Not suitable for individuals under the legal drinking age.</p>
        </div>
      </div>
    </footer>;
};
export default AppFooter;
