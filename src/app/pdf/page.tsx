/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Alert from '../../../components/Alert';
import { isMobile } from 'react-device-detect';
import { getGenerateInfo } from '../../../apis/business';
import { adImgList, themeList } from './reducer';
import FullSpin from '../../../components/FullSpin';
import Image from 'next/image';
// import { toPng } from 'html-to-image';

export default function Result() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasMobile, setHasMobile] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);

  const getResult = async () => {
    const uuid = searchParams.get('uuid');
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

  // const [imageUrl, setImageUrl] = useState('');

  // const genImage = () => {
  //   const node = resultRef.current;
  //   if (!node) return;
  //   toPng(node).then((dataUrl) => {
  //     setImageUrl(dataUrl);
  //   });
  // };

  // useEffect(() => {
  //   if (result) {
  //     genImage();
  //   }
  // }, [result, hasMobile]);

  useEffect(() => {
    setHasMobile(isMobile);
    getResult();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="w-[100%]  flex justify-center items-center">
      {/* {imageUrl ? (
        <div>
          <img src={imageUrl} alt="result" />
        </div>
      ) : ( */}
      <div ref={resultRef} className="w-[100%] md:w-[600px] bg-[#fff] flex flex-col items-center">
        <div
          id="result-container"
          className="w-[100%] flex flex-col items-center bg-cover bg-center pb-[24px] md:pb-[32px]"
        >
          <img
            src="https://storage.googleapis.com/assets-presslogic/nippon/color-front-static/result_top_bg.png"
            alt="result"
            width={2400}
            height={598}
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
                  />
                </>
              )}
            </div>
          </div>
          <div className="w-[343px] md:w-[530px] tracking-[4px] text-center text-[28px] font-[900] mt-[16px] text-[#143784]">
            {themeList[result?.reportStyle?.style?.colorKey as keyof typeof themeList]?.title ||
              '明亮簡約風'}
            <Image
              width={1400}
              height={19}
              src="/border.png"
              alt="border"
              className="w-[100%] h-[4px] mt-[8px]"
            />
          </div>
          <div className="w-[343px] md:w-[530px] text-center mt-[16px]">
            <span className="text-[16px] font-[700] text-[#143784]">
              你的專屬 NP-COLOR ID 包括：
            </span>
            <div className="w-[100%] h-[171px] md:h-[263px] flex items-center justify-center gap-[8px] mt-[16px]">
              <Image
                width={528}
                height={528}
                src={`/color/${result?.reportStyle?.colors[0]?.id || 'BN7651-4'}-528.png`}
                alt="result"
                className="w-[171px] md:text-[28px] object-cover text-[20px] text-[#000000] md:w-[263px] h-[171px] md:h-[263px] text-left flex items-end font-[700] "
              />
              {/* {result?.reportStyle?.colors[0]?.name} */}
              {/* <br /> */}
              {/* {result?.reportStyle?.colors[0]?.id} */}
              {/* </div> */}
              <div className="w-[81px] text-[#000000] md:w-[127px] h-[171px] md:h-[263px] flex flex-col text-[12px] gap-[8px] font-[700]">
                <Image
                  width={257}
                  height={257}
                  src={`/color/${result?.reportStyle?.colors[1]?.id || 'BA7400-1'}.png`}
                  alt="result"
                  className="w-[81px] text-[12px] object-cover md:text-[18px] md:w-[127px] h-[81px] md:h-[127px] text-left flex items-end"
                />

                <Image
                  width={257}
                  height={257}
                  src={`/color/${result?.reportStyle?.colors[3]?.id || 'BA7400-1'}.png`}
                  alt="result"
                  className="w-[81px] text-[12px] object-cover md:text-[18px] md:w-[127px] h-[81px] md:h-[127px] text-left flex items-end"
                />
              </div>
              <div className="w-[81px] text-[#000000] md:w-[127px] h-[171px] md:h-[263px] flex flex-col text-[12px] gap-[8px] font-[700]">
                <Image
                  width={257}
                  height={257}
                  src={`/color/${result?.reportStyle?.colors[2]?.id || 'BA7400-1'}.png`}
                  alt="result"
                  className="w-[81px] text-[12px] object-cover md:text-[18px] md:w-[127px] h-[81px] md:h-[127px] text-left flex items-end"
                />
                <Image
                  width={257}
                  height={257}
                  src={`/color/${result?.reportStyle?.colors[4]?.id || 'BA7400-1'}.png`}
                  alt="result"
                  className="w-[81px] text-[12px] object-cover md:text-[18px] md:w-[127px] h-[81px] md:h-[127px] text-left flex items-end"
                />
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
        <Image
          src={
            adImgList[result?.reportStyle?.style?.code as keyof typeof adImgList] ||
            '/result_ads1.png'
          }
          alt="result"
          width={2400}
          height={1125}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      {/* )} */}

      <FullSpin open={isLoading} text="加載中..." />
      <Alert.Container />
    </div>
  );
}
