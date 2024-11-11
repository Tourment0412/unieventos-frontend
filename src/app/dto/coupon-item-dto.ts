export interface CouponItemDTO {
    id: string,
    name: string,
    code: string,
    type: string,
    status: string,
    expirationDate: Date,
    discount: number
}
