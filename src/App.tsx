import {
  SbNcbrPartialCharges,
  SbNcbrPartialChargesPreset,
} from "molstar/lib/extensions/sb-ncbr";
import { PluginUIContext } from "molstar/lib/mol-plugin-ui/context";
import {
  PluginUISpec,
  DefaultPluginUISpec,
} from "molstar/lib/mol-plugin-ui/spec";
import { PluginSpec } from "molstar/lib/mol-plugin/spec";
import { Viewer } from "./Viewer";

const MySpec: PluginUISpec = {
  ...DefaultPluginUISpec(),
  layout: {
    initial: {
      isExpanded: true,
      showControls: true,
      regionState: {
        bottom: "full",
        left: "full",
        right: "full",
        top: "full",
      },
    },
  },
  behaviors: [
    PluginSpec.Behavior(SbNcbrPartialCharges),
    ...DefaultPluginUISpec().behaviors,
  ],
};

export class Context {
  molstar: PluginUIContext;

  constructor() {
    this.molstar = new PluginUIContext(MySpec);
    this.molstar.init();
  }

  async load(url: string) {
    const cifFile = await fetch(url).then((r) => r.text());
    const data = await this.molstar.builders.data.rawData({ data: cifFile });
    const trajectory = await this.molstar.builders.structure.parseTrajectory(
      data,
      "mmcif"
    );

    // TODO: don't know how to combine these two steps into one :(
    await this.molstar.builders.structure.hierarchy.applyPreset(
      trajectory,
      "default"
    );
    this.molstar.dataTransaction(async () => {
      await this.molstar.managers.structure.component.applyPreset(
        this.molstar.managers.structure.hierarchy.current.structures,
        SbNcbrPartialChargesPreset
      );
    });
  }
}

export function App() {
  const context = new Context();
  // host this file with `http-server -p 5500 --cors`
  context.load("http://localhost:5500/src/example/1f16.fw2.cif");

  return <Viewer context={context} />;
}
