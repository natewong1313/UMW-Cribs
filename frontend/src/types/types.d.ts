/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface GetUserLikesResponse {
  error: string;
  likes: DatabaseLike[];
}

export interface ListingResponse {
  error: string;
  listing: DatabaseListing;
}

export interface ListingsResponse {
  listings: DatabaseListing[];
}

export interface UpdateUserLikeResponse {
  error: string;
}

export interface UserResponse {
  error: string;
  user: AuthUserRecord;
}

export interface VerifyTokenResponse {
  error: string;
  verified: boolean;
}

export interface AuthUserInfo {
  displayName: string;
  email: string;
  phoneNumber: string;
  photoUrl: string;
  /**
   * In the ProviderUserInfo[] ProviderID can be a short domain name (e.g. google.com),
   * or the identity of an OpenID identity provider.
   * In UserRecord.UserInfo it will return the constant string "firebase".
   */
  providerId: string;
  rawId: string;
}

export interface AuthUserMetadata {
  creationTimestamp?: number;
  lastLogInTimestamp?: number;
  /**
   * The time at which the user was last active (ID token refreshed), or 0 if
   * the user was never active.
   */
  lastRefreshTimestamp?: number;
}

export interface AuthUserRecord {
  customClaims?: Record<string, any>;
  disabled?: boolean;
  displayName: string;
  email: string;
  emailVerified?: boolean;
  phoneNumber: string;
  photoUrl: string;
  /**
   * In the ProviderUserInfo[] ProviderID can be a short domain name (e.g. google.com),
   * or the identity of an OpenID identity provider.
   * In UserRecord.UserInfo it will return the constant string "firebase".
   */
  providerId: string;
  providerUserInfo?: AuthUserInfo[];
  rawId: string;
  tenantID?: string;
  /** milliseconds since epoch. */
  tokensValidAfterMillis?: number;
  userMetadata?: AuthUserMetadata;
}

export interface DatabaseAddress {
  city: string;
  distance: number;
  latitude: number;
  line1: string;
  line2: string;
  longitude: number;
  state: string;
  zip: string;
}

export interface DatabaseImage {
  url: string;
}

export interface DatabaseLike {
  createdAt: string;
  listingId: string;
}

export interface DatabaseListing {
  address: DatabaseAddress;
  availabilityDate: string;
  available: boolean;
  bathrooms: number;
  bedrooms: number;
  createdAt: string;
  description: string;
  id: string;
  images: DatabaseImage[];
  rent: number;
  source: DatabaseSource;
  squareFootage: number;
  updatedAt: string;
}

export interface DatabaseSource {
  site: string;
  url: string;
}
