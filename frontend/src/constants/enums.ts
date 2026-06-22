export enum OrderStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  ACCEPTED = 'ACCEPTED',
  ON_THE_WAY = 'ON_THE_WAY',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  RATED = 'RATED',
  CANCELLED = 'CANCELLED'
}

export enum WarrantyStatus {
  NONE = 'WARRANTY_NONE',
  ACTIVE = 'WARRANTY_ACTIVE',
  USED = 'WARRANTY_USED',
  EXPIRED = 'WARRANTY_EXPIRED'
}

export enum ServiceCategory {
  CLEANING = 'CLEANING',
  REPAIR = 'REPAIR',
  PLUMBING = 'PLUMBING',
  MOVING = 'MOVING',
  ERRAND = 'ERRAND'
}

export enum WorkerStatus {
  ONLINE = 'ONLINE',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE',
  PENDING_REVIEW = 'PENDING_REVIEW'
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  WORKER = 'WORKER',
  ADMIN = 'ADMIN'
}

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
