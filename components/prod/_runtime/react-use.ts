/*
 * React 19's `use(Context)` on React 18. Only the context form is used by the
 * ported code; promises are not supported.
 */
import type { Context } from "react";
import { useContext } from "react";

const use = <T>(context: Context<T>): T => useContext(context);

export { use };
