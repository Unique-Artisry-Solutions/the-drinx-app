
import React, { ReactNode } from 'react';

/**
 * Wrap a component with a layout component
 */
export const withLayout = <P extends object>(
  Component: React.ComponentType<P>,
  Layout: React.ComponentType<{ children: ReactNode }>
): React.FC<P> => {
  return (props: P) => (
    <Layout>
      <Component {...props} />
    </Layout>
  );
};
