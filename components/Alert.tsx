'use client';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';

let showAlert: (text: string, duration?: number) => void = () => {};

const AlertContainer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState<string>('');

  useEffect(() => {
    showAlert = (msg: string, duration = 3000) => {
      setText(msg);
      setOpen(true);
      setTimeout(() => setOpen(false), duration);
    };
  }, []);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex justify-center items-center z-[1000]">
      <div className="max-w-[343px] text-center pt-[8px] pb-[8px] pl-[16px] pr-[16px] bg-[#FFFFFFE5] rounded-[16px] flex justify-center items-center flex-col gap-[4px]">
        <Image src="/warn.svg" alt="alert" width={24} height={24} />
        {text}
      </div>
    </div>,
    document.body,
  );
};

// 组件本身
const Alert = {
  // 供外部调用
  show: (text: string, duration?: number) => showAlert(text, duration),
  // 需要在 _app.tsx 或页面根部挂载
  Container: AlertContainer,
};

export default Alert;
