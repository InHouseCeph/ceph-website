import { Role } from '@models/dtos';

export enum UserRole {
  EVERYONE = 'everyone',
  AUTHENTICATED = 'authenticated',
  USER = 'user',
  ADMIN = 'admin',
}

export const roles: Role[] = [
  { id: UserRole.ADMIN, name: 'Admin', description: 'Readonly', includes: [UserRole.USER] },
];
