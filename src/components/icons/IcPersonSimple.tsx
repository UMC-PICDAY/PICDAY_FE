import type { SVGProps } from 'react'

const IcPersonSimple = ({ width = 16, height = 20, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 19.9703"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="7.99858" cy="4.28642" r="4.28642" fill="currentColor" />
    <path d="M0 15.2203C0 12.7988 4 10.4703 6.62069 10.4703H9.37931C12 10.4703 16 12.7988 16 15.2203V17.0472C16 18.6616 14.0239 19.9703 11.5862 19.9703H4.41379C1.97612 19.9703 0 18.6616 0 17.0472V15.2203Z" fill="currentColor" />
  </svg>
)

export default IcPersonSimple
