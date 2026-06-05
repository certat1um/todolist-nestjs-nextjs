export type SuccessResponseType<T = unknown> = {
  status: boolean;
  message: string;
  data?: T;
  meta?: unknown;
};

export type ExceptionResponseType = {
  status: boolean;
  message: string;
  errors?: unknown[];
};
