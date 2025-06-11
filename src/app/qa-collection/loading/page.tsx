'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Loading() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [maskHeight, setMaskHeight] = useState('auto');

  useEffect(() => {
    if (imgRef.current) {
      setMaskHeight(imgRef.current.height / 2.25 + 'px');
    }
  }, [imgRef]);
  return (
    <div className="h-[100vh] flex flex-col items-center bg-[#003888]">
      <div
        className="absolute top-0 left-0 w-[100%] h-[30%] bg-[#02274F] pl-[16px] pr-[16px] flex flex-col items-center gap-[32px]"
        style={{ height: maskHeight }}
      >
        <Image
          src="/loading_bg.png"
          alt="loading"
          width={343}
          height={296}
          style={{ width: '100%', height: 'auto' }}
        />
        <span className="loader" />
      </div>
      <Image
        ref={imgRef}
        src="/loading.gif"
        alt="loading"
        width={343}
        height={410}
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
}
