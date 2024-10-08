import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { HotelSearchResponse, hotelType, hotelType as HotelType, PaymentIntentResponse, UserType } from '../../backend/src/shared/types';
import { BookingFormData } from "./forms/BookingForm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const register = async (formData: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        credentials: 'include',  // Includes http cookies with response
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
    });

    const responseBody = await response.json();

    if(!response.ok) {
        throw new Error(responseBody.message);
    }
}

export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        credentials: 'include',
        method: 'GET'
    });

    if(!response.ok) {
        throw new Error("Token Invalid");
    }

    return response.json();
}

export const signIn = async (FormData: SignInFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: 'include',
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(FormData)
    });

    const body = await response.json();

    if(!response.ok) {
        throw new Error(body.message);
    }

    return body;
}

export const signOut = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        credentials: 'include',
        method: "POST",
    });

    if(!response.ok) {
        throw new Error("Error during Sign Out.");
    }
};

export const addMyHotel = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        credentials: 'include',
        method: 'POST',
        body: hotelFormData,
    });

    if(!response.ok) {
        throw new Error('Failed to add Hotel');
    }

    return response.json();
}

export const getMyHotel = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        method: 'GET',
        credentials: 'include',
    });

    if(!response.ok) {
        throw new Error("Error fetching hotels");
    }

    return response.json();
}

export const getHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
        credentials: 'include',
        method: 'GET',
    });

    if(!response.ok) {
        throw new Error("Error fetching Hotel");
    }

    return response.json();

}

export const updateHotelById = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`, {
        credentials: 'include',
        method: 'PUT',
        body: hotelFormData
    });

    if(!response.ok) {
        throw new Error("Error Updating Details");
    }

    return response.json();
}

export type SearchParams = {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    page?: string;
    facilities?: string[];
    types?: string[];
    stars?: string[];
    maxPrice?: string;
    sortOption?: string;
}

export const searchHotels = async (searchParams: SearchParams): Promise<HotelSearchResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append('destination', searchParams.destination || "");
    queryParams.append('checkIn', searchParams.checkIn || "");
    queryParams.append('checkOut', searchParams.checkOut || "");
    queryParams.append('adultCount', searchParams.adultCount || "");
    queryParams.append('childCount', searchParams.childCount || "");
    queryParams.append('page', searchParams.page || "");

    queryParams.append("maxPrice", searchParams.maxPrice || "");
    queryParams.append("sortOption", searchParams.sortOption || "");
    
    searchParams.facilities?.forEach((facility) => queryParams.append("facilities", facility));
    searchParams.types?.forEach((type) => queryParams.append("types", type));
    searchParams.stars?.forEach((star) => queryParams.append("stars", star));

    const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`);

    if(!response.ok) {
        throw new Error("Error fetching hotels");
    }

    return response.json();
}

export const fetchHotelById = async (hotelId: string): Promise<hotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`, {
        method: "GET",
    });

    if(!response.ok) {
        throw new Error("Error fetching Hotel Details.");
    }

    return response.json();

}

export const fetchCurrentUser = async (): Promise<UserType> => {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        credentials: 'include',
        method: "GET",
    });

    if(!response.ok) {
        throw new Error("Error Fetching User");
    }

    return response.json();
}

export const createPaymentIntent = async (hotelId: string, numberOfNights: string): Promise<PaymentIntentResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`, {
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ numberOfNights }),
        headers: {
            "Content-Type": "application/json",
        }
    });

    if(!response.ok) {
        throw new Error("Error fetching Payment Intent");
    }

    return response.json();
}

export const createRoomBooking = async (formData: BookingFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    if(!response.ok) {
        throw new Error("Could Not Book the rooms");
    }
}

export const fetchMyBookings = async (): Promise<hotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
        credentials: 'include',
        method: "GET"
    });

    if(!response.ok) {
        throw new Error("Unable to fetch Bookings");
    }

    return response.json();
}

export const fetchHotels = async (): Promise<hotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels`);

    if(!response.ok) {
        throw new Error("Something Went Wrong");
    }

    return response.json();
}