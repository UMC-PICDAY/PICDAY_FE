import type { SVGProps } from 'react'

const IcCheck = ({ width = 24, height = 24, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path id="Vector" d="M9.27603 15.3593C9.08959 15.5454 8.78749 15.5453 8.60114 15.3591L5.63026 12.3913C5.25838 12.0198 4.65539 12.0191 4.28219 12.3893C3.90713 12.7614 3.90568 13.3674 4.27942 13.7408L8.26346 17.7207C8.63628 18.0931 9.24073 18.0931 9.61355 17.7207L19.7212 7.62354C20.0929 7.25213 20.0929 6.64996 19.7212 6.27856C19.3495 5.90727 18.7469 5.90713 18.3751 6.27824L9.27603 15.3593Z" fill="currentColor" />
  </svg>
)

export default IcCheck
