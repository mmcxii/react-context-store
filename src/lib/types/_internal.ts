import { BaseContextType } from "./base-context";

export type _UnknownContextData = BaseContextType<{
  methods: Record<string, any>;
  data: Record<string, unknown>;
  errorType: unknown;
}>;
