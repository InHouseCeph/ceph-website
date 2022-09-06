import { uniq } from 'lodash';

import { Role } from '@models/dtos';

export const hasRole = (userRoles: string[], authorizedRoles: string[]): boolean =>
  userRoles.reduce<boolean>((matched, role) => {
    if (matched) return matched;
    if (!authorizedRoles.includes(role)) return false;

    return true;
  }, false);

export const getAllRolesRecursive = (allRoles: Role[], roleName: string) => {
  const role = allRoles.find(item => item.name === roleName);
  if (!role) return [];

  const roles = (role.includes ?? []).reduce(
    (all, item) => {
      all.push(...getAllRolesRecursive(allRoles, item));
      return all;
    },
    [roleName],
  );

  return uniq(roles);
};
