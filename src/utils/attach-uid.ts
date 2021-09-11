import lodash from 'lodash';

/**
 * Parameter decorator is the last preprocessor before a controller executes.
 * Since we enabled whitelist in the validation pipe, any properties inserted
 * to body in the inceptors and guards will be stripped off. So we have to
 * attach createdBy/updatedBy information with this utility function.
 */
export function attachUserIdToDto(
  request: Express.Request,
  dto: unknown,
  mountPathes = ['createdBy', 'updatedBy'],
  userIdPath = 'custom.userId',
) {
  const userId = lodash.get(request, userIdPath);
  for (const path of mountPathes) {
    dto[path] = userId;
  }
}
