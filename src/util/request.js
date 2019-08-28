import axios from 'axios';
import Toast from '@components/Toast';

export async function get(url, showMsg = true, timeout = 5000) {
  try {
    const {
      data: { code, data, msg }
    } = await axios.get(url, {
      timeout,
      headers: { contentType: 'application/json' }
    });
    if (code === 200 || code === 0) {
      return data;
    } else {
      showMsg && Toast.show(msg);
      return -1;
    }
  } catch (error) {
    showMsg && Toast.show(error.message);
    return -1;
  }
}

export async function post(url, params, showMsg = true, timeout = 5000) {
  try {
    const {
      data: { code, data, msg }
    } = await axios.post(url, params, {
      timeout,
      headers: { 'content-type': 'application/json' }
    });
    if (code === 200 || code === 0) {
      return data;
    } else {
      showMsg && Toast.show(msg);
      return -1;
    }
  } catch (error) {
    showMsg && Toast.show(error.message);
    return -1;
  }
}
