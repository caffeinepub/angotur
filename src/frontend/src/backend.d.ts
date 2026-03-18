import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    name: string;
}
export type Time = bigint;
export interface NewTourGuide {
    bio: string;
    name: string;
    profilePhoto?: ExternalBlob;
    languages: Array<string>;
    available: boolean;
    pricePerDay: bigint;
}
export interface TourGuide {
    id: string;
    bio: string;
    status: Type__1;
    platformFee: bigint;
    feeStatus: FeeStatus;
    name: string;
    profilePhoto?: ExternalBlob;
    languages: Array<string>;
    available: boolean;
    pricePerDay: bigint;
}
export interface AdminStats {
    pendingBookings: bigint;
    cancelledBookings: bigint;
    totalSpots: bigint;
    totalGuides: bigint;
    confirmedBookings: bigint;
    totalReviews: bigint;
}
export interface NewTouristSpot {
    name: string;
    description: string;
    isPrivate: boolean;
    category: Type;
    location: string;
    photos: Array<ExternalBlob>;
}
export interface Booking {
    id: string;
    status: BookingStatus;
    endDate: string;
    guideId: string;
    userId: Principal;
    createdAt: Time;
    message: string;
    spotId: string;
    startDate: string;
}
export interface TouristSpot {
    id: string;
    status: Type__1;
    platformFee: bigint;
    feeStatus: FeeStatus;
    name: string;
    description: string;
    isPrivate: boolean;
    category: Type;
    location: string;
    photos: Array<ExternalBlob>;
}
export interface Review {
    id: string;
    userId: Principal;
    authorName: string;
    comment: string;
    targetType: Variant_spot_guide;
    rating: bigint;
    targetId: string;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export enum FeeStatus {
    paid = "paid",
    unpaid = "unpaid"
}
export enum Type {
    nature = "nature",
    museum = "museum",
    city = "city",
    historical = "historical",
    beach = "beach"
}
export enum Type__1 {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_spot_guide {
    spot = "spot",
    guide = "guide"
}
export interface backendInterface {
    addReview(targetId: string, targetType: Variant_spot_guide, rating: bigint, comment: string, authorName: string): Promise<Review>;
    addTourGuide(newGuide: NewTourGuide): Promise<TourGuide>;
    approveTourGuide(id: string): Promise<TourGuide>;
    approveTouristSpot(id: string): Promise<TouristSpot>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBooking(guideId: string, spotId: string, startDate: string, endDate: string, message: string): Promise<Booking>;
    createTouristSpot(newSpot: NewTouristSpot): Promise<TouristSpot>;
    deleteReview(reviewId: string): Promise<void>;
    deleteTourGuide(id: string): Promise<void>;
    deleteTouristSpot(id: string): Promise<void>;
    getAdminStats(): Promise<AdminStats>;
    getAllApprovedSpots(): Promise<Array<TouristSpot>>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllGuides(): Promise<Array<TourGuide>>;
    getAllReviews(): Promise<Array<Review>>;
    getAllSpots(): Promise<Array<TouristSpot>>;
    getAvailableGuides(): Promise<Array<TourGuide>>;
    getBookingsByGuide(guideId: string): Promise<Array<Booking>>;
    getBookingsByUser(userId: Principal): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGuidesWithPendingFees(): Promise<Array<TourGuide>>;
    getReviewsByTarget(targetId: string): Promise<Array<Review>>;
    getSpotsWithPendingFees(): Promise<Array<TouristSpot>>;
    getTouristSpotsByCategory(category: Type): Promise<Array<TouristSpot>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markGuideFeeAsPaid(guideId: string): Promise<void>;
    markSpotFeeAsPaid(spotId: string): Promise<void>;
    rejectTourGuide(id: string): Promise<TourGuide>;
    rejectTouristSpot(id: string): Promise<TouristSpot>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBookingStatus(bookingId: string, newStatus: BookingStatus): Promise<Booking>;
    updateTourGuide(id: string, updatedGuide: NewTourGuide): Promise<TourGuide>;
    updateTouristSpot(id: string, updatedSpot: NewTouristSpot): Promise<TouristSpot>;
}
