
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LoginHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <Link to="/landing" className="inline-flex items-center text-material-primary hover:underline">
        <ArrowLeft size={16} className="mr-2" />
        Back to Home
      </Link>
    </div>
  );
};

export default LoginHeader;
