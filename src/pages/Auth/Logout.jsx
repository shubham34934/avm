import React, { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../config/store';
import { logout } from '../../reducers/authentication';
import { useToast } from '../../context/ToastContext';

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { successToast } = useToast();
  const authentication = useAppSelector(state => state.authentication);

  useLayoutEffect(() => {
    const performLogout = async () => {
      await dispatch(logout());
      successToast('Logged out successfully!');
      navigate('/');
    };
    
    performLogout();
  }, [dispatch, navigate, successToast]);

  return (
    <div className="p-5">
      <h4>Logging out...</h4>
    </div>
  );
};

export default Logout;
