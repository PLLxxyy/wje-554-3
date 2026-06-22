import { OrderStatus, WarrantyStatus } from '../../../constants/enums';
import { UserEntity } from '../../auth/auth.service';
import { ServiceEntity } from '../../service/entities/service.entity';
import { WorkerEntity } from '../../worker/entities/worker.entity';

export interface OrderEntity {
  id: string;
  orderNo: string;
  serviceItemId: string;
  customerId: string;
  workerId?: string;
  address: string;
  addressDetail: string;
  contactPhone: string;
  scheduledTime: string;
  status: OrderStatus;
  totalPrice: number;
  actualDuration?: number;
  rating?: number;
  comment?: string;
  cancelReason?: string;
  completedAt?: string;
  guaranteeUsed: boolean;
  createdAt: string;
  updatedAt: string;
  serviceItem?: ServiceEntity;
  customer?: UserEntity;
  worker?: WorkerEntity;
  warrantyStatus?: WarrantyStatus;
  warrantyRemainingDays?: number;
}
