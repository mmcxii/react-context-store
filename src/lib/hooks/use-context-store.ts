import * as React from "react";
import { _UnknownContextData } from "../types/_internal";
import {
  createHandler as baseCreateHandler,
  CreateHandlerParams,
  CreateHandlerResponse,
} from "../utils";

export type UseContextStoreParams<TContextData> = {
  initialValues: TContextData;
};

type UseContextStoreResponse<TContextData extends _UnknownContextData> = [
  state: TContextData,
  createHandler: <TParams extends unknown = void, TResponse extends unknown = void>(
    params: Omit<CreateHandlerParams<TContextData, TParams, TResponse>, "setState">,
  ) => CreateHandlerResponse<TParams>,
];

export function useContextStore<TContextData extends _UnknownContextData>(
  params: UseContextStoreParams<TContextData>,
): UseContextStoreResponse<TContextData> {
  const { initialValues } = params;

  //* State
  const [state, setState] = React.useState<TContextData>(initialValues);

  //* Handlers
  function createHandler<TParams extends unknown = void, TResponse extends unknown = void>(
    params: Omit<CreateHandlerParams<TContextData, TParams, TResponse>, "setState">,
  ) {
    return baseCreateHandler<TContextData, TParams, TResponse>({
      setState,
      ...params,
    });
  }

  return [state, createHandler];
}
