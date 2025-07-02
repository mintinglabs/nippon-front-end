'use client';
import {
  ConfigProvider,
  Drawer,
  Modal,
  Popover,
  Radio,
  RadioGroupProps,
  Slider,
  Upload,
} from 'antd';
import { useRef, useState, useEffect } from 'react';
import { isIOS, isMobile } from 'react-device-detect';
import { CameraOutlined, FolderOpenOutlined } from '@ant-design/icons';
import Alert from './Alert';
import { uploadPortrait } from '../apis/business';
import Cropper from 'react-easy-crop';

// 获取裁剪后的图片
const getCroppedImg = (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
): Promise<Blob> => {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(new Blob());
        return;
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );

      canvas.toBlob(
        (blob) => {
          resolve(blob || new Blob());
        },
        'image/jpeg',
        0.9,
      );
    };
  });
};

// 自定义样式
const customStyles = `
  .custom-radio-group .ant-radio-button-wrapper {
    width: 114px !important;
    height: 40px !important;
    line-height: 40px !important;
    text-align: center !important;
    font-weight: 400 !important;
    color: #A1A1A1 !important;
    @media (max-width: 768px) {
      width: 50% !important;
    }
  }
  
  .custom-radio-group .ant-radio-button-wrapper-checked {
    color: #fff !important;
    font-weight: 700 !important;
  }
  .custom-radio-group .ant-radio-button-wrapper-checked::before {
    background-color: #FF7CFF !important;
  }
  
 
`;

