
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LinkProps } from '@/types/navigation';

/**
 * A standardized link component that wraps React Router's Link
 * Provides consistent styling and behavior across the application
 */
const LinkComponent: React.FC<LinkProps> = ({
  href,
  children,
  className,
  activeClassName,
  onClick,
  preventScrollReset,
  replace,
  ...props
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow custom click handlers to override default behavior
    if (onClick) {
      onClick(e);
      return;
    }

    // If it's an external link, let the browser handle it
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    // Prevent default for internal links and use React Router's navigation
    e.preventDefault();
    navigate(href, { replace, preventScrollReset });
  };

  return (
    <Link
      to={href}
      onClick={handleClick}
      className={cn(className)}
      preventScrollReset={preventScrollReset}
      replace={replace}
      {...props}
    >
      {children}
    </Link>
  );
};

export default LinkComponent;
