import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export const saveFortune = async (fortuneData) => {
  try {
    const response = await api.post('/fortune', fortuneData);
    return response.data;
  } catch (error) {
    console.error('保存运势失败:', error);
    throw error;
  }
};

export const getFortune = async (shareCode) => {
  try {
    const response = await api.get(`/fortune/${shareCode}`);
    return response.data;
  } catch (error) {
    console.error('获取运势失败:', error);
    throw error;
  }
};

export const getShareQRCode = async (shareCode) => {
  try {
    const response = await api.get(`/share/${shareCode}`);
    return response.data;
  } catch (error) {
    console.error('获取分享二维码失败:', error);
    throw error;
  }
}; 