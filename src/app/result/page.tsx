'use client';

import { RedoOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Alert from '../../../components/Alert';
import ConnectIcon from '../../../components/ConnectIcon';

export default function Result() {
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  return (
    <div className="w-[100vw] bg-[#fff] flex flex-col items-center">
      <Image
        src="/result_top_bg.png"
        alt="result"
        width={343}
        height={296}
        style={{ width: '100%', height: 'auto' }}
      />
      <div className="w-[343px] h-[228px] flex items-center justify-center gap-[8px] mt-[16px]">
        <Image
          src="https://lightboxgoodman.com/cdn/shop/files/one-piece-luffy-paper-3d-layered-file-cricut-file-lightboxgoodman-lightboxgoodman-1_grande.jpg?v=1736954614"
          alt="result"
          width={228}
          height={228}
          style={{ width: 228, height: 228, objectFit: 'cover' }}
        />
        <div className="w-[100%] h-[100%] flex flex-col gap-[8px]">
          <Image
            src="https://lightboxgoodman.com/cdn/shop/files/one-piece-luffy-paper-3d-layered-file-cricut-file-lightboxgoodman-lightboxgoodman-1_grande.jpg?v=1736954614"
            alt="result"
            width={110}
            height={110}
            style={{ width: 110, height: 110, objectFit: 'cover' }}
          />
          <Image
            src="https://lightboxgoodman.com/cdn/shop/files/one-piece-luffy-paper-3d-layered-file-cricut-file-lightboxgoodman-lightboxgoodman-1_grande.jpg?v=1736954614"
            alt="result"
            width={110}
            height={110}
            style={{ width: 110, height: 110, objectFit: 'cover' }}
          />
        </div>
      </div>
      <div className="w-[343px] text-center text-[28px] font-[900] mt-[16px] text-[#143784]">
        明亮簡約風
        <div
          className="w-[100%] h-[3px] mt-[8px]"
          style={{
            background:
              'linear-gradient(90deg, #D8F2FF 0%, #00FFFF 20%, #09F9FE 21%, #23ECFD 22%, #4DD6FB 24%, #88B7F9 26%, #D190F6 28%, #FA7BF5 29%, #F685F5 30%, #EBA6F8 35%, #E2C1FA 41%, #DAD5FC 47%, #D5E4FE 54%, #D2EDFE 62%, #D2F0FF 75%, #008DFF 90%, #55B9FF 94%, #D8F2FF 100%)',
          }}
        ></div>
      </div>
      <div className="w-[343px] text-center mt-[16px]">
        <span className="text-[16px] font-[700] text-[#143784]">你的專屬 NP-COLOR ID 包括：</span>
        <div className="w-[100%] h-[171px] flex items-center justify-center gap-[8px] mt-[16px]">
          <div className="w-[171px] h-[171px] bg-[#EBDACC] text-left flex items-end font-[700] p-[16px]">
            春雨
            <br />
            ON0058-4
          </div>
          <div className="w-[81px] h-[171px] flex flex-col text-[12px] gap-[8px] font-[700]">
            <div className="w-[81px] h-[81px] bg-[#E1E2DB] text-left flex items-end p-[8px]">
              春雨
              <br />
              ON0058-4
            </div>
            <div className="w-[81px] h-[81px] bg-[#B7A383] text-left flex items-end p-[8px]">
              春雨
              <br />
              ON0058-4
            </div>
          </div>
          <div className="w-[81px] h-[171px] flex flex-col text-[12px] gap-[8px] font-[700]">
            <div className="w-[81px] h-[81px] bg-[#C1BBBC] text-left flex items-end p-[8px]">
              春雨
              <br />
              ON0058-4
            </div>
            <div className="w-[81px] h-[81px] bg-[#9B705A] text-left flex items-end p-[8px]">
              春雨
              <br />
              ON0058-4
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          border: '2px solid',
          borderImageSource:
            'linear-gradient(90deg, #D8F2FF -0.26%, #00FFFF 19.84%, #09F9FE 20.85%, #23ECFD 21.85%, #4DD6FB 23.86%, #88B7F9 25.87%, #D190F6 27.88%, #FA7BF5 28.89%, #F685F5 29.89%, #EBA6F8 34.92%, #E2C1FA 40.95%, #DAD5FC 46.98%, #D5E4FE 54.02%, #D2EDFE 62.06%, #D2F0FF 75.13%, #008DFF 90.21%, #55B9FF 94.23%, #D8F2FF 100.26%)',
          borderImageSlice: 1,
        }}
        className="w-[343px] mt-[16px] p-[8px] text-[12px] font-[700] text-[#143784]"
      >
        您嚮往陽光滿溢、整潔舒服的感覺，同時鍾情於現代簡約的純粹線條與原始質感。明亮簡約風正能滿足您的追求！乾淨的色彩、極簡的設計，保證讓你家明亮舒適，又能徹底relax，每一天都過得好自在！
      </div>
      <div>
        <button
          onClick={() => {
            navigator.share({
              title: '立邦油漆',
              text: '立邦油漆',
              url: window.location.href,
            });
          }}
          className="w-[311px] h-[44px] flex items-center justify-center rounded-[25px] text-[15px] font-[700] text-[#FFFFFF] mt-[32px] mb-[24px] transition-all duration-300
          bg-[#E30211]"
        >
          分享結果
        </button>
        <button
          onClick={() => {
            navigator.clipboard
              .writeText(window.location.href)
              .then(() => {
                setIsCopied(true);
                setTimeout(() => {
                  setIsCopied(false);
                }, 3000);
              })
              .catch(() => {
                Alert.show('複製失敗');
              });
          }}
          className={`w-[311px] h-[44px] flex items-center justify-center gap-[8px] rounded-[25px] text-[15px] font-[700] text-[#002859] mb-[24px] transition-all duration-300
            border-[1px] border-[#002859]
            ${isCopied ? 'bg-[#CACACA] text-[#fff] border-[1px] border-[#A1A1A1]' : ''}
          `}
        >
          {isCopied ? '複製成功' : '複製遊戲連結'}
          <ConnectIcon color={isCopied ? '#fff' : '#002859'} />
        </button>
        <button
          onClick={() => {
            router.push('/');
          }}
          className={`w-[311px] h-[44px] flex items-center justify-center gap-[8px] rounded-[25px] text-[15px] font-[700] text-[#002859] mb-[24px] transition-all duration-300
          `}
        >
          再玩一次
          <RedoOutlined className="text-[#002859] rotate-90 scale-x-[-1] mt-[2px]" />
        </button>
      </div>
      <div className="w-[100%] flex flex-col bg-[#02274F]">
        <Image
          src="/result_ads1.png"
          alt="result"
          width={343}
          height={296}
          style={{ width: '100%', height: 'auto' }}
        />
        <Image
          src="/result_ads2.png"
          alt="result"
          width={343}
          height={296}
          style={{ width: '100%', height: 'auto' }}
        />
        <Image
          src="/result_ads3.png"
          alt="result"
          width={343}
          height={296}
          style={{ width: '100%', height: 'auto' }}
        />
        <div className="w-[100%] h-[76px] flex items-center justify-center">
          <a
            href="https://www.google.com"
            target="_blank"
            style={{
              borderBottom: '3px solid #FFFFFF',
            }}
            className={`w-[311px] h-[44px] flex items-center justify-center rounded-[25px] text-[15px] font-[700] text-[#00284F] transition-all duration-300
          bg-[#32F1FF]
          `}
          >
            立即參加
          </a>
        </div>
        <Image
          src="/result_ads4.png"
          alt="result"
          width={343}
          height={296}
          style={{ width: '100%', height: 'auto' }}
        />
        <div className="w-[100%] h-[76px] flex items-center justify-center">
          <a
            href="https://www.google.com"
            target="_blank"
            style={{
              borderBottom: '3px solid #9EBF1A',
            }}
            className={`w-[311px] h-[44px] flex items-center justify-center rounded-[25px] text-[15px] font-[700] text-[#fff] transition-all duration-300
          bg-[#2E7B43]
          `}
          >
            立即購買
          </a>
        </div>
        <Image
          src="/result_ads5.png"
          alt="result"
          width={343}
          height={296}
          style={{ width: '100%', height: 'auto' }}
        />
        <div className="w-[100%] h-[76px] flex items-center justify-center">
          <a
            href="https://www.google.com"
            target="_blank"
            style={{
              borderBottom: '3px solid #32F1FF',
            }}
            className={`w-[311px] h-[44px] flex items-center justify-center rounded-[25px] text-[15px] font-[700] text-[#00284F] transition-all duration-300
          bg-[#fff]
          `}
          >
            到立邦網站了解更多
          </a>
        </div>
        <Image
          src="/result_ads6.png"
          alt="result"
          width={343}
          height={296}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
}
