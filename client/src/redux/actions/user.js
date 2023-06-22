import { server } from '../store';
import axios from 'axios';

export const login = (email, password) => async dispatch => {
  try {
    dispatch({ type: 'loginRequest' });

    const { data } = await axios.post(
      `${server}/user/login`,
      { email, password },
      {
        headers: {
          'Content-type': 'application/json',
        },

        withCredentials: true,
      }
    );

    dispatch({ type: 'loginSuccess', payload: data });
  } catch (error) {
    dispatch({ type: 'loginFail', payload: error.response.data.msg });
  }
};

export const register = formdata => async dispatch => {
  try {
    dispatch({ type: 'registerRequest' });

    const { data } = await axios.post(`${server}/user/register`, formdata, {
      headers: {
        'Content-type': 'multipart/form-data',
      },

      withCredentials: true,
    });

    dispatch({ type: 'registerSuccess', payload: data });
  } catch (error) {
    dispatch({ type: 'registerFail', payload: error.response.data.msg });
  }
};

export const loadUser = () => async dispatch => {
  try {
    dispatch({ type: 'loadUserRequest' });

    const { data } = await axios.get(
      `${server}/user/me`,

      {
        withCredentials: true,
      }
    );
    dispatch({ type: 'loadUserSuccess', payload: data.user });
  } catch (error) {
    dispatch({ type: 'loadUserFail', payload: error.response.data.msg });
  }
};

export const logout = () => async dispatch => {
  try {
    dispatch({ type: 'logoutRequest' });

    const { data } = await axios.get(`${server}/user/logout`, {
      withCredentials: true,
    });
    dispatch({ type: 'logoutSuccess', payload: data.msg });
  } catch (error) {
    dispatch({ type: 'logoutFail', payload: error.response.data.msg });
  }
};

export const buySubscription = () => async dispatch => {
  try {
    dispatch({ type: 'buySubscriptionRequest' });

    const { data } = await axios.get(`${server}/payment/subscribe`, {
      withCredentials: true,
    });

    dispatch({ type: 'buySubscriptionSuccess', payload: data.subscriptionId });
  } catch (error) {
    dispatch({
      type: 'buySubscriptionFail',
      payload: error.response.data.msg,
    });
  }
};

export const cancelSubscription = () => async dispatch => {
  try {
    dispatch({ type: 'cancelSubscriptionRequest' });

    const { data } = await axios.delete(`${server}/payment/subscribe/cancel`, {
      withCredentials: true,
    });

    dispatch({ type: 'cancelSubscriptionSuccess', payload: data.msg });
  } catch (error) {
    dispatch({
      type: 'cancelSubscriptionFail',
      payload: error.response.data.msg,
    });
  }
};
