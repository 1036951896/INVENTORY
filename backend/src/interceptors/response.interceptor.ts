import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const request = context.switchToHttp().getRequest();
        const method = request.method;

        // Solo transformar respuestas GET
        if (method === 'GET') {
          // Si es un array, devolverlo directamente
          if (Array.isArray(data)) {
            return data;
          }

          // Si ya tiene estructura de respuesta, devolverlo tal cual
          if (data && typeof data === 'object' && ('data' in data || 'pagination' in data)) {
            return data;
          }

          // Si es un objeto plano, devolverlo tal cual
          return data;
        }

        // Para otros métodos, devolver tal cual
        return data;
      }),
    );
  }
}
