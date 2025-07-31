'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { QNA } from './reducer';
import 'animate.css';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { submitForm } from '../../../apis/business';
import Alert from '../../../components/Alert';
import { usePageView } from '../analytics/pageview';

const StepProgress = ({ currentStep = 1, totalStep = 4 }) => {
  const percent = (currentStep / totalStep) * 100;

  return (
    <div className="relative w-[255px] md:w-[311px] h-[16px] flex items-center">
      {/* 白色圆角背景 */}
      <div className="absolute left-0 top-0 w-full h-full bg-white rounded-full"></div>
      {/* 红色进度条 */}
      <div
        className="absolute flex items-center justify-center left-0 top-0 h-full bg-[#E30211] font-bold text-[12px] text-white rounded-full transition-all duration-300"
        style={{
          width: `${percent}%`,
          zIndex: 1,
        }}
      >
        {currentStep}/{totalStep}
      </div>
    </div>
  );
};

export default function QACollection() {
  usePageView();

  const router = useRouter();
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [answer, setAnswer] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHover, setIsHover] = useState(-1);
  useEffect(() => {
    // 如果不存在formData，则跳转到首页
    if (!localStorage.getItem('formData')) {
      router.push('/');
    }

    const handleScroll = () => {
      setIsHeaderVisible(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [router]);

  const handleNext = async () => {
    if (isLoading) {
      return;
    }

    if (currentStep < QNA.length && answer[currentStep - 1]) {
      setCurrentStep(currentStep + 1);
      // 回到顶部
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    if (answer.length === QNA.length) {
      setIsLoading(true);
      try {
        const formData = JSON.parse(localStorage.getItem('formData') || '{}');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await submitForm({
          ...formData,
          answers: answer,
        });
        if (res?.code !== 200) {
          console.error(res.message);
          Alert.show(res.message);
          return;
        }
        // 存储uuid
        localStorage.setItem('uuid', res.data.uuid);
        router.push('/qa-collection/loading');
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex md:h-auto min-h-[100vh] flex-col items-center md:bg-[url('https://storage.googleapis.com/assets-presslogic/nippon/color-front-static/desktop_bg.png')] bg-cover bg-center">
      <div className="w-[100%] flex-1 p-[16px] md:p-[32px] pb-[0] md:w-[800px] bg-[#002859] pt-[16px] flex flex-col items-center justify-center">
        <div
          className="w-[100%] flex-1 bg-scroll-y-desktop"
          style={{
            backgroundImage: `url("https://storage.googleapis.com/assets-presslogic/nippon/color-front-static/collection_bg${currentStep}.png")`,
          }}
        >
          <header
            className={`
          w-full z-10 flex justify-center items-center fixed top-0 left-0 right-0 bg-[#002859]
          transition-all duration-300 transform
          ${isHeaderVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
          >
            <div className="w-[343px] md:w-[768px] relative h-[48px] flex gap-[20px] items-center justify-center">
              <div
                onClick={handleBack}
                className="absolute cursor-pointer left-0 w-[24px] h-[24px] flex items-center justify-center bg-[#FFFFFF] rounded-full"
              >
                <Image src="/back.svg" alt="back" width={10} height={18} />
              </div>
              <StepProgress currentStep={currentStep} totalStep={4} />
            </div>
          </header>
          <div className="relative flex items-start justify-center bg-cover bg-center pt-[5px] mt-[-15px]">
            <Image
              src="https://storage.googleapis.com/assets-presslogic/nippon/color-front-static/nippon_logo.png"
              alt="logo"
              width={114}
              height={32}
            />
          </div>
          <div className="relative h-[32px] md:h-[48px] flex gap-[20px] mt-[8px] md:mt-[24px] items-center justify-center">
            <div
              onClick={handleBack}
              className="absolute cursor-pointer left-0 w-[24px] h-[24px] flex items-center justify-center bg-[#FFFFFF] rounded-full"
            >
              <Image src="/back.svg" alt="back" width={10} height={18} />
            </div>
            <StepProgress currentStep={currentStep} totalStep={4} />
          </div>
          <div className="mt-[12px] flex flex-col items-center justify-center">
            <span className="text-[#FF7CFF] text-[18px] md:text-[24px] font-bold text-center">
              {QNA[currentStep - 1].question}
            </span>
            <div
              key={currentStep}
              className="flex flex-col gap-[16px] md:gap-[24px] mt-[16px] md:mt-[24px] cursor-pointer"
            >
              {QNA[currentStep - 1].options.map((option, index) => (
                <div
                  onClick={() => {
                    const newAnswer = [...answer];
                    newAnswer[currentStep - 1] = String.fromCharCode(65 + index);
                    setAnswer(newAnswer);
                  }}
                  style={{
                    ...(answer[currentStep - 1] !== String.fromCharCode(65 + index) &&
                    isHover !== index
                      ? { backgroundImage: `url(${option.background})` }
                      : {
                          backgroundImage:
                            'url("https://storage.googleapis.com/assets-presslogic/nippon/color-front-static/a_select_bg.png")',
                          color: '#fff',
                        }),
                    backgroundSize: 'cover',
                    animationDelay: `${index * 0.2}s`,
                  }}
                  onMouseEnter={() => setIsHover(index)}
                  onMouseLeave={() => setIsHover(-1)}
                  key={index}
                  className="animate__animated animate__fadeInDown transition-all duration-300 w-[260px] h-[100px] md:w-[311px] md:h-[120px] p-[16px] text-[14px] md:text-[16px] font-bold text-center flex flex-col items-center justify-center"
                >
                  <div className="w-[28px] h-[28px] text-[#fff] flex items-center justify-center bg-[#E30211] rounded-full">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="mt-[4px]">{option.text}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={handleNext}
              className={`w-[311px] h-[44px] cursor-pointer flex items-center justify-center gap-[8px] rounded-[25px] text-[15px] font-[700] text-[#FFFFFF] mt-[16px]  md:mt-[32px] mb-[16px] md:mb-[24px] transition-all duration-300
          ${answer[currentStep - 1] && !isLoading ? 'bg-[#E30211]' : 'bg-[#CACACA]'}
          `}
            >
              {isLoading && <Spin indicator={<LoadingOutlined style={{ color: '#fff' }} spin />} />}
              {currentStep === QNA.length ? '完成！' : '下一步'}
            </button>
          </div>
        </div>
      </div>
      <div className="w-[100%] md:w-[800px] h-[68px] md:h-[145px] bg-[url('https://storage.googleapis.com/assets-presslogic/nippon/color-front-static/nippon-ad.png')]  bg-cover bg-center" />
      <Alert.Container />
    </div>
  );
}
