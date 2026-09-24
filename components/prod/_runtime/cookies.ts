/*
 * Replaces `cookies-next` inside the ported production code. The prototype has
 * no session, so sidebar collapse state is not persisted.
 */
const setCookie = async (
  _key: string,
  _value: unknown,
  _options?: unknown
): Promise<void> => {};

const getCookie = async (
  _key: string,
  _options?: unknown
): Promise<string | undefined> => undefined;

export { getCookie, setCookie };
