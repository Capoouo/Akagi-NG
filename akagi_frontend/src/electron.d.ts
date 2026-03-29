// ===== Electron IPC API =====
export interface ElectronApi {
  /**
   * 向主进程发送单向消息
   * @param channel IPC 通道名称
   * @param args 要发送的数据
   */
  send: (channel: string, ...args: unknown[]) => void;

  /**
   * 监听来自主进程的消息
   * @param channel IPC 通道名称
   * @param func 事件处理函数
   * @returns 取消监听的函数
   */
  on: (channel: string, func: (...args: unknown[]) => void) => () => void;

  /**
   * 向主进程发送请求并灵活等待按需定义类型的响应
   * @param channel IPC 通道名称
   * @param args 要发送的数据
   */
  invoke: <T = unknown>(channel: string, ...args: unknown[]) => Promise<T>;
}

declare global {
  interface Window {
    electron: ElectronApi;
  }
}
