'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { getGenerateInfo } from '../../../../apis/business';
import { useRouter } from 'next/navigation';
import { Modal } from 'antd';
import { isMobile } from 'react-device-detect';

export default function Loading() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [maskHeight, setMaskHeight] = useState('auto');
  const router = useRouter();
  const [isError, setIsError] = useState(false);

  const [hasMobile, setHasMobile] = useState(false);
  useEffect(() => {
    setHasMobile(isMobile);
  }, []);
  useEffect(() => {
    if (imgRef.current) {
      setMaskHeight(imgRef.current.height / 2.22 + 'px');
    }
  }, [imgRef, hasMobile]);

  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    timer.current = setInterval(async () => {
      const uuid = localStorage.getItem('uuid');
      if (uuid) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await getGenerateInfo({ uuid });
        if (res.code !== 200) {
          setIsError(true);
          return;
        }
        if (res.data.status === 'timeout') {
          setIsError(true);
          if (timer.current) {
            clearInterval(timer.current);
            timer.current = null;
          }
          return;
        }
        if (res.data.status === 'ai_image_done' || res.data.status === 'done') {
          localStorage.removeItem('formData');
          if (timer.current) {
            clearInterval(timer.current);
            timer.current = null;
          }
          router.push('/result');
        }
      }
    }, 5000);
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [router]);

  return (
    <div
      style={{
        height: hasMobile ? '100%' : '100vh',
      }}
      className="w-[100%] md:bg-[url('/desktop_bg.png')] bg-cover bg-center"
    >
      <div className="relative md:w-[800px] h-[100%] flex flex-col items-center bg-[#02274F] m-center">
        <div
          className="absolute w-[100%] md:w-[800px] z-[10] top-0 left-0 md:left-[50%] md:translate-x-[-50%] h-[30%] bg-[#02274F] pl-[16px] pr-[16px] flex flex-col items-center"
          style={{ height: maskHeight, gap: hasMobile ? '32px' : '16px' }}
        >
          <Image
            src="/loading_bg.png"
            alt="loading"
            width={1200}
            height={940}
            style={{ width: hasMobile ? '100%' : '300px', height: 'auto' }}
          />
          <div className="md:w-[300px] w-[100%] z-[10] flex items-center justify-center">
            <span className="loader" />
          </div>
        </div>

        <Image
          className="z-[2] mt-[0px] md:mt-[10px]"
          ref={imgRef}
          src="/loading.gif"
          alt="loading"
          width={1501}
          height={3249}
          style={{ width: hasMobile ? '100%' : '300px', height: 'auto' }}
        />

        <div className="w-[100%] h-[360px] hidden md:block z-[1] absolute bottom-0 left-0 right-0 bg-[#003888]"></div>
      </div>
      <Modal
        title="抱歉😣生成遇到問題"
        open={isError}
        onOk={() => {}}
        closable={false}
        footer={null}
        centered
        styles={{
          content: {
            width: '311px',
            margin: '0 auto',
            fontFamily: 'Noto Sans TC',
            textAlign: 'center',
          },
        }}
      >
        生成圖像時出現錯誤, 請重試。
        <button
          onClick={() => {
            setIsError(false);
            router.push('/');
          }}
          className={`w-[263px] h-[44px] cursor-pointer flex items-center justify-center rounded-[25px] text-[15px] font-[700] bg-[#FF7CFF] text-[#FFFFFF] mt-[32px] transition-all duration-300
          `}
        >
          重試
        </button>
      </Modal>
    </div>
  );
}
