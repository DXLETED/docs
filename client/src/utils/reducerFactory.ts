export const reducerFactory = (initialState: { [key: string]: any }, handlers: any) => (
  state = initialState,
  action: { type: keyof typeof handlers; data?: any }
): typeof initialState => {
  const handler = handlers[action.type]
  return handler ? handler(state, action) : state
}
