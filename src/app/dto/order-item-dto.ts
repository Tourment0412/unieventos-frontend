import { OrderDetailDTO } from './order-detail-dto';

export interface OrderItemDTO {

  clientId: string;
  orderDate: Date;
  items: OrderDetailDTO[];
  paymentType: string;
  status: string;
  paymentDate: Date | null;
  transactionValue: number;
  id: string;
  total: number;
  couponId: string | null;


}
