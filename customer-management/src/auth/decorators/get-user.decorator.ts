import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Customer } from '../../customers/entities/customer.entity';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Customer => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
