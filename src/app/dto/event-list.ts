import { EventItemDTO } from "./event-item-dto";

export interface ListEvents{
    totalPages: number,
    events: EventItemDTO[]
}