import { request } from '../lib/base';
import { generateRequestId } from '../../utils/generator';

interface UploadPortraitRequest {
  file: File;
  pageId: string;
}

interface SubmitFormRequest {
  pageId: string;
  name: string;
  email: string;
  image: string;
  answers: string[];
}

// 上传相片
export const uploadPortrait = (data: UploadPortraitRequest) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formData: any = new FormData();
  formData.append('file', data.file);
  formData.append('pageId', data.pageId);
  formData.append('requestId', generateRequestId());

  return request.post('/articleWebAPI/nippon/v1/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 获取生成次数
export const getGenerateCount = (data: { email: string }) => {
  return request.post('/articleWebAPI/nippon/v1/describeGenerateNumber', {
    ...data,
    requestId: generateRequestId(),
  });
};

// 提交表单
export const submitForm = (data: SubmitFormRequest) => {
  return request.post('/articleWebAPI/nippon/v1/apply', {
    ...data,
    requestId: generateRequestId(),
  });
};

// 获取生成信息
export const getGenerateInfo = (data: { uuid: string }) => {
  return request.post('/articleWebAPI/nippon/v1/describeApply', {
    ...data,
    requestId: generateRequestId(),
  });
};
