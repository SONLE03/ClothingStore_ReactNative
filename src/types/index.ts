// ProductInterface
export interface Product {
    id: string;
    product_Name: string;
    description: string;
    price: number;
    category: string;
    branch: string;
    productStatus: string;
    images: string[];
}

export interface ProductItem {
    id: string;
    sizeName: string;
    colorName: string;
    quantity: number;
    price: number;
}

// Gender
export interface Gender {
    id: string;
    name: string;
    
}

// Category
export interface Category {
    id: string;
    name: string;
    productGender: Gender;
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
    phone: string;
    province: string;
    district: string;
    ward: string;
    specificAddress: string;
}

export interface AddressInfo {
    id: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    specificAddress: string;
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
    id: string;
    fullname: string;
    phone: string;
    email: string;
    password: string;
    role: string;
    enabled: boolean;
    image: string | null;
}
  