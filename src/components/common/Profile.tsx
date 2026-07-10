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
    {/*userinfo*/}
    <div className="flex w-full items-center px-5 py-[10px] gap-[15px]">
      {/*원형 이미지*/}
      {userImageSrc ? (
        <img
          src={userImageSrc}
          alt=""
          className="h-[40px] w-[40px] shrink-0 rounded-[1000px] object-cover"
        />
      ) : (
        <div className="h-[40px] w-[40px] shrink-0 rounded-[1000px] bg-brand-100" />
      )}

      {/*이름/계정 텍스트 묶음*/}
      <div className="flex flex-col">
        <span className="font-b5 text-black">{userName}</span>
        <span className="font-b10 text-gray-40">{accountText}</span>
      </div>
    </div>

    {/*bookinginfo*/}
    <div className="flex w-full items-start px-5 py-[10px] gap-[15px]">
      {/*사각형 이미지*/}
      {studioImageSrc ? (
        <img
          src={studioImageSrc}
          alt=""
          className="h-[65px] w-[65px] shrink-0 rounded-[16px] object-cover"
        />
      ) : (
        <div className="h-[65px] w-[65px] shrink-0 rounded-[16px] bg-brand-100" />
      )}

      {/*스튜디오 이름/날짜/태그 묶음*/}
      <div className="flex min-w-0 flex-col items-start">
        <div className="flex flex-col">
          <span className="font-b5 text-black">{studioName}</span>
          <span className="font-b10 text-gray-40">{reservationDate}</span>
        </div>

        <div className="mt-[5px]">
          <StatusTag label={statusLabel} />
        </div>
      </div>
    </div>
  </div>
)

export default Profile