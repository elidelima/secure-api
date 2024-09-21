import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { CallHandler, ExecutionContext, Inject, NestInterceptor, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, of, take } from "rxjs";

const USE_CACHE_KEY = 'USE_CACHE_KEY';
const EVICT_CACHE_KEY = 'USE_CACHE_KEY';

enum CacheOperation {
    USE = 'use',
    EVICT = 'evict',
}

type CacheOptions = {
    readonly type?: CacheOperation,
    key: string;
}

export const UseCache = (options: CacheOptions) => SetMetadata(
    USE_CACHE_KEY, { type: CacheOperation.USE, ...options });
export const EvictCache = (options: CacheOptions) => SetMetadata(
    EVICT_CACHE_KEY, { type: CacheOperation.EVICT, ...options });


/**
 * Works only for @Controller layer
 * We can also use oob NestJS CacheInterceptor, but it does not offer an option for cache eviction
 */    
export class CacheInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {

        const allDecoratorKeys = [USE_CACHE_KEY, EVICT_CACHE_KEY];

        let options: CacheOptions;

        for (let decoratorKey of allDecoratorKeys) {
            options = this.reflector.getAllAndMerge<CacheOptions>(
                decoratorKey, [context.getHandler(), context.getClass()]);
            if (options) break;
        };

        if (!options) return next.handle();

        const { type, key } = options;
        switch (type) {
            case CacheOperation.USE: {
                let data = await this.cacheManager.get(key);

                if (!data) {
                    const responseObservable = next.handle();

                    responseObservable.subscribe(async (response) => {
                        await this.cacheManager.set(key, response);
                    });

                    return responseObservable;
                }
                return of(data);
            }

            case CacheOperation.EVICT: {
                await this.cacheManager.del(key);
                return next.handle();
            }
        }

        // const cacheOperations = this.reflector.getAllAndOverride<CacheOptions[]>([
        //     USE_CACHE_KEY,
        //     EVICT_CACHE_KEY
        // ], [
        //     context.getHandler(),
        //     context.getClass(),
        // ]);


        // cacheOperations.forEach((options) => {
        //     console.log(options);
        // })

        // return next.handle();
    }
}