export type AgentEventPayload<T = any> = {
    type: string;
    sourceAgent: string;
    data: T;
};
