import { Request } from 'express';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

import { PaginationQueryDto } from '../dto/pagination-query.dto';

export function buildPaginationOptions(
  req: Request,
  query: PaginationQueryDto,
): IPaginationOptions {
  return {
    page: query.page,
    limit: query.limit,
    route: `${req.protocol}://${req.get('host')}${req.baseUrl}`,
  };
}
