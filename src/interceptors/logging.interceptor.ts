import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { appEnv } from '../config/environment';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const call$ = next.handle();
    if (!appEnv.isDevMode) {
      return call$;
    }
    const request = context.switchToHttp().getRequest();
    const content = request.method + ' -> ' + request.url;
    console.log('+++Request:', content);
    const now = Date.now();
    return call$.pipe(
      tap(() => console.log('+++Response: ', content, `${Date.now() - now}ms`)),
    );
  }
}
