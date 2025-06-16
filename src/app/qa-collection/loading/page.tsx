'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { getGenerateInfo } from '../../../../apis/business';
import { useRouter } from 'next/navigation';
import { Modal } from 'antd';

export default function Loading() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [maskHeight, setMaskHeight] = useState('auto');
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    if (imgRef.current) {
      setMaskHeight(imgRef.current.height / 2.25 + 'px');
    }
  }, [imgRef]);

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
        if (res.data.status === 'done') {
          localStorage.removeItem('formData');
          if (timer.current) {
            clearInterval(timer.current);
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
    <div className="w-[100%] md:bg-[url('/desktop_bg.png')] bg-cover bg-center">
      <div className="md:w-[800px] flex flex-col items-center bg-[#003888] m-center">
        <div
          className="absolute md:w-[800px] top-0 left-0 md:left-[50%] md:translate-x-[-50%] w-[100%] h-[30%] bg-[#02274F] pl-[16px] pr-[16px] flex flex-col items-center gap-[32px]"
          style={{ height: maskHeight }}
        >
          <Image
            src="/loading_bg.png"
            alt="loading"
            width={800}
            height={288}
            style={{ width: '100%', height: 'auto' }}
          />
          <span className="loader" />
        </div>
        <Image
          ref={imgRef}
          src="/loading.gif"
          alt="loading"
          width={1501}
          height={3249}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <div className="w-[100%] hidden md:block z-[-1] absolute bottom-0 left-0 right-0 bg-[#003888]"></div>
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
