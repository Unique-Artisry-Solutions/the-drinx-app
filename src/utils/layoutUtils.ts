
import React, { ReactNode } from 'react';

/**
 * Wrap a component with a layout component
 */
export const withLayout = (
  Component: React.ComponentType<any>,
  Layout: React.ComponentType<{ children: ReactNode }>
): React.FC<any> => {
  return (props) => (
    <Layout>
      <Component {...props} />
    </Layout>
  );
};
