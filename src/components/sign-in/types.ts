export interface Messages {
  /** Email field label text. */
  email: string;

  /** Component heading text. */
  title: string;

  /** Submit button caption. */
  submit: string;

  /** Password field label text. */
  password: string;

  /** Password reset button caption. */
  resetPassword: string;

  /** A message displayed when the password reset button is clicked with an empty email field. */
  emailRequired: string;

  /** A message displayed when the password reset request is fulfilled. */
  resetPasswordSuccess: string;
}

export enum Status {
  idle = 0,
  error = 1,
  success = 2,
  signingIn = 3,
  resettingPassword = 4
}
