import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SortToOrderPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.sort) {
      const sortString = value.sort;
      const sorts = sortString.split(',');
      const order = {};
      for (const sort of sorts) {
        const desc = sort.charAt(0) === '-';
        const sortKey = desc ? sort.slice(1) : sort;
        const sortOrder = desc ? 'DESC' : 'ASC';
        order[sortKey] = sortOrder;
      }
      delete value.sort;
      value.order = order;
    }
    return value;
  }
}
