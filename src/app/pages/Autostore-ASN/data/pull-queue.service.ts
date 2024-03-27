import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import {
  FetchAsnReplenishmentListGQL,
  RemovePullingQueueItemsGQL,
  TestMerpGQL,
  FetchPullQueueRowGQL,
  FetchPullQueueGQL,
  FetchAutoStoreQuantityGQL,
  FetchStandardPackGQL,
  FetchAsnReplenishmentInventoryGQL,
  VerifyAsnPullingLocationGQL,
  InsertAsnReplenishmentItemGQL,
  UpdateAsnInventoryMerpGQL,
  FetchTestGQL,
} from 'src/app/graphql/autostore.graphql-gen';
import { FindProductCodeGQL } from 'src/app/graphql/inventoryManagement.graphql-gen';
import { FindProductGQL } from 'src/app/graphql/autostoreASN.graphql-gen';

@Injectable({
  providedIn: 'root',
})
export class PullQueueService {
  constructor(
    private _fetchAsnReplenishmentList: FetchAsnReplenishmentListGQL,
    private _removePullingQueueItems: RemovePullingQueueItemsGQL,
    private _pullRow: FetchPullQueueRowGQL,
    private _pullQueue: FetchPullQueueGQL,
    private _productCode: FindProductCodeGQL,
    private _partNumber: FindProductGQL,
    private _autostoreQuantity: FetchAutoStoreQuantityGQL,
    private _standardPack: FetchStandardPackGQL,
    private _replenishmentInventory: FetchAsnReplenishmentInventoryGQL,
    private _pullingLocation: VerifyAsnPullingLocationGQL,
    private _insertReplenishmentItem: InsertAsnReplenishmentItemGQL,
    private _updateInventoryMERP: UpdateAsnInventoryMerpGQL,
    private _fetchTest: FetchTestGQL
  ) {}
  public get pullQueue$(): Observable<any> {
    return this._fetchAsnReplenishmentList.fetch().pipe(
      map((res) => {
        return res.data.fetchASNReplenishmentList;
      })
    );
  }

  public removePullingQueueItems(IDs) {
    return this._removePullingQueueItems.mutate({
      ids: IDs,
    });
  }

  public pullRow(RowNumber: number) {
    return this._pullRow.fetch(
      { rowNumber: RowNumber },
      { fetchPolicy: 'network-only' }
    );
  }

  public pullQueue() {
    return this._pullQueue.fetch({}, { fetchPolicy: 'network-only' });
  }

  public validateProductCode(ProductCode: string) {
    return this._productCode.fetch(
      { productCode: { ProductCodeNumber: ProductCode } },
      { fetchPolicy: 'network-only' }
    );
  }

  public validatePartNumber(ProductCodeID: number, PartNumber: string) {
    return this._partNumber.fetch(
      { product: { ProductCodeID: ProductCodeID, PartNumber: PartNumber } },
      { fetchPolicy: 'network-only' }
    );
  }

  public autostoreQuantity(
    DistributionCenter: string,
    ProductCode: string,
    PartNumber: string
  ) {
    return this._autostoreQuantity.fetch(
      {
        distributionCenter: DistributionCenter,
        productCode: ProductCode,
        partNumber: PartNumber,
      },
      { fetchPolicy: 'network-only' }
    );
  }

  public standardPack(ProductCode: string, PartNumber: string) {
    return this._standardPack
      .fetch(
        {
          productCode: ProductCode,
          partNumber: PartNumber,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          const StandardPack = res.data.fetchStandardPack[0]
            ?.CustomerOrderMinimum
            ? Number(res.data.fetchStandardPack[0].CustomerOrderMinimum.trim())
            : 1;

          return StandardPack;
        })
      );
  }

  public replenishmentInventory(
    ProductCode: string,
    PartNumber: string,
    StandardPack: number,
    DistributionCenter: string
  ) {
    // console.log('here');
    // console.log(ProductCode);
    // console.log(PartNumber);
    // console.log(StandardPack);
    // console.log(DistributionCenter);
    return this._replenishmentInventory.fetch(
      {
        productCode: ProductCode,
        partNumber: PartNumber,
        standardPack: StandardPack,
        distributionCenter: DistributionCenter,
      },
      { fetchPolicy: 'network-only' }
    );
  }

  public verifyASNPullingLocation(Barcode: string) {
    return this._pullingLocation.fetch(
      {
        container: { Barcode: Barcode },
      },
      { fetchPolicy: 'network-only' }
    );
  }

  public insertReplenishmentItem(ReplenishmentList) {
    return this._insertReplenishmentItem.mutate({
      replenishmentItem: ReplenishmentList,
    });
  }

  public updateMERP(User: string, ITN: string) {
    return this._updateInventoryMERP
      .mutate({
        user: User,
        itn: ITN,
        suspect: 'true',
        boundForAutostore: 'true',
      })
      .pipe(
        catchError((error) => {
          console.log('error');
          console.log(error);
          return error;
        })
      );
  }

  public test() {
    return this._fetchTest.fetch({}, { fetchPolicy: 'network-only' });
  }
}
