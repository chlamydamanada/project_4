import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 400) {
      response.send(exception.getResponse());
      return;
    } else {
      response.status(status).json({
        statusCode: status,
        message: exception.getResponse(),
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
