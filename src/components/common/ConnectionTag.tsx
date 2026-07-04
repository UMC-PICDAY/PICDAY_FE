interface Props {
  label?: string
}

const ConnectionTag = ({ label = '연결됨'}: Props) => {
  return (
    <span className="flex w-fit items-center justify-center rounded-[100px] bg-brand-40 px-4 py-2 font-cap2 text-gray-60">
      {label}
    </span>
  )
}

export default ConnectionTag
