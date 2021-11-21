export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateEmail = (email: string): boolean => {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
};
