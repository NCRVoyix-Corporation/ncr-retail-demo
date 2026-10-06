import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createUser, getCurrentUserProfileData } from '~/lib/provisioning';
import { authenticateUser, exchangeToken } from '~/lib/security';
import jwt from "jsonwebtoken";

const options = {
  site: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: 'register',
      name: 'Register',
      credentials: {
        username: {
          type: 'text',
          label: 'Username'
        },
        firstName: {
          type: 'text',
          label: 'First Name'
        },
        lastName: {
          type: 'text',
          label: 'Last Name'
        },
        emailAddress: {
          label: 'Email Address',
          type: 'text',
          placeholder: ''
        },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        let password = credentials.password;
        let userObj = {
          email: credentials.emailAddress,
          familyName: credentials.lastName,
          fullName: `${credentials.firstName} ${credentials.lastName}`,
          givenName: credentials.firstName,
          forcePasswordChange: false,
          password,
          status: 'ACTIVE',
          username: credentials.username
        };
        let user = await createUser(userObj);
        if (user.status == 200) {
          let response = await authenticateUser(credentials.username, credentials.password);
          const authenticateUserResponse = response;
          if (authenticateUserResponse.status === 200) {
            let userProfile = await getCurrentUserProfileData(authenticateUserResponse.data.token);
            if (userProfile.status == 200) {
              let user = userProfile.data;
              let expiresAt = new Date();
              expiresAt.setSeconds(expiresAt.getSeconds() + 900);
              let userSessionObj = {
                accessToken: authenticateUserResponse.data.token,
                username: user.username,
                name: user.givenName,
                expires: expiresAt
              };
              return userSessionObj;
            }
            return null;
          } else {
            return Promise.reject(authenticateUserResponse);
          }
        } else {
          let error = user.data.message;
          throw new Error(error);
        }
      }
    }),
    CredentialsProvider({
      id: 'login',
      name: 'Login',
      credentials: {
        emailAddress: {
          label: 'Email Address',
          type: 'text',
          placeholder: ''
        },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        let response = await authenticateUser(credentials.username, credentials.password);
        const { status, data } = response;
        if (status === 200) {
          let userProfile = await getCurrentUserProfileData(data.token);
          if (userProfile.status == 200) {
            let user = userProfile.data;
            let expiresAt = new Date();
            expiresAt.setSeconds(expiresAt.getSeconds() + 900);
            let userSessionObj = {
              accessToken: data.token,
              username: user.username,
              name: user.givenName,
              expires: expiresAt
            };
            return userSessionObj;
          }
          return Promise.reject();
        } else {
          return Promise.reject();
        }
      }
    }),
    CredentialsProvider({
      id: 'update-session',
      name: 'Update Session',
      credentials: {
        token: {
          label: 'Token',
          type: 'text',
          placeholder: ''
        }
      },
      authorize: async (credentials) => {
        let userProfile = await getCurrentUserProfileData(credentials.token);
        if (userProfile.status === 200) {
          let user = userProfile.data;
          let expiresAt = new Date();
          expiresAt.setSeconds(expiresAt.getSeconds() + 900);
          let userSessionObj = {
            accessToken: credentials.token,
            username: user.username,
            givenName: user.givenName,
            expires: expiresAt
          };
          return Promise.resolve(userSessionObj);
        }
        return Promise.reject();
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.token = token.accessToken;
      let now = new Date().getTime() / 1000;
      let expires = new Date(session.expires).getTime() / 1000;
      if (expires - now < 500) {
        let newToken = await exchangeToken(token.token.token.user.token);
        session.user.token = newToken.data.token;
        let expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + 900);
        session.user.expires = expiresAt;
      }
      let decodedToken = jwt.decode(session.user.token);
      session.user.username = decodedToken.sub;
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.accessToken;
      }
      if (profile) {
        token.profile = profile;
      }
      return token;
    },
    async signIn({ user, account }) {
      account.accessToken = user.accessToken;
      return true;
    }
  },
  session: {
    strategy: 'jwt'
  },
  debug: true
};

export default (req, res) => NextAuth(req, res, options);
