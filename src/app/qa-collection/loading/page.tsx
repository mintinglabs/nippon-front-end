'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { getGenerateInfo } from '../../../../apis/business';
import { useRouter } from 'next/navigation';

export default function Loading() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [maskHeight, setMaskHeight] = useState('auto');
  const router = useRouter();

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
    </div>
  );
}
