import {Message} from "node-nats-streaming";

import {Listener} from "../../../common/src/events/base-listener";
import {TicketCreatedEvent} from "../../../common/src/events/ticket-created-event";
import {Subjects} from "../../../common/src/events/subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject:Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payments-service'
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event data!', data);

        msg.ack();
    }
}
