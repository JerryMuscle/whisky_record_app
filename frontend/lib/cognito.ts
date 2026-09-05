import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

const userPool = new CognitoUserPool({
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? "",
  ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? "",
});

export type CognitoTokens = {
  idToken: string;
  accessToken: string;
  refreshToken: string;
};

function sessionToTokens(session: CognitoUserSession): CognitoTokens {
  return {
    idToken: session.getIdToken().getJwtToken(),
    accessToken: session.getAccessToken().getJwtToken(),
    refreshToken: session.getRefreshToken().getToken(),
  };
}

export function signUp(email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const attributes = [new CognitoUserAttribute({ Name: "email", Value: email })];
    userPool.signUp(email, password, attributes, [], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export function confirmSignUp(email: string, code: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });
    user.confirmRegistration(code, true, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export function signIn(email: string, password: string): Promise<CognitoTokens> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    user.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(sessionToTokens(session)),
      onFailure: (err) => reject(err),
    });
  });
}

export function signOut(): void {
  const user = userPool.getCurrentUser();
  user?.signOut();
}

export function forgotPassword(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });
    user.forgotPassword({
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
    });
  });
}

export function confirmForgotPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });
    user.confirmPassword(code, newPassword, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
    });
  });
}

export function getCurrentSession(): Promise<CognitoTokens | null> {
  return new Promise((resolve) => {
    const user = userPool.getCurrentUser();
    if (!user) return resolve(null);
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session) return resolve(null);
      if (!session.isValid()) return resolve(null);
      resolve(sessionToTokens(session));
    });
  });
}
