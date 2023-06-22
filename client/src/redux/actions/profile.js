import { server } from '../store';
import axios from 'axios';

export const updateProfile = (name, email) => async dispatch => {
  try {
    dispatch({ type: 'updateProfileRequest' });

    const { data } = await axios.put(
      `${server}/user/updateprofile`,
      {
        name,
        email,
      },
      {
        headers: {
          'Content-type': 'application/json',
        },

        withCredentials: true,
      }
    );

    dispatch({ type: 'updateProfileSuccess', payload: data.msg });
  } catch (error) {
    dispatch({
      type: 'updateProfileFail',
      payload: error.response.data.msg,
    });
  }
};

export const updateProfilePicture = formdata => async dispatch => {
  try {
    dispatch({ type: 'updateProfilePictureRequest' });

    const { data } = await axios.put(
      `${server}/user/updateprofilepicture`,
      formdata,
      {
        headers: {
          'Content-type': 'multipart/form-data',
        },

        withCredentials: true,
      }
    );

    dispatch({ type: 'updateProfilePictureSuccess', payload: data.msg });
  } catch (error) {
    dispatch({
      type: 'updateProfilePictureFail',
      payload: error.response.data.msg,
    });
  }
};

export const changePassword = (oldPassword, newPassword) => async dispatch => {
  try {
    dispatch({ type: 'changePasswordRequest' });

    const { data } = await axios.put(
      `${server}/user/changepassword`,
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          'Content-type': 'application/json',
        },

        withCredentials: true,
      }
    );

    dispatch({ type: 'changePasswordSuccess', payload: data.msg });
  } catch (error) {
    dispatch({
      type: 'changePasswordFail',
      payload: error.response.data.msg,
    });
  }
};

export const forgetPassword = email => async dispatch => {
  try {
    dispatch({ type: 'forgetPasswordRequest' });

    const config = {
      headers: {
        'Content-type': 'application/json',
      },

      withCredentials: true,
    };

    const { data } = await axios.post(
      `${server}/user/forgetpassword`,
      {
        email,
      },
      config
    );

    dispatch({ type: 'forgetPasswordSuccess', payload: data.msg });
  } catch (error) {
    dispatch({
      type: 'forgetPasswordFail',
      payload: error.response.data.msg,
    });
  }
};

export const resetPassword = (token, password) => async dispatch => {
  try {
    dispatch({ type: 'resetPasswordRequest' });
    const config = {
      headers: {
        'Content-type': 'application/json',
      },

      withCredentials: true,
    };

    const { data } = await axios.put(
      `${server}/user/resetpassword/${token}`,
      {
        password,
      },
      config
    );

    dispatch({ type: 'resetPasswordSuccess', payload: data.msg });
  } catch (error) {
    dispatch({
      type: 'resetPasswordFail',
      payload: error.response.data.msg,
    });
  }
};

export const addToPlaylist = id => async dispatch => {
  try {
    dispatch({ type: 'addToPlaylistRequest' });

    const config = {
      headers: {
        'Content-type': 'application/json',
      },

      withCredentials: true,
    };

    const { data } = await axios.post(
      `${server}/user/addtoplaylist`,
      {
        id,
      },
      config
    );

    dispatch({ type: 'addToPlaylistSuccess', payload: data.msg });
  } catch (error) {
    dispatch({
      type: 'addToPlaylistFail',
      payload: error.response.data.msg,
    });
  }
};

export const removeFromPlaylist = id => async dispatch => {
  try {
    dispatch({ type: 'removeFromPlaylistRequest' });

    const config = {
      withCredentials: true,
    };

    const { data } = await axios.delete(
      `${server}/user/removefromplaylist?id=${id}`,
      config
    );

    dispatch({ type: 'removeFromPlaylistSuccess', payload: data.msg });
  } catch (error) {
    dispatch({
      type: 'removeFromPlaylistFail',
      payload: error.response.data.msg,
    });
  }
};
