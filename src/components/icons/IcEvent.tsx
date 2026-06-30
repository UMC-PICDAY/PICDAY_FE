import type { SVGProps } from 'react'

const IcEvent = ({ width = 24, height = 24, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path id="Vector" d="M19 4H18.1C18.0448 4 18 3.95523 18 3.9V2.3C18 2.13431 17.8657 2 17.7 2H16.3C16.1343 2 16 2.13431 16 2.3V3.9C16 3.95523 15.9552 4 15.9 4H8.1C8.04477 4 8 3.95523 8 3.9V2.3C8 2.13431 7.86569 2 7.7 2H6.3C6.13431 2 6 2.13431 6 2.3V3.9C6 3.95523 5.95523 4 5.9 4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 19.5C19 19.7761 18.7761 20 18.5 20H5.5C5.22386 20 5 19.7761 5 19.5V9.5C5 9.22386 5.22386 9 5.5 9H18.5C18.7761 9 19 9.22386 19 9.5V19.5Z" fill="#171617" />
  </svg>
)

export default IcEvent
