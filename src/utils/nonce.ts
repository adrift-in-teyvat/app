export const nonce = () => {
  return Math.random().toString(36).substring(2);
};
