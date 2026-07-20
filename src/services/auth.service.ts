import { database } from '../database';
import User from '../database/models/User';
import { Q } from '@nozbe/watermelondb';
import bcrypt from 'react-native-bcrypt';
import { v4 as uuidv4 } from 'uuid';

export const authService = {
  async signup(name: string, email: string, password: string): Promise<User> {
    const existing = await database.collections.get<User>('users').query(Q.where('email', email)).fetch();
    if (existing.length > 0) {
      throw new Error('User already exists');
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    let newUser: User | undefined;
    await database.write(async () => {
      newUser = await database.collections.get<User>('users').create(user => {
        user.name = name;
        user.email = email;
        user.password = hash;
      });
    });

    if (!newUser) throw new Error('Failed to create user');
    return newUser;
  },

  async login(email: string, password: string): Promise<User> {
    const users = await database.collections.get<User>('users').query(Q.where('email', email)).fetch();
    if (users.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = users[0];
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    return user;
  },

  async getUserById(userId: string): Promise<User> {
    const user = await database.collections.get<User>('users').find(userId);
    return user;
  }
};
