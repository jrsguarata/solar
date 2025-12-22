import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private dataSource: DataSource) {}

  use(req: Request, res: Response, next: NextFunction) {
    const queryRunner = this.dataSource.createQueryRunner();

    // Armazena a requisição no contexto do queryRunner
    if (!queryRunner.data) {
      queryRunner.data = {};
    }
    queryRunner.data.request = req;

    // Libera o queryRunner ao final da requisição
    res.on('finish', () => {
      queryRunner.release();
    });

    next();
  }
}
