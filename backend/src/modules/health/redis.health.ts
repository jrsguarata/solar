import { Injectable, Inject } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Tenta fazer um set/get no Redis para verificar conectividade
      const testKey = '__health_check__';
      const testValue = Date.now().toString();

      await this.cacheManager.set(testKey, testValue, 10); // TTL de 10 segundos
      const retrieved = await this.cacheManager.get(testKey);

      if (retrieved === testValue) {
        await this.cacheManager.del(testKey);
        return this.getStatus(key, true, { message: 'Redis is up and running' });
      }

      throw new Error('Redis read/write test failed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new HealthCheckError(
        'Redis health check failed',
        this.getStatus(key, false, { message: errorMessage }),
      );
    }
  }
}
