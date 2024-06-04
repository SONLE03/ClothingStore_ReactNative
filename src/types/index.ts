// ProductInterface
export interface Product {
    id: string;
    product_Name: string;
    description: string;
    prices: number;
    category: string;
    branch: string;
    productStatus: string;
    image: string;
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

  