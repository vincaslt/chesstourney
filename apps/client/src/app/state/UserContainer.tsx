import { createContainer } from 'unstated-next';
import { useState, useEffect } from 'react';
import { getUserInfo, signIn } from '../api';
import { UserInfo } from '../interfaces/user';
import { SignInDTO } from '../interfaces/auth';
import { useLoading } from '../utils/useLoading';

function useUser() {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [loading, withLoading] = useLoading();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      withLoading(getUserInfo().then(({ user }) => setUserInfo(user)));
    }
  }, [withLoading]);

  const login = (dto: SignInDTO) =>
    signIn(dto).then(({ tokens: { accessToken, refreshToken }, user }) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUserInfo(user);
    });

  return { userInfo, login, loading };
}

const UserContainer = createContainer(useUser);

export default UserContainer;
