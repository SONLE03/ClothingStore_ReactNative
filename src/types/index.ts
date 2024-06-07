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

//Address

export interface Address {
    phone: number;
    province: number;
    district: number;
    ward: number;
    specificAddress: number;
}

export interface AddressInfo {
    id: string;
    phone: number;
    province: number;
    district: number;
    ward: number;
    specificAddress: number;
}