export const AvatarUpload: React.FC<{
  children: React.ReactNode;
  onUploadSuccess: (url: string) => void;
  setIsUploading: (isUploading: boolean) => void;
}> = ({ children, onUploadSuccess, setIsUploading }) => {
  const [hasMobile, setHasMobile] = useState(false);
  useEffect(() => {
    setHasMobile(isMobile);
  }, []);

  const [openFilePicker, setOpenFilePicker] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [imageUrl, setImageUrl] = useState('');
  const [scale, setScale] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadRef = useRef<any>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const albumInputRef = useRef<HTMLInputElement>(null);

  // 确保只在客户端运行
  useEffect(() => {
    setIsClient(true);
  }, []);

  const options: RadioGroupProps['options'] = [
    { label: '9:16', value: '9:16' },
    { label: '3:4', value: '3:4' },
  ];
  const [aspect, setAspect] = useState('9:16');

  const uploadCroppedImage = async (croppedFile: File) => {
    try {
      setIsUploading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await uploadPortrait({
        file: croppedFile,
        pageId: '1064650320242859',
      });
      if (res.code !== 200) {
        Alert.show(res.message);
        return;
      }
      onUploadSuccess(res.data.url);
    } catch (error) {
      console.error(error);
      Alert.show('上傳失敗，請重試');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCrop = async () => {
    if (!imageUrl || !croppedAreaPixels) {
      return;
    }

    try {
      const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);

      // 创建文件对象
      const croppedFile = new File([croppedImage], 'cropped-image.jpg', {
        type: 'image/jpeg',
      });

      // 这里可以调用上传函数
      setIsModalOpen(false);
      await uploadCroppedImage(croppedFile);

      // 关闭 Modal
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const handleCameraInputChange = async (file: File) => {
    let newFile: File = file;

    // 动态导入 heic2any，避免 SSR 问题
    if (file.type === 'image/heic') {
      try {
        const heic2any = (await import('heic2any')).default;
        const blob = await heic2any({
          blob: file,
          toType: 'image/png',
          quality: 0.9,
        });
        newFile = new File([blob as Blob], `${new Date().getTime()}.png`, { type: 'image/png' });
      } catch (error) {
        console.error('HEIC conversion failed:', error);
        Alert.show('HEIC 格式轉換失敗，請使用其他格式');
        return Upload.LIST_IGNORE;
      }
    }

    // 判断格式，只能是jpeg, png, heic, webp
    if (!['image/jpeg', 'image/png', 'image/heic', 'image/webp'].includes(file.type)) {
      Alert.show('請檢查相片格式');
      return Upload.LIST_IGNORE;
    }

    if (newFile.size > 5 * 1024 * 1024) {
      // 这里可以用 antd 的 message.error 或 alert
      Alert.show('請上傳 5MB 以下的 JPEG, PNG, HEIC 或 WebP 圖檔');
      return Upload.LIST_IGNORE; // 阻止上传
    }
    setIsModalOpen(true);
    setImageUrl(URL.createObjectURL(newFile));
  };

  // 如果还没到客户端，显示加载状态
  if (!isClient) {
    return <div>{children}</div>;
  }

  return (
    <>
      <Upload
        ref={uploadRef}
        showUploadList={false}
        action="#"
        accept="image/*"
        beforeUpload={async (file) => {
          handleCameraInputChange(file);
          return false; // 阻止自动上传
        }}
      >
        <div
          className="flex gap-[8px] flex-col"
          onClick={(e) => {
            if (isMobile && !isIOS) {
              e.stopPropagation();
              e.preventDefault();
              setOpenFilePicker(true);
              return false; // 阻止 Upload 默认行为
            }
          }}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            cursor: 'pointer',
          }}
        >
          {children}
        </div>
      </Upload>
      <Popover
        trigger="click"
        arrow={false}
        open={openFilePicker}
        onOpenChange={setOpenFilePicker}
        placement="bottomLeft"
        content={
          <div className="flex gap-[8px] flex-col">
            <div
              onClick={() => {
                setOpenFilePicker(false);
                cameraInputRef.current?.click();
              }}
              className="w-[150px] flex items-center justify-between gap-[8px] text-[14px] font-[400]"
            >
              Take photo
              <CameraOutlined />
            </div>
            <div
              onClick={() => {
                setOpenFilePicker(false);
                albumInputRef.current?.click();
              }}
              className="w-[150px] flex items-center justify-between gap-[8px] text-[14px] font-[400]"
            >
              Photo Library
              <FolderOpenOutlined />
            </div>
          </div>
        }
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleCameraInputChange(file);
          }
        }}
      />
      <input
        ref={albumInputRef}
        type="file"
        accept="image/jpeg,image/png"
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleCameraInputChange(file);
          }
        }}
      />
      <ConfigProvider
        theme={{
          components: {
            Radio: {
              buttonSolidCheckedActiveBg: '#FF7CFF',
              buttonSolidCheckedBg: '#FF7CFF',
              buttonSolidCheckedHoverBg: '#FF7CFF',
            },
            Slider: {
              trackBg: '#FF7CFF',
              trackHoverBg: '#FF7CFF',
              handleActiveColor: '#FF7CFF',
              dotActiveBorderColor: '#FF7CFF',
              handleColor: '#FF7CFF',
              handleActiveOutlineColor: '#ff7cff25',
            },
          },
        }}
      >
        {!hasMobile ? (
          <Modal
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            width={800}
            styles={{
              content: {
                padding: 24,
              },
            }}
            footer={null}
            closable={true}
            maskClosable={true}
          >
            <style dangerouslySetInnerHTML={{ __html: customStyles }} />
            <div className="w-[100%] h-[500px] relative">
              <Cropper
                style={{ containerStyle: { width: 500, height: 500 } }}
                image={imageUrl}
                aspect={Number(aspect.split(':')[0]) / Number(aspect.split(':')[1])}
                crop={crop}
                onCropChange={setCrop}
                onZoomChange={setScale}
                zoom={scale}
                onCropComplete={(_croppedArea, croppedAreaPixels) => {
                  setCroppedAreaPixels(croppedAreaPixels);
                }}
              />
              <div className="absolute top-[-5px] right-[12px] w-[228px] h-[500px] bg-[#fff] text-[#002859] p-[16px]">
                <span className="text-[16px] font-[700]">裁剪選項</span>
                <div className="text-[14px] font-[400] mt-[8px]">
                  為更佳效果，請使用9:16或3:4的直向格式，並確保人物半身完整顯示在裁切框內。
                </div>
                <div className="w-[228px] mt-[16px]">
                  <Radio.Group
                    options={options}
                    onChange={(e) => setAspect(e.target.value)}
                    value={aspect}
                    optionType="button"
                    buttonStyle="solid"
                    className="custom-radio-group"
                  />
                </div>
                <div className="w-[228px] mt-[16px]">
                  放大／縮小
                  <Slider
                    tooltip={{ open: false }}
                    value={scale}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={setScale}
                  />
                </div>
                <button
                  onClick={handleCrop}
                  className="absolute cursor-pointer bottom-[-5px] w-[228px] h-[40px] bg-[#E30211] text-[#fff] font-[700] text-[16px] rounded-[25px] mt-[16px]"
                >
                  裁剪相片
                </button>
              </div>
            </div>
          </Modal>
        ) : (
          <Drawer
            open={isModalOpen}
            placement="bottom"
            closable={false}
            onClose={() => setIsModalOpen(false)}
            height="95%"
            styles={{
              body: {
                padding: 0,
                background: '#fff',
                boxShadow: '0 -2px 16px rgba(0,0,0,0.08)',
              },
              content: {
                borderRadius: '24px 24px 0 0',
              },
            }}
          >
            {/* 关闭按钮 */}
            <div className="absolute top-0 right-0 z-[100] w-full h-[40px] bg-[#fff] flex items-center p-[16px] rounded-[24px]">
              <button
                className="text-[#0C274C] w-[32px] h-[32px] flex items-center flex-start z-10"
                onClick={() => setIsModalOpen(false)}
                aria-label="关闭"
                style={{ background: 'none', border: 'none', fontSize: 28 }}
              >
                ×
              </button>
            </div>
            <style dangerouslySetInnerHTML={{ __html: customStyles }} />
            <div className="relative w-full p-[16px] flex flex-col items-center pt-[16px] pb-[24px] min-h-[100vh] bg-[#fff] rounded-t-[24px]">
              {/* 裁剪区  高度 1:1 宽度 100%*/}
              <div className="relative w-[100%] p-[16px] aspect-square flex justify-center mt-[32px]">
                <Cropper
                  style={{ containerStyle: { width: '100%', height: '100%' } }}
                  image={imageUrl}
                  aspect={Number(aspect.split(':')[0]) / Number(aspect.split(':')[1])}
                  crop={crop}
                  onCropChange={setCrop}
                  onZoomChange={setScale}
                  zoom={scale}
                  onCropComplete={(_croppedArea, croppedAreaPixels) => {
                    setCroppedAreaPixels(croppedAreaPixels);
                  }}
                />
              </div>
              {/* 裁剪选项 */}
              <div className="w-full flex flex-col mt-[24px] px-[16px]">
                <span className="text-[16px] font-[700]">裁剪選項</span>
                <div className="text-[14px] font-[400] mt-[16px]">
                  為更佳效果，請使用9:16或3:4的直向格式，並確保人物半身完整顯示在裁切框內。
                </div>
                <div className="w-full max-w-[360px] mt-[16px]">
                  <Radio.Group
                    options={options}
                    onChange={(e) => setAspect(e.target.value)}
                    value={aspect}
                    optionType="button"
                    buttonStyle="solid"
                    className="custom-radio-group w-full"
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="w-full max-w-[360px] mt-[16px]">
                  放大／縮小
                  <Slider
                    tooltip={{ open: false }}
                    value={scale}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={setScale}
                  />
                </div>
              </div>
              <div className="w-full h-[74px] bg-[#fff]"></div>
              {/* 裁剪按钮吸底 */}
              <div className="w-full h-[74px] bg-[#fff] flex items-center justify-center">
                <button
                  onClick={handleCrop}
                  className="fixed left-1/2 -translate-x-1/2 bottom-[32px] w-[90vw] max-w-[360px] h-[48px] bg-[#E30211] text-[#fff] font-[700] text-[16px] rounded-[25px] shadow-lg z-20"
                >
                  裁剪相片
                </button>
              </div>
            </div>
          </Drawer>
        )}
      </ConfigProvider>
    </>
  );
};
