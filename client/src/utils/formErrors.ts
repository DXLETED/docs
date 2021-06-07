export const formErrors = (validation: { [key: string]: { required: boolean; errors: string[] } }): string[] =>
  Object.values(validation)
    .map(vls => vls.errors)
    .flat()
