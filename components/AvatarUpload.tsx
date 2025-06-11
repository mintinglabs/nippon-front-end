import { Popover, Upload } from 'antd';
import { useRef, useState } from 'react';
import { isIOS, isMobile } from 'react-device-detect';
import { CameraOutlined, FolderOpenOutlined } from '@ant-design/icons';
import Alert from './Alert';

export const AvatarUpload: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openFilePicker, setOpenFilePicker] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadRef = useRef<any>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const albumInputRef = useRef<HTMLInputElement>(null);

  const handleCameraInputChange = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      // 这里可以用 antd 的 message.error 或 alert
      console.log('file.size', file.size);
      Alert.show('請上傳 5MB 以下的 JPEG, PNG, HEIC 或 WebP 圖檔');
      return Upload.LIST_IGNORE; // 阻止上传
    }

    // const res: any = await generateStorageSignURL({});
    // await gcsFormUpload(res.Response.Data as GcsSignData, file);
    // await updateUserInfo({
    //   Avatar: res.Response.Data.CompleteURL,
    // })
    //   .then(() => {
    //     setUserProfile({
    //       ...userProfile,
    //       Profile: {
    //         ...userProfile.Profile,
    //         Avatar: res.Response.Data.CompleteURL,
    //       },
    //     });
    //     setInnerAvatarUrl(res.Response.Data.CompleteURL);
    //   })
    //   .finally(() => {
    //     setUploading(false);
    //   });
  };
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
    </>
  );
};
