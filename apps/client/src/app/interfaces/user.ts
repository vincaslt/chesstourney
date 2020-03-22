export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
}

export interface UserInfoDTO {
  _id: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
  verified: boolean;
}

export type UserInfo = Omit<UserInfoDTO, 'createdAt' | 'updatedAt'> & {
  createdAt: Date;
  updatedAt: Date;
};

export function fromUserInfoDTO(dto: UserInfoDTO): UserInfo {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt)
  };
}
