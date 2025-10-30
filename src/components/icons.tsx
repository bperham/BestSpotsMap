import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement> & { className?: string }) {
  // Using an img tag to render a placeholder PNG.
  // The 'props' are passed to maintain size and other styles from where the component is called.
  return (
    <img 
      src="https://placehold.co/64x64/79A0DC/white?text=SVS" 
      alt="Street View Spots Logo" 
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
