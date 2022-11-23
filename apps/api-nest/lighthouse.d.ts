/// <reference types="lighthouse/types/global-lh" />

declare module 'lighthouse' {
  function lighthouse(
    url: string,
    flags?: Partial<LH.Flags>,
    configJson?: Partial<LH.Config.Json>,
  ): Promise<LH.RunnerResult>;
  function generateConfig(
    configJson?: Partial<LH.Config.Json>,
    flags?: Partial<LH.Flags>,
  );
  lighthouse.generateConfig = generateConfig;
  export = lighthouse;
}
