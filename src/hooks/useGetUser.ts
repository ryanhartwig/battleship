import { useAppSelector } from '../app/hooks';
import { User } from '../types/user';

export const useGetUser = (id: number) => {
  const users = useAppSelector((s) => s.game.users);
  return users.self.id === id ? users.self : users.opponents.find((u) => u.id === id);
};

export const useGetUsers = (ids: number[]): User[] => {
  const users = useAppSelector((s) => s.game.users.opponents);
  const self = useAppSelector((s) => s.game.users.self);

  const allUsers = [self, ...users];
  return allUsers.filter((u) => ids.includes(u.id));
};
