import type { SVGProps } from 'react'

const IcThumbsUp = ({ width = 16, height = 16, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2 7.78571H4.14286V13.7857H2V7.78571ZM11 13.7857H5V7.44157L6.30371 5.486L6.66586 2.95014C6.69591 2.74619 6.7981 2.55978 6.95388 2.42476C7.10967 2.28974 7.30871 2.21506 7.51486 2.21429H7.57143C7.91232 2.21463 8.23915 2.35019 8.48019 2.59124C8.72123 2.83228 8.8568 3.15911 8.85714 3.5V6.07143H12.2857C12.7402 6.072 13.1759 6.25279 13.4973 6.57416C13.8186 6.89553 13.9994 7.33123 14 7.78571V10.7857C13.9989 11.581 13.6824 12.3434 13.1201 12.9058C12.5577 13.4681 11.7953 13.7846 11 13.7857Z"
      fill="currentColor"
    />
  </svg>
)

export default IcThumbsUp
