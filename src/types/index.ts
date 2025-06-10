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
    Id: string;
    CategoryName: string;
    ImageSource: string;
    Description: string;
    FurnitureTypeId: string;
}

//Order 
export interface OrderItem {
    productItemId: string;
    sizeName: string;
    colorName: string;
    quantity: number;
    price: number;
    product_Name: string;
    image: string;
}

//Cart 
export interface CartItems {
    productItemId: string;
    quantity: number;
}

export interface ProductItemInCart {
    productItemId: string;
    sizeName: string;
    colorName: string;
    quantity: number;
    price: number;
    product_Name: string;
    image: string;   
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

export interface OrderItemRequest {
    productItemId: string;
    quantity: number;
}

export interface CreateOrderRequest {
    coupon: string;
    addressId: string;
    customerId: string;
    paymentMethod: number;
    orderItemRequestList: OrderItemRequest[];
}

export interface Orders {
    orderId: string;
    orderDate: string;
    total: number;
    customerId: string;
    customerName: string;
    customerPhone: string;
    status: string;
}

export interface OrderDetail {
    productItem: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
}

//Address

export interface AddressRequest {
    province: string;
    district: string;
    ward: string;
    specificAddress: string;
    postalCode: string;
    isDefault: boolean;


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
    id: string;
    fullName: string;
    phone: string;
    email: string;
    password: string;
    role: string;
    enabled: boolean;
    image: string | null;
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
