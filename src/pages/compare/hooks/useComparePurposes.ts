import { useQuery } from '@tanstack/react-query'

import { getComparePurposes } from '@/services/studio'

export const useComparePurposes = (
  studioIds: string[] | undefined,
  enabled: boolean,
) =>
  useQuery({
    queryKey: ['comparePurposes', studioIds],
    queryFn: () => getComparePurposes(studioIds ?? []),
    enabled,
  })
