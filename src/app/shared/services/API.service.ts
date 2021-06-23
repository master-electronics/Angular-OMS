import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apollo, ApolloBase, gql } from 'apollo-angular';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  // private apollo: ApolloBase;
  constructor(private httprequest: HttpClient, private apolloProvider: Apollo) {
    // this.apollo = this.apolloProvider.use('merp');
  }
  // onGraphqlQuery(query: string): any {
  //   return this.apollo.watchQuery({
  //     query: gql`
  //       ${query}
  //     `,
  //     fetchPolicy: 'no-cache',
  //   });
  // }
  // onGraphqlMutate(query: string): any {
  //   return this.apollo.mutate({
  //     mutation: gql`
  //       ${query}
  //     `,
  //   });
  // }

  // onzipCodeValidation(zip: string): Observable<unknown> {
  //   const postData = {
  //     zipCode: zip,
  //   };
  //   return this.httprequest.post(
  //     `${environment.apiUrl}/AddressVerification/zipCodeValidation`,
  //     postData
  //   );
  // }

  // onstreetLevelAddressValidation(
  //   ConsigneeName: string,
  //   AddressLine1: string,
  //   AddressLine2: string,
  //   State: string,
  //   City: string,
  //   ZipCode: string,
  //   CountryCode: string
  // ): Observable<unknown> {
  //   const postData = {
  //     consigneeName: ConsigneeName,
  //     addressLine1: AddressLine1,
  //     addressLine2: AddressLine2,
  //     state: State,
  //     city: City,
  //     zipCode: ZipCode,
  //     countryCode: CountryCode,
  //   };
  //   return this.httprequest.post(
  //     `${environment.apiUrl}/AddressVerification/streetLevelAddressValidation`,
  //     postData
  //   );
  // }

  // onWriteToTable(data: unknown): Observable<unknown> {
  //   return this.httprequest.post(
  //     `${environment.apiUrl}/pvx/writeToTable/`,
  //     data
  //   );
  // }

  // onGetFromTable(data: unknown): Observable<unknown> {
  //   return this.httprequest.post(
  //     `${environment.apiUrl}/pvx/getFromTable/`,
  //     data
  //   );
  // }

  // onGetPickrt(data: unknown): Observable<unknown> {
  //   return this.httprequest.post(
  //     `${environment.apiUrl}/PvxTable/pickrt/`,
  //     data
  //   );
  // }

  // onVerifyITN(data: unknown): Observable<unknown> {
  //   return this.httprequest.post(`${environment.apiUrl}/Verify/itn/`, data);
  // }

  // onCallFunction(body: unknown): Observable<unknown> {
  //   return this.httprequest.post(
  //     `${environment.apiUrl}/FrontendFunction/functionCall`,
  //     body
  //   );
  // }

  onCheckQCPrinter(): Observable<unknown> {
    return this.httprequest.get(`${environment.apiUrl}/pvx/checkqcprinter`);
  }
  onGetLogin(body: unknown): Observable<unknown> {
    return this.httprequest.post(`${environment.apiUrl}/AuthJWT/login`, body);
  }
}
