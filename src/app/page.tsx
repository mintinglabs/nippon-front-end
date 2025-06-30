'use client';

import Image from 'next/image';
import Checkbox from '../../components/Checkbox';
import { useEffect, useState } from 'react';
import { AvatarUpload } from '../../components/AvatarUpload';
import FullSpin from '../../components/FullSpin';
import Alert from '../../components/Alert';
import { Modal, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { isMobile } from 'react-device-detect';
import { getGenerateCount } from '../../apis/business';
import { LoadingOutlined } from '@ant-design/icons';

type FormConf = {
  id: 1 | 2 | 3;
  title: string;
  formItem?: React.ReactNode;
  description?: string;
};

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    image: '',
  });
  const [emailError, setEmailError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const idLabFormConf: FormConf[] = [
    {
      id: 1,
      title: '你的姓名',
      formItem: (
        <>
          <div className="text-[14px] font-[400] text-[#FFFFFF] mt-[8px]">
            (只限中英文字，不含空格或符號)
          </div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              const value = e.target.value;
              // 如果正在手写输入，允许所有输入
              if (isComposing) {
                setFormData({ ...formData, name: value });
                return;
              }

              // 允许空值
              if (value === '') {
                setFormData({ ...formData, name: value });
                return;
              }

              // 只保留英文字母，过滤掉其他字符
              const filteredValue = value.replace(/[^A-Za-z\u4e00-\u9fa5]/g, '');
              setFormData({ ...formData, name: filteredValue });
            }}
            onCompositionStart={() => {
              setIsComposing(true);
            }}
            onCompositionEnd={(e) => {
              setIsComposing(false);
              // 手写输入结束时进行最终验证
              // 清除字符中所有的空格
              const value = (e.target as HTMLInputElement).value.replace(/\s/g, '');
              // 只保留英文字母，过滤掉其他字符
              const filteredValue = value.replace(/[^A-Za-z\u4e00-\u9fa5]/g, '');
              setFormData({ ...formData, name: filteredValue });
            }}
            className="w-[311px] md:w-[400px] h-[40px] rounded-[8px] text-center bg-[#FFFFFF] border text-[16px]  p-[10px] mt-[8px] mb-[24px]"
            placeholder="請輸入中文或英文名"
          />
        </>
      ),
    },
    {
      id: 2,
      title: '你的電郵',
      formItem: (
        <div className="mb-[24px] flex flex-col items-center justify-center">
          <div className="text-[14px] font-[400] text-[#FFFFFF] mt-[8px]">
            (Al虚擬家居預覽及配色指南會透過電郵發送)
          </div>
          <input
            type="text"
            value={formData.email}
            onChange={(e) => {
              setEmailError(false);
              setFormData({ ...formData, email: e.target.value });
            }}
            className={`w-[311px] md:w-[400px] h-[40px] rounded-[8px] text-center bg-[#FFFFFF] border text-[16px]  p-[10px] mt-[8px]
              ${emailError ? 'text-[#FF4747]' : ''}
              `}
            placeholder="example@mail.com"
          />
          {emailError && (
            <span className="text-[12px] font-[400] text-[#FF4747] mt-[4px]">
              請輸入有效的電郵地址。
            </span>
          )}
        </div>
      ),
    },
    {
      id: 3,
      title: '上傳相片',
      formItem: (
        <>
          <div className="w-[311px] md:w-[400px] text-center text-[14px] font-[400] text-[#FFFFFF] mt-[8px]">
            （相片規格僅限1人，正面及半身，五官需清晰可見，嚴禁色情與暴力。）
          </div>
          {formData.image ? (
            <div className="w-[116px] h-[116px] mt-[16px] relative flex items-center justify-center rounded-[8px] p-[8px] border border-[#A1A1A1] bg-[#f5f5f5]">
              <Image
                onClick={() => {
                  setFormData({
                    ...formData,
                    image: '',
                  });
                }}
                src={formData.image}
                alt="photo"
                width={100}
                height={100}
                style={{
                  objectFit: 'cover',
                  width: '100px',
                  height: '100px',
                  borderRadius: '4px',
                }}
                onLoad={() => {
                  // 图片加载完成后的处理
                }}
                onError={() => {
                  // 图片加载失败的处理
                  setFormData({
                    ...formData,
                    image: '',
                  });
                }}
              />
              <Image
                onClick={() => {
                  setFormData({
                    ...formData,
                    image: '',
                  });
                }}
                className="absolute top-[-12px] right-[-12px] cursor-pointer z-10"
                src="/Close.svg"
                alt="delete"
                width={24}
                height={24}
              />
            </div>
          ) : (
            <div className="w-[116px] h-[116px] mt-[16px] flex items-center justify-center">
              <AvatarUpload
                onUploadSuccess={(url: string) => {
                  setFormData({
                    ...formData,
                    image: url,
                  });
                }}
                setIsUploading={setIsUploading}
              >
                <button className="w-[311px] md:w-[174px] h-[44px] flex items-center cursor-pointer justify-center rounded-[25px] bg-[#FF7CFF] text-[15px] font-[700] text-[#FFFFFF] mt-[8px]">
                  <Image
                    className="mr-[8px]"
                    src="/upload.svg"
                    alt="upload"
                    width={18}
                    height={18}
                  />
                  按此上傳相片
                </button>
              </AvatarUpload>
            </div>
          )}

          <FullSpin open={isUploading} text="上傳中..." />
        </>
      ),
    },
  ];
  const [isAgreeChecked, setIsAgreeChecked] = useState(false);
  const [isGenerateCountExceeded, setIsGenerateCountExceeded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false);
  useEffect(() => {
    setIsNextButtonDisabled(
      formData.name !== '' && formData.email !== '' && isAgreeChecked && formData.image !== '',
    );
  }, [formData, isAgreeChecked]);

  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [hasMobile, setHasMobile] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderVisible(window.scrollY > 10);
    };
    setHasMobile(isMobile);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 提交表单
  const handleSubmit = async () => {
    if (isLoading) {
      return;
    }

    if (isNextButtonDisabled) {
      // 校验邮箱
      if (!EMAIL_REGEX.test(formData.email)) {
        setEmailError(true);
        return;
      }
      setEmailError(false);
      // router.push('/qa-collection');

      // 下一步前校验是否生成次数已用完
      try {
        setIsLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await getGenerateCount({ email: formData.email });
        if (res?.code !== 200) {
          console.error(res.message);
          Alert.show(res.message);
          return;
        }
        if (res.data.generateNumber >= 20) {
          setIsGenerateCountExceeded(true);
          return;
        }
        // email前后空格处理
        const email = formData.email.trim();
        // 表单数据存储到localstorage
        localStorage.setItem('formData', JSON.stringify({ ...formData, email }));
        router.push('/qa-collection');
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="md:flex flex-col items-center md:bg-[url('/desktop_bg.png')] bg-cover bg-center">
        <header
          className={`
          w-full z-10 flex justify-center items-center fixed top-0 left-0 right-0 bg-[#fff] p-[12px]
          transition-all duration-300 transform
          ${isHeaderVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
        >
          <Image src="/nippon_logo_dark.png" alt="logo" width={114} height={32} />
        </header>

        <div
          style={{
            margin: '0 auto',
          }}
          className="flex w-[375px] h-[510px] md:w-[800px] md:h-[1038px] flex-col relative items-center justify-center md:bg-[#0C274C]"
        >
          <Image
            src="/nippon_logo.png"
            alt="logo"
            width={843}
            height={237}
            className="absolute top-[28px] left-[50%] translate-x-[-50%] right-0 bottom-0"
            style={{ width: hasMobile ? 120 : 210, height: 'auto' }}
          />
          <Image
            src="/home_bg_low.gif"
            alt="logo"
            width={1499}
            height={1152}
            style={{ width: hasMobile ? '375px' : '800px', height: '100%' }}
            unoptimized
          />
          <Image
            src="/home_bg_low.png"
            alt="logo"
            width={1499}
            height={1152}
            className="absolute top-0 left-[50%] translate-x-[-50%] right-0 bottom-0"
            style={{ width: hasMobile ? '375px' : '800px', height: '100%' }}
          />
        </div>
        <div className="md:w-[800px] z-[1] md:bg-[#0C274C] flex flex-col items-center justify-center">
          <div className="w-[311px] md:w-[400px] mt-[21px] text-center mb-[24px] text-[16px] font-[400] text-[#FFFFFF]">
            只需填寫簡單資料，上載您的照片並回答幾個家居風格問題，Nippon Paint
            即可為您創造獨一無二的虛擬家居風格及專屬您的 COLOR ID！
          </div>
          <div className="mb-[24px]">
            {idLabFormConf.map((item) => (
              <div className="flex flex-col items-center justify-center" key={item.id}>
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#FF7CFF] text-center text-[18px] font-[700] text-[#FFFFFF]">
                  {item.id}
                </div>
                <div className="text-[16px] font-[700] text-[#77EFFC] mt-[8px]">{item.title}</div>
                {item.formItem && item.formItem}
              </div>
            ))}
          </div>
          <div className="w-[311px] md:w-[400px] flex gap-[8px] m-[auto] text-[12px] font-[400] text-[#FFFFFF]">
            <Checkbox checked={isAgreeChecked} onChange={setIsAgreeChecked} />
            <span>
              本程式將使用您的姓名及照片來為您提供AI
              虛擬試妝體驗。您的照片將在您的瀏覽器中存儲和處理。當你關閉或離開當前瀏覽器,
              您的照片將被刪除。通過上載您的照片，您確認您已年滿十八歲,
              同意我們為此目的使用您的照片, 並同意本推廣活動的
              <span className="underline">條款細則</span>
              。有關更多資訊，請參閱我們的
              <span className="underline">私隱政策</span> 。
            </span>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className={`w-[311px] md:w-[400px] h-[44px] flex gap-[8px] items-center cursor-pointer justify-center rounded-[25px] text-[15px] font-[700] text-[#FFFFFF] mt-[32px] mb-[24px] transition-all duration-300
                        ${!isLoading && isNextButtonDisabled ? 'bg-[#E30211]' : 'bg-[#CACACA]'}`}
            >
              {isLoading && <Spin indicator={<LoadingOutlined style={{ color: '#fff' }} spin />} />}
              下一步: 回答4條簡單MC題！
            </button>

            <Modal
              title="感謝支持"
              open={isGenerateCountExceeded}
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
              您已達生成上限。
              <button
                onClick={() => {
                  setIsGenerateCountExceeded(false);
                }}
                className={`w-[263px] h-[44px] cursor-pointer flex items-center justify-center rounded-[25px] text-[15px] font-[700] bg-[#FF7CFF] text-[#FFFFFF] mt-[32px] transition-all duration-300
          `}
              >
                明白
              </button>
            </Modal>
          </div>
        </div>
        <div className="md:w-[800px] md:bg-[#0C274C]">
          <div className="md:w-[800px] h-[103px] md:h-[224px] bg-[url('/footer-bg.png')]  bg-cover bg-center" />
          <div className="md:w-[800px] h-[68px] md:h-[145px] bg-[url('/nippon-ad.png')]  bg-cover bg-center" />
        </div>
      </div>
      <Alert.Container />
    </>
  );
}
