import LoopTool from "./loopTool";

export default class TestLoop extends LoopTool {
  static tool: TestLoop | null;
  static getInstance(
    interval: number = 60000,
    conditions: Array<Function> = []
  ) {
    if (TestLoop.tool === null) {
      TestLoop.tool = new TestLoop(interval, conditions);
    }
    return TestLoop.tool;
  }

  /** 挂载后 */
  protected mounted() {}
  /** 销毁后 */
  protected destoryed() {
    TestLoop.tool = null;
  }
  /** 暂停后 */
  protected suspended() {}
  /** 重新开始后 */
  protected resumed() {}
  protected async todo() {
    // todo...
  }
}

// test...
const tool = TestLoop.getInstance();
/** 挂载 */
tool.mount();
/** 卸载 */
tool.destory();
