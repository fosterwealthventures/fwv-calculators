// Legacy Prisma shim retained during the free calculator migration.
// The public calculator site no longer depends on database-backed subscriptions.

export const prisma: any = new Proxy(
  {},
  {
    get() {
      return new Proxy(
        {},
        {
          get() {
            return async () => null;
          },
        }
      );
    },
  }
);
