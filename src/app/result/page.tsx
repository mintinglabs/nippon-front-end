/* eslint-disable @next/next/no-img-element */
'use client';
import { RedoOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Alert from '../../../components/Alert';
import ConnectIcon from '../../../components/ConnectIcon';
import { isMobile, isIOS } from 'react-device-detect';
import { getGenerateInfo } from '../../../apis/business';
import { adImgList, themeList } from './reducer';
import FullSpin from '../../../components/FullSpin';
import generateImage from '../../../apis/business/generateImage';
import { toPng } from 'html-to-image';

export default function Result() {
  const router = useRouter();
  const resultContainerRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [hasMobile, setHasMobile] = useState(false);

  const [shareImg, setShareImg] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);

  const getShareImg = async () => {
    if (localStorage.getItem('shareImg')) {
      setShareImg(localStorage.getItem('shareImg') || '');
      return localStorage.getItem('shareImg');
    }
    setIsLoading(true);
    try {
      const uuid = localStorage.getItem('uuid');
      if (uuid) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await generateImage(uuid);
        if (res.message === 'OK') {
          setShareImg(res.data);
          localStorage.setItem('shareImg', res.data);
        }
        return res.data;
      }
    } catch (error) {
      console.log(error);
      Alert.show('生成分享圖片失败' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const getResult = async () => {
    const uuid = localStorage.getItem('uuid');
    if (!uuid) {
      router.push('/');
      return;
    }
    try {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await getGenerateInfo({ uuid: uuid || '' });
      if (res.code !== 200) {
        Alert.show(res.message);
        return;
      }
      if (res.data.status === 'ai_image_done' || res.data.status === 'done') {
        setResult(res.data);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.log(error);
      Alert.show('生成失败');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const generateImageLoacl = async () => {
    setIsLoading(true);
    const node = resultContainerRef.current;
    if (!node) return;

    try {
      const dataUrl = await toPng(node, {
        quality: 0.5,
        pixelRatio: 2,
        cacheBust: true,
      });
      setShareImg(dataUrl);
    } catch (err) {
      console.error('toPng fail', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (result && !isIOS) {
      generateImageLoacl();
    } else if (result && isIOS) {
      getShareImg();
    }
  }, [result]);

  useEffect(() => {
    setHasMobile(isMobile);
    getResult();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = async (url: string) => {
    const blob = await (await fetch(url)).blob();
    const file = new File([blob], 'color-result.png', { type: 'image/png' });
    navigator
      .share({
        title: 'Nippon',
        text: 'Nippon',
        files: [file],
        url: window.location.href,
      })
      .catch((error) => {
        // 用户取消分享时不显示错误提示
        if (error.name !== 'AbortError') {
          Alert.show('分享失败' + error, 30000);
        }
      });
  };
  return (
    <div className="bg-[url('https://storage.googleapis.com/assets-presslogic/nippon/color-front-static/desktop_bg.png')] overflow-x-hidden bg-cover bg-center flex flex-col items-center">
      <div className="w-[100%] md:w-[600px] bg-[#fff] flex flex-col items-center">
        {shareImg && !hasMobile && (
          <div className="w-[100%] md:w-[600px] flex flex-col items-center bg-[#fff] absolute top-0 left-[50%] translate-x-[-50%]">
            <img
              src={shareImg}
              alt="result"
              width={2400}
              height={598}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        )}

        <div
          ref={resultContainerRef}
          className="w-[100%] flex flex-col items-center bg-[url('https://storage.googleapis.com/assets-presslogic/nippon/color-front-static/result_share_bg.png')] bg-cover bg-center pb-[24px] md:pb-[32px]"
        >
          <img
            src="https://storage.googleapis.com/assets-presslogic/nippon/color-front-static/result_top_bg.png"
            alt="result"
            width={2400}
            height={598}
            crossOrigin="anonymous"
            style={{ width: '100%', height: 'auto' }}
          />
          <div className="w-[343px] md:w-[530px] h-[228px] md:h-[351px] flex items-center justify-center gap-[8px] mt-[16px]">
            {result && (
              <img
                src={
                  result && result.aiImages
                    ? result.aiImages[1] || '/default-ai.png'
                    : '/default-ai.png'
                }
                alt="result"
                width={hasMobile ? 228 : 351}
                height={hasMobile ? 228 : 351}
                style={{
                  width: hasMobile ? 228 : 351,
                  height: hasMobile ? 228 : 351,
                  objectFit: 'cover',
                  display: 'block',
                }}
                crossOrigin="anonymous"
              />
            )}
            <div className="w-[100%] h-[100%] flex flex-col gap-[8px]">
              {result && (
                <>
                  <img
                    src={
                      themeList[result?.reportStyle?.style?.colorKey as keyof typeof themeList]
                        ?.image[0] || '/default-ai.png'
                    }
                    alt="result"
                    width={171}
                    height={171}
                    style={{
                      width: !hasMobile ? 171 : 110,
                      height: !hasMobile ? 171 : 110,
                      objectFit: 'cover',
                    }}
                    crossOrigin="anonymous"
                  />
                  <img
                    src={
                      themeList[result?.reportStyle?.style?.colorKey as keyof typeof themeList]
                        ?.image[1] || '/default-ai.png'
                    }
                    alt="result"
                    width={171}
                    height={171}
                    style={{
                      width: !hasMobile ? 171 : 110,
                      height: !hasMobile ? 171 : 110,
                      objectFit: 'cover',
                    }}
                    crossOrigin="anonymous"
                  />
                </>
              )}
            </div>
          </div>
          <div className="w-[343px] md:w-[530px] tracking-[4px] text-center text-[28px] font-[900] mt-[16px] text-[#143784]">
            {themeList[result?.reportStyle?.style?.colorKey as keyof typeof themeList]?.title ||
              '明亮簡約風'}
            <div
              className="w-[100%] h-[3px] mt-[8px]"
              style={{
                background:
                  'linear-gradient(90deg, #D8F2FF 0%, #00FFFF 20%, #09F9FE 21%, #23ECFD 22%, #4DD6FB 24%, #88B7F9 26%, #D190F6 28%, #FA7BF5 29%, #F685F5 30%, #EBA6F8 35%, #E2C1FA 41%, #DAD5FC 47%, #D5E4FE 54%, #D2EDFE 62%, #D2F0FF 75%, #008DFF 90%, #55B9FF 94%, #D8F2FF 100%)',
              }}
            ></div>
          </div>
          <div className="w-[343px] md:w-[530px] text-center mt-[16px]">
            <span className="text-[16px] font-[700] text-[#143784]">
              你的專屬 NP-COLOR ID 包括：
            </span>
            <div className="w-[100%] h-[171px] md:h-[263px] flex items-center justify-center gap-[8px] mt-[16px]">
              <div
                style={{
                  background:
                    themeList[result?.reportStyle?.style?.colorKey as keyof typeof themeList]
                      ?.color[0] || '#EBDACC',
                }}
                className="w-[171px] md:text-[28px] text-[20px] text-[#000000] md:w-[263px] h-[171px] md:h-[263px] text-left flex items-end font-[700] p-[8px] md:p-[16px]"
              >
                {result?.reportStyle?.colors[0]?.name}
                <br />
                {result?.reportStyle?.colors[0]?.id}
              </div>
              <div className="w-[81px] text-[#000000] md:w-[127px] h-[171px] md:h-[263px] flex flex-col text-[12px] gap-[8px] font-[700]">
                <div
                  style={{
                    background:
                      themeList[result?.reportStyle?.style?.colorKey as keyof typeof themeList]
                        ?.color[1] || '#E1E2DB',
                  }}
                  className="w-[81px] text-[12px] md:text-[18px] md:w-[127px] h-[81px] md:h-[127px] text-left flex items-end p-[8px]"
                >
                  {result?.reportStyle?.colors[1]?.name}
                  <br />
                  {result?.reportStyle?.colors[1]?.id}
                </div>
                <div
                  style={{
                    background:
                      themeList[result?.reportStyle?.style?.colorKey as keyof typeof themeList]
                        ?.color[3] || '#B7A383',
                  }}
                  className="w-[81px] text-[12px] md:text-[18px] md:w-[127px] h-[81px] md:h-[127px] text-left flex items-end p-[8px]"
                >
                  {result?.reportStyle?.colors[3]?.name}
                  <br />
                  {result?.reportStyle?.colors[3]?.id}
                </div>
              </div>
              <div className="w-[81px] text-[#000000] md:w-[127px] h-[171px] md:h-[263px] flex flex-col text-[12px] gap-[8px] font-[700]">
                <div
                  style={{
                    background:
                      themeList[result?.reportStyle?.style?.colorKey as keyof typeof themeList]
                        ?.color[2] || '#C1BBBC',
                  }}
                  className="w-[81px] text-[12px] md:text-[18px] md:w-[127px] h-[81px] md:h-[127px] text-left flex items-end p-[8px]"
                >
                  {result?.reportStyle?.colors[2]?.name}
                  <br />
                  {result?.reportStyle?.colors[2]?.id}
                </div>
                <div
                  style={{
                    background:
                      themeList[result?.reportStyle?.style?.colorKey as keyof typeof themeList]
                        ?.color[4] || '#9B705A',
                  }}
                  className="w-[81px] text-[12px] md:text-[18px] md:w-[127px] h-[81px] md:h-[127px] text-left flex items-end p-[8px]"
                >
                  {result?.reportStyle?.colors[4]?.name}
                  <br />
                  {result?.reportStyle?.colors[4]?.id}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${hasMobile ? 'border-gradient' : 'border-gradient-desktop'} w-[343px] md:w-[530px] mt-[16px] text-[12px] md:text-[16px] font-[700] text-[#143784]`}
          >
            <div className="w-[100%] h-[100%] bg-[#fff] p-[8px] md:p-[16px]">
              {result?.reportStyle?.style?.content ||
                '您嚮往陽光滿溢、整潔舒服的感覺，同時鍾情於現代簡約的純粹線條與原始質感。明亮簡約風正能滿足您的追求！乾淨的色彩、極簡的設計，保證讓你家明亮舒適，又能徹底relax，每一天都過得好自在！'}
            </div>
          </div>
        </div>

        <div className="w-[100%] flex flex-col items-center">
          <Image
            src="https://storage.googleapis.com/assets-presslogic/nippon/color-front-static/ni-color-id.png"
            alt="result"
            width={1500}
            height={184}
            style={{ width: '100%', height: 'auto' }}
          />
          {hasMobile ? (
            <button
              onClick={async () => {
                handleShare(shareImg);
              }}
              className="w-[343px] md:w-[400px] h-[44px] mt-[24px] flex items-center justify-center rounded-[25px] text-[14px] font-[700] text-[#FFFFFF] mb-[16px] transition-all duration-300
          bg-[#E30211]"
            >
              分享結果
            </button>
          ) : (
            <button
              className={`w-[343px] md:w-[400px] h-[48px] mt-[24px] mb-[16px] flex items-center justify-center gap-[8px] rounded-[25px] text-[14px] md:text-[16px] font-[700] text-[#FF7CFF] transition-all duration-300
          `}
            >
              <Image src="/right_click.png" alt="result" width={48} height={48} />
              點擊右鍵另存圖片
            </button>
          )}
          <button
            onClick={() => {
              navigator.clipboard
                .writeText(`${window.location.protocol}//${window.location.host}`)
                .then(() => {
                  setIsCopied(true);
                  setTimeout(() => {
                    setIsCopied(false);
                  }, 2000);
                })
                .catch(() => {
                  Alert.show('複製失敗');
                });
            }}
            className={`w-[343px] md:w-[400px] h-[44px] flex items-center justify-center gap-[8px] rounded-[25px] text-[14px] md:text-[15px] font-[700] text-[#002859] mb-[24px] transition-all duration-300
            border-[1px] border-[#002859] cursor-pointer
            ${isCopied ? 'bg-[#CACACA] text-[#fff] border-[1px] border-[#A1A1A1]' : ''}
          `}
          >
            {isCopied ? '複製成功' : '複製NP-COLOR ID體驗連結邀請朋友一齊玩'}
            <ConnectIcon color={isCopied ? '#fff' : '#002859'} />
          </button>
          <button
            onClick={() => {
              router.push('/');
            }}
            className={`w-[400px] h-[44px] cursor-pointer flex items-center justify-center gap-[8px] rounded-[25px] text-[15px] font-[700] text-[#002859] mb-[24px] transition-all duration-300
          `}
          >
            再玩一次
            <RedoOutlined className="text-[#002859] rotate-90 scale-x-[-1] mt-[2px]" />
          </button>
        </div>
        <div className="w-[100%] flex flex-col bg-[#02274F]">
          <Image
            src={
              adImgList[result?.reportStyle?.style?.code as keyof typeof adImgList] ||
              'https://storage.googleapis.com/assets-presslogic/nippon/color-front-static/result_ads1.png'
            }
            alt="result"
            width={2400}
            height={1125}
            style={{ width: '100%', height: 'auto' }}
          />

          <Image
            src="https://storage.googleapis.com/assets-presslogic/nippon/color-front-static/result_ads3.png"
            alt="result"
            width={1500}
            height={1150}
            style={{ width: '100%', height: 'auto' }}
          />
          <div className="w-[100%] h-[76px] mt-[-5px] z-[1] pt-[10px] flex items-center justify-center bg-[#02274F]">
            <a
              href="https://www.nipponpaint.com.hk/news/news-023/?utm_source=PL&utm_medium=website&utm_campaign=COLORIDLAB
"
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
            src="https://storage.googleapis.com/assets-presslogic/nippon/color-front-static/result_ads4.png"
            alt="result"
            width={1500}
            height={978}
            style={{ width: '100%', height: 'auto' }}
          />
          <div className="w-[100%] h-[76px] flex items-center justify-center">
            <a
              href="https://www.hktvmall.com/hktv/zh/search?q=%3A%3Acategory%3ADD00000085161%3AcategoryHotPickOrder%3ADD00000085161%3Astreet%3Amain&utm_source=PL&utm_medium=website&utm_campaign=COLORIDLAB"
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
            src="https://storage.googleapis.com/assets-presslogic/nippon/color-front-static/result_ads5.png"
            alt="result"
            width={1500}
            height={118}
            style={{ width: '100%', height: 'auto' }}
          />
          <div className="w-[100%] h-[76px] flex items-center justify-center">
            <a
              href="https://www.nipponpaint.com.hk/anti-formaldehyde-odour-less-kids-paint-series?utm_source=PL&utm_medium=website&utm_campaign=COLORIDLAB"
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
            src="https://storage.googleapis.com/assets-presslogic/nippon/color-front-static/result_ads6.png"
            alt="result"
            width={1500}
            height={329}
            style={{ width: '100%', height: 'auto', marginTop: 16 }}
          />
        </div>
      </div>

      <FullSpin open={isLoading} text="加載中..." />
      <Alert.Container />
    </div>
  );
}
