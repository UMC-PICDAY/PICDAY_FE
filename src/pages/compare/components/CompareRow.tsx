import type { ReactNode } from 'react'

interface CompareRowProps {
  title: string
  columns: 2 | 3
  children: ReactNode
}

const CompareRow = ({
  title,
  columns,
  children,
}: CompareRowProps) => (
  <div className="flex w-full flex-col bg-[rgba(252,252,252,0.75)] py-[5px] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]">
    <div className="px-5 py-[5px]">
      <p className="font-b7 text-brand-100">
        {title}
      </p>
    </div>

    <div
      className={`grid px-5 py-[5px] ${
        columns === 3
          ? 'grid-cols-3 gap-[10px]'
          : 'grid-cols-2 gap-4'
      }`}
    >
      {children}
    </div>
  </div>
)

export default CompareRow
