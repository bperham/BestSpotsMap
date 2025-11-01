import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement> & { className?: string }) {
  // Using an img tag to render the logo.
  // The 'props' are passed to maintain size and other styles from where the component is called.
  return (
    <img 
      src="/BestSpots_Logo.png" 
      alt="The Best Spots Logo" 
      className={props.className}
      style={{
        // Removes the default stroke color that might be inherited
        stroke: 'none',
        // Ensures the placeholder color is used if a text color is passed via className
        color: 'transparent'
      }}
    />
  );
}
