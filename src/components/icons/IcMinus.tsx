import type { SVGProps } from 'react'

const IcMinus = ({ width = 24, height = 24, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M20 12C20 11.3688 19.4883 10.8571 18.8571 10.8571H5.14286C4.51167 10.8571 4 11.3688 4 12C4 12.6312 4.51167 13.1429 5.14286 13.1429H18.8571C19.4883 13.1429 20 12.6312 20 12Z" fill="currentColor" />
  </svg>
)

export default IcMinus
