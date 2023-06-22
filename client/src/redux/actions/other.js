import { server } from '../store';
import axios from 'axios';

export const contactUs = (name, email, message) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
      withCredentials: true,
    };

    dispatch({ type: 'contactRequest' });

    const { data } = await axios.post(
      `${server}/other/contact`,
      { name, email, message },
      config
    );

    dispatch({ type: 'contactSuccess', payload: data.msg });
  } catch (error) {
    dispatch({
      type: 'contactFail',
      payload: error.response.data.msg,
    });
  }
};

export const courseRequest = (name, email, course) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
      withCredentials: true,
    };

    dispatch({ type: 'courseRequestRequest' });

    const { data } = await axios.post(
      `${server}/other/courserequest`,
      { name, email, course },
      config
    );

    dispatch({ type: 'courseRequestSuccess', payload: data.msg });
  } catch (error) {
    dispatch({
      type: 'courseRequestFail',
      payload: error.response.data.msg,
    });
  }
};
