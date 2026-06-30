import type { SVGProps } from 'react'

const IcCheckBoxFill = ({ width = 24, height = 24, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path id="Vector" d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.11 21 21 20.1 21 19V5C21 3.9 20.11 3 19 3ZM10.7071 16.2929C10.3166 16.6834 9.68342 16.6834 9.29289 16.2929L5.70549 12.7055C5.31586 12.3159 5.31586 11.6841 5.70549 11.2945C6.09474 10.9053 6.7257 10.9048 7.11549 11.2935L9.64645 13.8174C9.84179 14.0122 10.158 14.012 10.3531 13.8169L16.8804 7.28961C17.2719 6.89811 17.9074 6.89963 18.2975 7.29251C18.6857 7.68343 18.6849 8.31506 18.2954 8.70461L10.7071 16.2929Z" fill="#171617" />
  </svg>
)

export default IcCheckBoxFill
