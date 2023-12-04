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

export interface Dog {
  age: number;
  breed: string;
  color: string;
  image_url: string;
  name: string;
  traits: string[];
  weight: number;
}

export interface DogsResponse {
  dogs: Dog[];
}
