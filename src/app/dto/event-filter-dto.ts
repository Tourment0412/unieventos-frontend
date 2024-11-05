export interface EventFilterDTO {
    name: String,
    //TODO EventType in the backend is an enum should it be a string here?
    evenType: String,
    city: string,
    page: number

}
