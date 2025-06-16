import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const start = Date.now();
    const id = crypto.randomUUID();
    req['id'] = id;
    this.loggerService.logRequest(req, id);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.loggerService.logResponse(res, id, duration);
      }),
    );
  }
}
