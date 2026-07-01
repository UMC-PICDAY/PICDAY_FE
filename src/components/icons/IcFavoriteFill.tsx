import type { SVGProps } from 'react'

const IcFavoriteFill = ({ width = 24, height = 24, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path id="Vector" d="M12.6056 19.7707C12.262 20.0773 11.7389 20.0763 11.3964 19.7684L10.695 19.1378C6.06 14.9867 3 12.2489 3 8.88888C3 6.15111 5.178 4 7.95 4C9.47955 4 10.949 4.68687 11.9307 5.77901C11.9675 5.81995 12.0325 5.81995 12.0693 5.77901C13.051 4.68687 14.5204 4 16.05 4C18.822 4 21 6.15111 21 8.88888C21 12.2489 17.94 14.9867 13.305 19.1467L12.6056 19.7707Z" fill="currentColor" />
  </svg>
)

export default IcFavoriteFill
