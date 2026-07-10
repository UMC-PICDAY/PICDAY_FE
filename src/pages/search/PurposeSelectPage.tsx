import { useState } from 'react'
import { useNavigate } from 'react-router'

import NavigationBar from '@/components/layout/NavigationBar'
import MiniTitle from '@/components/common/MiniTitle'
import FilterChip from '@/components/common/FilterChip'
import Button from '@/components/common/Button'
import { useSearchDraftStore } from '@/stores/useSearchDraftStore'

const PURPOSES = ['증명', '프로필', '개인화보', '취업', '가족', '우정']

const PurposeSelectPage = () => {
  const navigate = useNavigate()
  const setPurposeDraft = useSearchDraftStore((state) => state.setPurpose)
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(
    () => useSearchDraftStore.getState().purpose,
  )

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <NavigationBar title="검색" showRight={false} onBack={() => navigate(-1)} />

      <MiniTitle title="어떤 사진이 필요하세요?" />

      <div className="grid w-full grid-cols-3 gap-x-4 gap-y-3 p-5">
        {PURPOSES.map((purpose) => (
          <FilterChip
            key={purpose}
            label={purpose}
            size="large"
            className="w-full"
            selected={selectedPurpose === purpose}
            onClick={() => setSelectedPurpose(purpose)}
          />
        ))}
      </div>

      <div className="mt-auto w-full p-5">
        <Button
          variant={selectedPurpose ? 'primary' : 'disabled'}
          onClick={() => {
            setPurposeDraft(selectedPurpose!)
            navigate('/search')
          }}
        >
          다음
        </Button>
      </div>
    </div>
  )
}

export default PurposeSelectPage
