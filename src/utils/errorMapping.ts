export const mapAuthError = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "invalid email or password";
    case "auth/email-already-in-use":
      return "email already in use";
    case "auth/weak-password":
      return "password should be at least 6 characters";
    case "auth/invalid-email":
      return "invalid email address";
    case "auth/network-request-failed":
      return "network error. please check your connection";
    case "auth/too-many-requests":
      return "too many attempts. please try again later";
    default:
      return "an unexpected error occurred. please try again";
  }
};
