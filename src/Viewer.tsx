import { Plugin } from "molstar/lib/mol-plugin-ui/plugin";
import { Context } from "./App";

export function Viewer({ context }: { context: Context }) {
  return (
    <>
      <Plugin plugin={context.molstar} />
    </>
  );
}
