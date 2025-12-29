import { AsyncLocalStorage } from 'async_hooks';

interface RequestContext {
  userId?: string;
}

export class RequestContextService {
  private static asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

  static run<T>(userId: string | undefined, callback: () => T): T {
    return this.asyncLocalStorage.run({ userId }, callback);
  }

  static getUserId(): string | undefined {
    const store = this.asyncLocalStorage.getStore();
    return store?.userId;
  }

  static getStore(): RequestContext | undefined {
    return this.asyncLocalStorage.getStore();
  }
}
