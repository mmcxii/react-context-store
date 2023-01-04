import { RequestState } from "./request-state";

export type BaseContextType<
  T extends {
    methods: Record<string, (params?: unknown) => void | Promise<void>>;
    data?: Record<string, unknown>;
    errorType?: unknown;
  },
> = {
  data?: T["data"];
  state: Record<keyof T["methods"], RequestState>;
  error: Record<keyof T["methods"], null | T["errorType"]>;
} & T["methods"];
