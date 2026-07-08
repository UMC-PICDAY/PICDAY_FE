/**
 * Profile 사용법
 *
 * 사용자 정보와 예약 정보를 보여주는 프로필 영역
 *   <Profile />
 *
 * 사용자/예약 정보 변경
 *   <Profile
 *     userName="이수현"
 *     accountText="카카오 계정 연결"
 *     studioName="스튜디오 이름"
 *     reservationDate="2026년 3월 15일 (토) 14:00"
 *     statusLabel="예약 완료"
 *   />
 *
 * 이미지 연결
 *   <Profile
 *     userImageSrc={userImage}
 *     studioImageSrc={studioImage}
 *   />
 */

import StatusTag from '@/components/common/StatusTag'

interface Props {
  userName?: string
  accountText?: string
  studioName?: string
  reservationDate?: string
  statusLabel?: string
  userImageSrc?: string
  studioImageSrc?: string
}

const Profile = ({
  userName = '이수현',
  accountText = '카카오 계정 연결',
  studioName = '스튜디오 이름',
  reservationDate = '2026년 3월 15일 (토) 14:00',
  statusLabel = '예약 완료',
  userImageSrc,
  studioImageSrc,
}: Props) => (
  <div className="flex w-[402px] flex-col items-start gap-5 px-5 py-[10px]">
    <div className="flex w-full items-center gap-[15px]">
      {userImageSrc ? (
        <img
          src={userImageSrc}
          alt=""
          className="h-[40px] w-[40px] rounded-[1000px] object-cover"
        />
      ) : (
        <div className="h-[40px] w-[40px] rounded-[1000px] bg-brand-100" />
      )}

      <div className="flex flex-col">
        <span className="font-b5 text-[#222]">{userName}</span>
        <span className="font-b10 text-[#888]">{accountText}</span>
      </div>
    </div>

    <div className="flex w-full items-start gap-[10px] px-5 py-[10px]">
      {studioImageSrc ? (
        <img
          src={studioImageSrc}
          alt=""
          className="h-[67px] w-[67px] rounded-[15px] object-cover"
        />
      ) : (
        <div className="h-[67px] w-[67px] rounded-[15px] bg-brand-100" />
      )}

      <div className="flex flex-col items-start">
        <span className="font-b5 text-[#222]">{studioName}</span>
        <span className="font-b10 text-[#888]">{reservationDate}</span>
        <StatusTag label={statusLabel} />
      </div>
    </div>
  </div>
)

export default Profile