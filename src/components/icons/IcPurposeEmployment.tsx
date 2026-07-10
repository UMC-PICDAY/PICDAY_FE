import type { SVGProps } from 'react'

const IcPurposeEmployment = ({ width = 26, height = 31, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 26 30.875"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M16 0L26 10V26C26 28.6924 23.8174 30.875 21.125 30.875H4.875C2.18261 30.875 0 28.6924 0 26V4.875C0 2.18261 2.18261 0 4.875 0H16Z" fill="currentColor" />
    <path d="M6 17H20" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <path d="M6 23H17" stroke="white" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

export default IcPurposeEmployment
