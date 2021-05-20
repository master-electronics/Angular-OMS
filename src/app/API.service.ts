/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { Observable } from "zen-observable-ts";

export type InputCreateCar = {
  color: string;
};

export type Car = {
  __typename: "Car";
  id?: string;
  color?: string;
  parking?: Parking;
};

export type Parking = {
  __typename: "Parking";
  id?: string;
  name?: string;
  car?: Car;
  price?: number;
};

export type CreateCarMutation = {
  __typename: "Car";
  id: string;
  color: string;
  parking?: {
    __typename: "Parking";
    id: string;
    name: string;
    car: {
      __typename: "Car";
      id: string;
      color: string;
    };
    price: number;
  } | null;
};

export type GetParkingQuery = {
  __typename: "Parking";
  id: string;
  name: string;
  car: {
    __typename: "Car";
    id: string;
    color: string;
    parking?: {
      __typename: "Parking";
      id: string;
      name: string;
      price: number;
    } | null;
  };
  price: number;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async CreateCar(input?: InputCreateCar): Promise<CreateCarMutation> {
    const statement = `mutation CreateCar($input: InputCreateCar) {
        createCar(input: $input) {
          __typename
          id
          color
          parking {
            __typename
            id
            name
            car {
              __typename
              id
              color
            }
            price
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (input) {
      gqlAPIServiceArguments.input = input;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateCarMutation>response.data.createCar;
  }
  async GetParking(id: string): Promise<GetParkingQuery> {
    const statement = `query GetParking($id: ID!) {
        getParking(id: $id) {
          __typename
          id
          name
          car {
            __typename
            id
            color
            parking {
              __typename
              id
              name
              price
            }
          }
          price
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetParkingQuery>response.data.getParking;
  }
}
