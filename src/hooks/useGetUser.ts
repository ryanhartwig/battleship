import { useAppSelector } from '../app/hooks';
import { User } from '../types/user';
import { getUser } from '../utility/getUser';

export const useGetUser = (id: number): User | undefined => {
  const users = useAppSelector((s) => s.game.users);
  return getUser(id, users.self, users.opponents);
};

export const useGetUsers = (ids: number[]): User[] => {
  const users = useAppSelector((s) => s.game.users.opponents);
  const self = useAppSelector((s) => s.game.users.self);

  const allUsers = [self, ...users];
  return allUsers.filter((u) => ids.includes(u.id));
};
