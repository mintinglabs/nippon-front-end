'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { getGenerateInfo } from '../../../../apis/business';
import { useRouter } from 'next/navigation';
import { Modal } from 'antd';

export default function Loading() {
  const imgRef = useRef<HTMLImageElement>(null);
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const [maskHeight, setMaskHeight] = useState(0);

  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {}, []);

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
        if (res.data.status === 'timeout' || res.data.status === 'error') {
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

  useEffect(() => {
    function updateMaskHeight() {
      if (imgRef.current) {
        const rect = imgRef.current.getBoundingClientRect();
        const distanceToBottom = window.innerHeight - rect.bottom;
        setMaskHeight(distanceToBottom + 130);
      }
    }

    // 监听窗口变化
    window.addEventListener('resize', updateMaskHeight);

    // 图片加载后也要计算一次
    if (imgRef.current) {
      if (imgRef.current.complete) {
        updateMaskHeight();
      } else {
        imgRef.current.onload = updateMaskHeight;
      }
    }

    // 首次渲染主动计算一次
    updateMaskHeight();

    return () => {
      window.removeEventListener('resize', updateMaskHeight);
      if (imgRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        imgRef.current.onload = null;
      }
    };
  }, []);

  return (
    <div className="h-[100vh] w-full flex flex-col justify-center items-center overflow-hidden bg-[url('https://storage.googleapis.com/assets-presslogic/nippon/color-front-static/desktop_bg.png')] bg-cover bg-center">
      <div className="flex-1 w-full max-w-[800px] flex flex-col justify-center items-center bg-[#02274F]">
        <div className="w-full flex flex-col items-center justify-center">
          <Image
            src="/loading_bg.png"
            alt="loading"
            width={1200}
            height={940}
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
          <div className="w-full max-w-[300px] flex items-center justify-center mt-[16px]">
            <span className="loader" />
          </div>
        </div>
        <div className="flex-1 w-full flex justify-center items-start relative z-10">
          <Image
            className="w-full max-w-[300px] h-auto"
            ref={imgRef}
            src="/loading.gif"
            alt="loading"
            width={1501}
            height={3249}
            unoptimized
          />
        </div>
        <div
          style={{
            height: maskHeight,
          }}
          className="w-full md:w-[800px] md:left-[50%] md:translate-x-[-50%] bg-[#003888] absolute bottom-0 left-0 right-0"
        />
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
