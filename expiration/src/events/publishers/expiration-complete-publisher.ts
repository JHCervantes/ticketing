import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@jhctickets/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
