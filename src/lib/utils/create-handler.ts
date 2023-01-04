import * as React from "react";
import { _UnknownContextData } from "../types/_internal";
import { normalizeError } from "./normalize-error";

export type CreateHandlerParams<
  TContextData extends _UnknownContextData,
  TServiceParams,
  TServiceResponse,
> = {
  setState: React.Dispatch<React.SetStateAction<TContextData>>;
  service: (params: TServiceParams) => Promise<TServiceResponse>;
  method: keyof Omit<TContextData, "data" | "state" | "error">;
  onSuccess?: (response: TServiceResponse) => Partial<TContextData["data"]>;
  onError?: (error: unknown) => TContextData["error"][keyof TContextData["error"]];
};

export type CreateHandlerResponse<TParams> = (params: TParams) => Promise<void>;

export function createHandler<
  TContextData extends _UnknownContextData,
  TParams extends unknown = void,
  TServiceResponse extends unknown = void,
>(
  params: CreateHandlerParams<TContextData, TParams, TServiceResponse>,
): CreateHandlerResponse<TParams> {
  const { service, setState, method, onSuccess, onError } = params;

  return async (serviceParams) => {
    setState((preveiousState) => {
      return {
        ...preveiousState,
        state: {
          ...preveiousState.state,
          [method]: "loading",
        },
      };
    });

    try {
      const response = await service(serviceParams);

      setState((preveiousState) => {
        return {
          ...preveiousState,
          state: {
            ...preveiousState.state,
            [method]: "success",
          },
          data: {
            ...preveiousState.data,
            ...(onSuccess != null ? onSuccess(response) : {}),
          },
        };
      });
    } catch (error) {
      setState((preveiousState) => {
        return {
          ...preveiousState,
          state: {
            ...preveiousState.state,
            [method]: "error",
          },
          error: {
            ...preveiousState.error,
            [method]: onError != null ? onError(error) : normalizeError(error),
          },
        };
      });
    }
  };
}
