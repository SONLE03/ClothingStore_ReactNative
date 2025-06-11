// ProductInterface
export interface Product {
    Id: string;
    ProductName: string;
    ImageSource: string;
    Unit: string;
    Description: string;
    BrandName: string;
    CategoryName: string;
    DisplayPrice: string;
    Discount : number;
    Materials: string[];
    Designers: string[];
    ProductVariants: ProductItem[];
}

export interface ProductItem {
    Id: string;
    ColorId: string;
    ColorName: string;
    DisplayDimension: string;
    Quantity: number;
    Price: number;
    ImageSource: string[];
}

// Gender
export interface Gender {
    id: string;
    name: string;
    
}

// Category
export interface Category {
    Id : string;
    CategoryName: string;
    ImageSource: string;
}

//Order 
export interface OrderItem {
    Id: string;
    ProductId: string;
    ProductName: string | null;
    Dimension: string;
    ColorId: string;
    ColorName: string | null;
    Price: number;
    Quantity: number;
    SubTotal: number;
}

//Cart 
export interface CartItems {
    productItemId: string;
    quantity: number;
}

export interface ProductItemInCart {
    ProductId: string;
    ColorName: string;
    Quantity: number;
    Price: number;
    ProductName: string;
    Image: string;
    Dimension: string;
    Id: string;
}

//Favourite
export interface FavouriteItems {
    productIds: string[];
}
    
//Coupons
export interface ExistedCoupon {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    discountValue: number;
    minimumBill: number;
    quantity: number;
    eventStatus: string;
}

//Order

export interface Address {
    Id: string;
    Province: string;
    District: string;
    Ward: string;
    SpecificAddress: string;
    PostalCode: string;
    IsDefault: boolean;
}

export interface Orders {
    Id: string;
    PhoneNumber: string;
    Email: string;
    PaymentMethod: string;
    CanceledAt: string;
    CompletedAt: string;
    DeliveredAt: string;
    Note: string;
    ShippingFee: number;
    OrderStatus: string;
    UserId: string;
    FullName: string | null;
    Address: Address;
    TaxFee: number;
    SubTotal: number;
    Total: number;
    AccountsReceivable: number;
    OrderItemResponses: OrderItemResponse[];
}

export interface OrderItemResponse {
    Id: string;
    ProductId: string;
    ProductName: string | null;
    Dimension: string;
    ColorId: string;
    ColorName: string | null;
    Price: number;
    Quantity: number;
    SubTotal: number;
}

export interface OrdersAnalysis{
    totalAmount: number,
    distinctProductItemCount: number,
    totalQuantity: number,
}


export interface CreateOrderRequest {
    PhoneNumber: string;
    Email: string;
    PaymentMethod: number;
    ShippingFee: number;
    Note: string;
    CouponId?: string; // Optional, if not used
    UserId: string;
    AddressId: string;
    TaxFee: number;
    SubTotal: number;
    Total: number;
    OrderItems: string[];
}

//Address

export interface AddressRequest {
    phone: string;
    province: string;
    district: string;
    ward: string;
    specificAddress: string;
}

export interface AddressInfo {
    Id: string;
    IsDefault: string;
    Province: string;
    District: string;
    Ward: string;
    SpecificAddress: string;
    PostalCode: string;
}

//Province 
// types.ts
export interface Province {
    province_id: string;
    province_name: string;
    province_type: string;
  }
  
  export interface District {
    district_id: string;
    district_name: string;
  }
  
  export interface Ward {
    ward_id: string;
    ward_name: string;
  }
  
//User
export interface UserProps {
  createdAt: string;
  Id: string;
  FullName: string;
  Email: string;
  DateOfBirth: string;
  PhoneNumber: string | null;
  ImageSource: string | null;
  Role: string;
  IsDeleted: boolean;
  IsLocked: boolean;
}
export interface UserPropsDetail {
  createdAt: string;
  Id: string;
  FullName: string;
  Email: string;
  DateOfBirth: string;
  PhoneNumber: string | null;
  ImageSource: string | null;
  Role: string;
  IsDeleted: boolean;
  IsLocked: boolean;
}
