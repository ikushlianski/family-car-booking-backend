// import { IUserDomain } from './user.types';
// import { RawDbItem } from '../db/db.types';
//
// export const userDbToDomain = (rawDbItem: RawDbItem): IUserDomain => {
//   return {
//     username: userFromDB.pk.split('user#')[1],
//     password: userFromDB.password,
//     sessionId: userFromDB.sessionId,
//   };
// };
//
// export const userDomainToDb = (userDomain: IUserDomain) => {
//   const passwordInDbFormat = Buffer.from(userDomain.password).toString(
//     'base64',
//   );
//
//   console.log({ passwordInDbFormat });
//
//   return {
//     pk: `user#${userDomain.username}`,
//     sk: `user#${userDomain.username}`,
//     password: passwordInDbFormat,
//     sessionId: userDomain.sessionId,
//   };
// };
