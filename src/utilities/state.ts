import { Context } from "grammy";

type ResponseHandler = (ctx: Context) => Promise<void>;

type ConversationState = {
  waitingForResponse: boolean;
  conversationType: string;
  handler: ResponseHandler | null;
  lastInteractionTime: number;
  timeout?: NodeJS.Timeout;
};

class StateManager {
  private userStates: Map<number, ConversationState> = new Map();
  private readonly TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Set a user as waiting for a response
   */
  public setWaitingForResponse(userId: number, conversationType: string, handler: ResponseHandler | null = null): void {
    this.clearTimeout(userId);
    
    this.userStates.set(userId, {
      waitingForResponse: true,
      conversationType,
      handler,
      lastInteractionTime: Date.now(),
      timeout: setTimeout(() => {
        this.clearState(userId);
      }, this.TIMEOUT_DURATION)
    });
  }

  /**
   * Check if user is waiting for a response
   */
  public isWaitingForResponse(userId: number): boolean {
    const state = this.userStates.get(userId);
    return state ? state.waitingForResponse : false;
  }

  /**
   * Get the conversation type for a user
   */
  public getConversationType(userId: number): string | null {
    const state = this.userStates.get(userId);
    return state ? state.conversationType : null;
  }

  /**
   * Get the handler for a user
   */
  public getHandler(userId: number): ResponseHandler | null {
    const state = this.userStates.get(userId);
    return state ? state.handler : null;
  }

  /**
   * Mark a conversation as completed
   */
  public clearState(userId: number): void {
    this.clearTimeout(userId);
    this.userStates.delete(userId);
  }

  /**
   * Clear timeout if it exists
   */
  private clearTimeout(userId: number): void {
    const state = this.userStates.get(userId);
    if (state && state.timeout) {
      clearTimeout(state.timeout);
    }
  }
}

export const stateManager = new StateManager();