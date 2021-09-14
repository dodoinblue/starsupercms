/**
 * Parameter decorator is the last preprocessor before a controller executes.
 * Since we enabled whitelist in the validation pipe, any properties inserted
 * to body in the inceptors and guards will be stripped off. So we have to
 * attach createdBy/updatedBy information with this utility function.
 */
export function attachUserIdToDto(
  userId: string,
  dto: unknown,
  mountPaths = ['createdBy', 'updatedBy'],
) {
  for (const path of mountPaths) {
    dto[path] = userId;
  }
}
