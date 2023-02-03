import { Continify } from 'continify'
import { RouteOptions, Request } from 'continify-http'

export interface RBACStore {
  get(id: string): Promise<Array<string> | undefined>
  set(id: string, permissions: Array<string>): Promise<void>
}

export interface ContinifyRBACOptions {
  store?: RBACStore
}

export type ContinifyRBACPlugin = (
  ins: Continify,
  options: ContinifyRBACOptions
) => Promise<void>

export interface RBAC {
  store: Readonly<RBACStore>

  set(id: string, permissions: Array<string>): Promise<void>
  has(id: string, permissions: Array<string> | string): Promise<boolean>
}

declare const plugin: ContinifyRBACPlugin
export = plugin

declare module 'avvio' {
  interface Use<I, C = context<I>> {
    (fn: ContinifyRBACPlugin, options?: ContinifyRBACOptions): C
  }
}

declare module 'continify' {
  interface ContinifyOptions {
    rbac?: ContinifyRBACOptions
  }

  interface Continify {
    $rbac: RBAC
  }
}

declare module 'continify-http' {
  interface RouteOptions {
    permissions?: Array<string> | string
  }

  interface Request {
    $permissions?: Array<string>
  }
}
