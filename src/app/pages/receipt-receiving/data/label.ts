import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { ReceiptStore } from './Receipt';

@Injectable()
export class labelStore {
  constructor(private _receipt: ReceiptStore) {}
}

// this.data$ = this._service.getReceiptHInfo().pipe(
//   take(1),
//   mergeMap((res) =>
//     this._findLines.fetch({
//       ProductID: res.value[0].ProductID,
//     })
//   ),
//   map((res) => {
//     const tableList = [];
//     res.data.findReceiptLs.map((line) => {
//       line.RECEIPTLDs.map((detail) => {
//         const node = {
//           PurchaseOrder:
//             detail.PurchaseOrderL.PurchaseOrderH.PurchaseOrderNumber,
//           Line: detail.PurchaseOrderL.LineNumber,
//           Quantity: detail.ExpectedQuantity,
//           Status: detail.ReceiptStatus.Name,
//         };
//         tableList.push(node);
//       });
//     });
//     this.listOfColumn = [
//       {
//         title: 'PurchaseOrder',
//         compare: (a: DataItem, b: DataItem) =>
//           a.PurchaseOrder.localeCompare(b.PurchaseOrder),
//       },
//       {
//         title: 'Line',
//         compare: (a: DataItem, b: DataItem) => a.Line - b.Line,
//       },
//       {
//         title: 'Quantity',
//         compare: (a: DataItem, b: DataItem) => a.Quantity - b.Quantity,
//       },
//       {
//         title: 'Status',
//         compare: (a: DataItem, b: DataItem) =>
//           a.Status.localeCompare(b.Status),
//       },
//     ];
//     return {
//       isLoading: false,
//       value: tableList,
//     };
//   }),
//   tap((res) => {
//     this._service.changereceiptH(res);
//   }),
//   catchError((error) =>
//     of({ isLoading: false, error, messageType: 'error' })
//   ),
//   startWith({ isLoading: true })
// );
