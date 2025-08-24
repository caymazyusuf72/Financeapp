import type { SVGProps } from "react";

export const Icons = {
  Logo: (props: SVGProps<SVGSVGElement>) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3v18"/>
      <path d="M16 7.5l-4-4-4 4"/>
      <path d="M8 16.5l4 4 4-4"/>
    </svg>
  )
};
