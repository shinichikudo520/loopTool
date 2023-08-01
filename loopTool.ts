export default abstract class LoopTool {
  protected animation; // 轮询器
  protected _timer: any = -1; // 轮询器开关
  constructor(
    private readonly interval: number,
    private readonly conditions: Array<Function> = []
  ) {}

  protected get timer() {
    return this._timer;
  }

  protected set timer(v: any) {
    this._timer = v;
  }

  /**
   * 轮询, 次/interval
   * @param isAutoUpdate 是否为轮询器自动刷新
   */
  private async loop(isAutoUpdate: boolean = false) {
    const that = this;
    const now = performance.now();

    // 同步条件
    // 1. 设置 -1 为停止状态
    // 2. 初始状态(0)/强制更新/时间间隔为 interval
    if (
      that.timer > -1 &&
      (!that.timer || !isAutoUpdate || now - that.timer > that.interval)
    ) {
      that.timer = now; // 更新时间

      try {
        let isSatisfy = true;
        for (let i = 0; i < that.conditions.length; i++) {
          const condition = that.conditions[i];
          isSatisfy = await condition();
        }

        if (isSatisfy) {
          await that.todo();
        }
      } catch (error) {
        console.warn("轮询失败....", error);
      }
    }

    that.animation = requestAnimationFrame(function () {
      that.loop(true);
    });
  }

  /** 轮询器中具体实现 */
  protected abstract todo();

  /** 挂载 */
  public mount() {
    this.timer = 1;
    this.loop(false);
    this.mounted();
  }
  /** 销毁 */
  public destory() {
    this.timer = -1;
    if (this.animation) {
      cancelAnimationFrame(this.animation);
    }
    this.destoryed();
  }
  /** 暂停 */
  public suspend() {
    this.timer = -1;
    this.suspended();
  }
  /** 重新开始 */
  public resume() {
    this.timer = 1;
    this.resumed();
  }
  /** 挂载后 */
  protected abstract mounted();
  /** 销毁后 */
  protected abstract destoryed();
  /** 暂停后 */
  protected abstract suspended();
  /** 重新开始后 */
  protected abstract resumed();
}
