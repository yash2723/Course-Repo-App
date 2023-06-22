import { server } from '../store';
import axios from 'axios';

export const createCourse = formData => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-type': 'multipart/form-data',
      },
      withCredentials: true,
    };
    dispatch({ type: 'createCourseRequest' });

    const { data } = await axios.post(
      `${server}/course/createcourse`,
      formData,
      config
    );

    dispatch({ type: 'createCourseSuccess', payload: data.msg });
  } catch (error) {
    dispatch({
      type: 'createCourseFail',
      payload: error.response.data.msg,
    });
  }
};

export const deleteCourse = id => async dispatch => {
  try {
    const config = {
      withCredentials: true,
    };
    dispatch({ type: 'deleteCourseRequest' });

    const { data } = await axios.delete(`${server}/course/${id}`, config);

    dispatch({ type: 'deleteCourseSuccess', payload: data.msg });
  } catch (error) {
    dispatch({
      type: 'deleteCourseFail',
      payload: error.response.data.msg,
    });
  }
};

export const addLecture = (id, formdata) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-type': 'multipart/form-data',
      },
      withCredentials: true,
    };
    dispatch({ type: 'addLectureRequest' });

    const { data } = await axios.post(
      `${server}/course/${id}`,
      formdata,
      config
    );

    dispatch({ type: 'addLectureSuccess', payload: data.msg });
  } catch (error) {
    dispatch({
      type: 'addLectureFail',
      payload: error.response.data.msg,
    });
  }
};

export const deleteLecture = (courseId, lectureId) => async dispatch => {
  try {
    const config = {
      withCredentials: true,
    };
    dispatch({ type: 'deleteLectureRequest' });

    const { data } = await axios.delete(
      `${server}/course/lecture?courseId=${courseId}&lectureId=${lectureId}`,
      config
    );

    dispatch({ type: 'deleteLectureSuccess', payload: data.msg });
  } catch (error) {
    dispatch({
      type: 'deleteLectureFail',
      payload: error.response.data.msg,
    });
  }
};

export const getAllUsers = () => async dispatch => {
  try {
    const config = {
      withCredentials: true,
    };
    dispatch({ type: 'getAllUsersRequest' });

    const { data } = await axios.get(`${server}/user/admin/users`, config);

    dispatch({ type: 'getAllUsersSuccess', payload: data.users });
  } catch (error) {
    dispatch({
      type: 'getAllUsersFail',
      payload: error.response.data.msg,
    });
  }
};

export const updateUserRole = id => async dispatch => {
  try {
    const config = {
      withCredentials: true,
    };
    dispatch({ type: 'updateUserRoleRequest' });

    const { data } = await axios.put(`${server}/user/admin/user/${id}`, {}, config);

    dispatch({ type: 'updateUserRoleSuccess', payload: data.msg });
  } catch (error) {
    dispatch({
      type: 'updateUserRoleFail',
      payload: error.response.data.msg,
    });
  }
};

export const deleteUser = id => async dispatch => {
  try {
    const config = {
      withCredentials: true,
    };
    dispatch({ type: 'deleteUserRequest' });

    const { data } = await axios.delete(`${server}/user/admin/user/${id}`, config);

    dispatch({ type: 'deleteUserSuccess', payload: data.msg });
  } catch (error) {
    dispatch({
      type: 'deleteUserFail',
      payload: error.response.data.msg,
    });
  }
};

export const getDashboardStats = () => async dispatch => {
  try {
    const config = {
      withCredentials: true,
    };
    dispatch({ type: 'getAdminStatsRequest' });

    const { data } = await axios.get(`${server}/other/admin/stats`, config);

    dispatch({ type: 'getAdminStatsSuccess', payload: data });
  } catch (error) {
    dispatch({
      type: 'getAdminStatsFail',
      payload: error.response.data.msg,
    });
  }
};
