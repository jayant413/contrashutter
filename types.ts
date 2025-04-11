export type ErrorType = { status: number; message?: string } | unknown;
export function isApiError(error: unknown): error is {
  status: number;
  message: string;
  response?: { data: { message: string } };
} {
  return typeof error === "object" && error !== null && "status" in error;
}

// Banner Types
export interface BannerType {
  image: string;
  index: number;
  _id?: string;
}

// Event Types
export interface EventType {
  eventName: string;
  description?: string;
  packageIds: PackageType[];
  serviceId: string;
  image: string | null;
  _id?: string;
  formId: string;
}

// Package Types
export interface CardDetailType {
  product_name: string;
  quantity: number;
}

export interface PackageDetailType {
  title: string;
  subtitles: string[];
}

export interface BillDetailType {
  type: string;
  amount: number;
}

export interface PackageType {
  serviceId: ServiceType;
  eventId: EventType;
  name: string;
  price: number;
  booking_price?: number;
  card_details?: CardDetailType[];
  package_details?: PackageDetailType[];
  bill_details?: BillDetailType[];
  category?: string;
  _id?: string;
}

// Service Types
export interface ServiceType {
  _id: string;
  name: string;
  events: EventType[];
}

// Service Partner Types
export interface ServicePartnerType {
  _id?: string;
  name: string;
  registrationNumber: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  businessAddress: string;
  employees: string;
  experience: string;
  projects: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  partner: UserType;
  status: "Pending" | "Active" | "Inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

// User Types
export interface UserType {
  _id?: string;
  fullname: string;
  contact: string;
  email: string;
  password: string;
  status: "Pending" | "Active" | "Inactive";
  role: "Service Provider" | "Client" | "Admin";
  notifications: Array<{
    _id?: string;
    title: string;
    message: string;
    redirectPath: string;
    read?: boolean;
    sender?: UserType;
    createdAt?: Date;
    receiverId?: string;
  }>;
  wishlist: PackageType[];
  partnerId?: string;
  dateOfBirth?: string;
  aadharCard?: string;
  panCard?: string;
  address?: string;
  profileImage?: string;
  coverImage?: string;
}

// * Razorpay Types Order Id
export interface RazorpayOrderIdType {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
export type InvoiceType = {
  bookingId: string;
  paymentType: number;
  paymentMethod: string;
  payablePrice: number;
  paidAmount: number;
  dueAmount: number;
  paymentDate?: Date;
  paymentStatus: "Pending" | "Completed" | "Failed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// Booking Types
export interface BookingType {
  _id?: string;
  userId: UserType;
  ordered?: boolean;
  booking_no: string;
  packageName?: string;
  eventName?: string;
  serviceName?: string;
  email: string;
  status?:
    | "Booked"
    | "In Progress"
    | "Deliverables Ready"
    | "Completed"
    | "Cancelled";

  statusHistory: {
    status: string;
    updatedAt: Date;
  }[];
  form_details: Record<string, string>;

  invoices: InvoiceType[];
  event_details: {
    eventDate?: Date;
    eventStartTime?: string;
    eventEndTime?: string;
    venueName?: string;
    venueAddressLine1?: string;
    venueAddressLine2?: string;
    venueCity?: string;
    venuePincode?: string;
    numberOfGuests?: number;
    specialRequirements?: string;
  };
  delivery_address: {
    sameAsClientAddress?: boolean;
    recipientName?: string;
    deliveryAddressLine1?: string;
    deliveryAddressLine2?: string;
    deliveryCity?: string;
    deliveryState?: string;
    deliveryPincode?: string;
    deliveryContactNumber?: string;
    additionalDeliveryInstructions?: string;
  };
  payment_details: {
    installment: number;
    payablePrice: number;
    paidAmount: number;
    dueAmount: number;
    paymentMethod?: string;
    paymentType?: string;
    paymentStatus?: string;
    paymentDate?: Date;
    preferredPhotographyStyle?: string;
    preferredEditingStyle?: string;
    referenceFiles?: string[];
    preferredPaymentMethod?: string;
    confirmBookingDetails?: boolean;
  };
  package_details: PackageType;
  assignedStatusHistory: {
    status: string;
    updatedAt: Date;
    servicePartner: ServicePartnerType;
  }[];
  assignedStatus: string;

  createdAt?: Date;
  updatedAt?: Date;
  servicePartner?: ServicePartnerType;
}
