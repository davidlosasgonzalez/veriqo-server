import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FactCheckerAgentService } from './fact-checker-agent.service';
import { FactualCheckRequiredData } from '@/shared/events/payloads/factual-check-required.payload';
import { AgentEventPayload } from '@/shared/events/types/agent-event-payload.type';
import { AgentEventType } from '@/shared/events/types/agent-event-type.enum';

@Injectable()
export class FactCheckerAgentListener implements OnModuleInit {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly factCheckerAgentService: FactCheckerAgentService,
    ) {}

    onModuleInit(): void {
        this.eventEmitter.on(
            AgentEventType.FACTUAL_CHECK_REQUIRED,
            async (payload: AgentEventPayload<FactualCheckRequiredData>) => {
                await this.factCheckerAgentService.handleFactualCheckRequired(
                    payload,
                );
            },
        );
    }
}
