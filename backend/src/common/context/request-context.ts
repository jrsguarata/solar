import { AsyncLocalStorage } from 'async_hooks';

interface RequestContext {
  userId?: string;
}

export class RequestContextService {
  private static asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

  static run(userId: string | undefined, callback: () => void): void {
    this.asyncLocalStorage.run({ userId }, callback);
  }

  static getUserId(): string | undefined {
    const store = this.asyncLocalStorage.getStore();
    return store?.userId;
  }
}
