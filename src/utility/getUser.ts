import { User } from '../types/user';

export const getUser = (id: number, self: User, opponents: User[]): User => {
  return self.id === id ? self : (opponents.find((o) => o.id === id) as User);
};
