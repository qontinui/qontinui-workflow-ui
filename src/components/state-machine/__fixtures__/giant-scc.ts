/**
 * Synthetic giant-SCC state machine generator.
 *
 * Exists to exercise the nested-drill code path in `ChunkedGraphView` —
 * the primary chunker never produces a chunk > `CHUNK_MAX_NODES` (150)
 * from real-world configs, so without a synthetic fixture the
 * `decomposeGiantSCC` UI branch is unreachable in manual testing.
 *
 * The shape is a classic "hub + N linear branches" giant-SCC:
 *
 *     H → B1_0 → B1_1 → ... → B1_{m-1} → H    (branch 1)
 *     H → B2_0 → ...                           (branch 2)
 *       ...
 *
 * All branch nodes are only reachable through H, so every state lies in
 * a single strongly-connected component. With `m >= 20`, three branches
 * yields 61 states; ten branches yields 201 states (well above the
 * 150-state giant-SCC threshold).
 *
 * See `qontinui-workflow-utils/src/state-machine/scc-secondary.test.ts`
 * Case 2 for the canonical shape this mirrors.
 *
 * NOT EXPORTED FROM THE PACKAGE ROOT — test/dev-fixture use only. Pull
 * via the deep import:
 *
 *   import { generateGiantSCC } from
 *     "@qontinui/workflow-ui/dist/components/state-machine/__fixtures__/giant-scc";
 *
 * or reach it directly from a neighbouring runner dev component via the
 * relative source path. Keeping it off the public exports keeps test
 * helpers out of production bundles.
 */

import type {
  StateMachineState,
  StateMachineTransition,
} from "@qontinui/shared-types";

export interface GenerateGiantSCCOptions {
  /**
   * Number of linear branches emanating from the hub. Default 10.
   * Total states = 1 + branches * branchLength.
   */
  branches?: number;
  /**
   * States per branch (not counting the hub). Default 20.
   */
  branchLength?: number;
  /**
   * Stable prefix for generated state ids (e.g. "dev-giant"). Default
   * "giant".
   */
  idPrefix?: string;
  /**
   * Config id to stamp on every state + transition. Default
   * "synthetic-giant-scc".
   */
  configId?: string;
}

export interface GiantSCCFixture {
  states: StateMachineState[];
  transitions: StateMachineTransition[];
  /** The hub state id — convenient for auto-drill targeting. */
  hubStateId: string;
}

/**
 * Generate a synthetic state machine containing exactly ONE giant SCC.
 *
 * Defaults (`branches=10`, `branchLength=20`) produce a 201-state SCC,
 * which exceeds `ChunkedGraphView`'s 150-state giant-SCC threshold and
 * therefore triggers the nested-overview render path.
 */
export function generateGiantSCC(
  opts: GenerateGiantSCCOptions = {},
): GiantSCCFixture {
  const branches = opts.branches ?? 10;
  const branchLength = opts.branchLength ?? 20;
  const idPrefix = opts.idPrefix ?? "giant";
  const configId = opts.configId ?? "synthetic-giant-scc";
  const timestamp = "2026-04-24T00:00:00Z";

  const mkState = (stateId: string, name: string): StateMachineState => ({
    acceptance_criteria: [],
    confidence: 1.0,
    config_id: configId,
    created_at: timestamp,
    description: null,
    domain_knowledge: [],
    element_ids: [],
    extra_metadata: stateId === `${idPrefix}-hub` ? { initial: true } : {},
    id: `uuid-${stateId}`,
    name,
    render_ids: [],
    state_id: stateId,
    updated_at: timestamp,
  });

  const mkTransition = (
    transitionId: string,
    from: string,
    to: string,
  ): StateMachineTransition => ({
    actions: [],
    activate_states: [to],
    config_id: configId,
    created_at: timestamp,
    exit_states: [],
    extra_metadata: {},
    from_states: [from],
    id: `uuid-${transitionId}`,
    name: transitionId,
    path_cost: 1,
    stays_visible: false,
    transition_id: transitionId,
    updated_at: timestamp,
  });

  const hubId = `${idPrefix}-hub`;
  const states: StateMachineState[] = [mkState(hubId, "Hub")];
  const transitions: StateMachineTransition[] = [];
  let tCounter = 0;
  const nextTid = () => `${idPrefix}-t${tCounter++}`;

  for (let k = 1; k <= branches; k++) {
    const branchIds: string[] = [];
    for (let i = 0; i < branchLength; i++) {
      const sid = `${idPrefix}-b${k}-s${i}`;
      branchIds.push(sid);
      states.push(mkState(sid, `Branch ${k} Step ${i}`));
    }
    // Hub → first branch state.
    transitions.push(mkTransition(nextTid(), hubId, branchIds[0]!));
    // Linear chain inside the branch.
    for (let i = 1; i < branchLength; i++) {
      transitions.push(
        mkTransition(nextTid(), branchIds[i - 1]!, branchIds[i]!),
      );
    }
    // Tail back to hub — closes the SCC.
    transitions.push(
      mkTransition(nextTid(), branchIds[branchLength - 1]!, hubId),
    );
  }

  return { states, transitions, hubStateId: hubId };
}
