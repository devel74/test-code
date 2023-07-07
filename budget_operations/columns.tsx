import React from 'react';

import {
  Operation,
  TFOperationObject,
  TFDirectoryCostCenter,
  TFDirectoryStore,
} from '~/types/PROMO';

import {
  operationsConfig,
  orderTypeToNameMap,
  promoActionTypeMap,
  artifactTypeNameMap,
  artifactTypeIconMap,
  operationTypeToNameMap,
} from '~/constants/PROMO';
import { fullDateShortTimeFormat } from '~/constants/dateFormats';
import routes from '~/constants/routes';

import { TFDirectory } from '~/utils/directory';

import { beautifyDate } from '~/helpers/date';

import { UIGrid } from '~/components/UI/UIGrid';
import { UIIcon } from '~/components/UI/UIIcon';
import { UILink } from '~/components/UI/UILink';
import { UIMoneyOperationAmount } from '~/components/UI/UIMoneyOperationAmount';
import { UITag } from '~/components/UI/UITag';

export const columnsMap = {
  campaignName: {
    key: 'campaignName',
    title: operationsConfig.campaignName,
    render: (item: Operation) => (
      <UILink to={routes.campaign.makePath(item.campaignId)}>
        {item.campaignName}
      </UILink>
    ),
  },
  activityName: {
    key: 'activityName',
    title: operationsConfig.activityName,
    render: (item: Operation) => (
      <UILink to={routes.activity.makePath(item.activityId)}>
        {item.activityName}
      </UILink>
    ),
  },
  certificateName: {
    key: 'certificateName',
    title: operationsConfig.certificateName,
    render: (item: Operation) => (
      <UILink
        to={routes.activityArtifactsList.makePath({
          artifactName: item.certificateName,
        })}
      >
        {item.certificateName}
      </UILink>
    ),
  },
  operationType: {
    key: 'operationType',
    width: 100,
    title: operationsConfig.operationType,
    render: (item: Operation) => operationTypeToNameMap[item.operationType],
  },
  amount: (costCentersDirectory: TFDirectory<TFDirectoryCostCenter>) => ({
    key: 'amount',
    title: operationsConfig.amount,
    render: (item: Operation) =>
      item.assignment.map(it => (
        <UITag
          key={it.costCenterId}
          size="small"
          style={{ margin: 'var(--space-1) var(--space-1) 0 0' }}
        >
          {costCentersDirectory[it.costCenterId]?.name}:&nbsp;&nbsp;
          <UIMoneyOperationAmount amount={it.amount} />
        </UITag>
      )),
  }),
  author: {
    key: 'author',
    title: operationsConfig.author,
    dataIndex: 'author',
  },
  marketingName: {
    key: 'marketingName',
    title: operationsConfig.marketingName,
    dataIndex: 'marketingName',
  },
  store: (storesDirectory: TFDirectory<TFDirectoryStore>) => ({
    key: 'storeId',
    title: operationsConfig.store,
    render: ({ storeId }: Operation) => storesDirectory[storeId!]?.name,
  }),
  artifactName: {
    key: 'artifactName',
    title: operationsConfig.artifactName,
    render: (item: Operation) => (
      <UIGrid gap={1} colsWidth="autoRow" alignItems="center">
        <UIIcon
          style={{ fontSize: '0.8em' }}
          title={artifactTypeNameMap[item.artifactType!]}
          icon={artifactTypeIconMap[item.artifactType!] || 'artifact'}
        />
        {item.artifactName}
      </UIGrid>
    ),
  },
  promotionType: {
    key: 'promotionType',
    title: operationsConfig.promotionType,
    render: (item: Operation) => promoActionTypeMap[item.promotionType!],
  },
  orderNumber: {
    key: 'orderNumber',
    title: operationsConfig.orderNumber,
    render: ({ orderNumber }: Operation) => (
      <UILink
        to={routes.orders.makePath({ orderNumber: String(orderNumber || '') })}
      >
        {orderNumber}
      </UILink>
    ),
  },
  orderClient: {
    key: 'orderClient',
    title: operationsConfig.orderClient,
    dataIndex: 'orderClient',
  },
  orderAction: {
    key: 'orderAction',
    title: operationsConfig.orderAction,
    render: (item: Operation) => orderTypeToNameMap[item.orderAction!],
  },
  createdAt: {
    width: 140,
    key: 'createdAt',
    title: operationsConfig.createdAt,
    render: (item: Operation) =>
      beautifyDate(item.createdAt, fullDateShortTimeFormat),
  },
};

export const objectToColumnsMap = (
  costCentersDirectory: TFDirectory<TFDirectoryCostCenter>,
  storesDirectory: TFDirectory<TFDirectoryStore>
) => ({
  [TFOperationObject.ACTIVITY]: [
    columnsMap.campaignName,
    columnsMap.activityName,
    columnsMap.certificateName,
    columnsMap.operationType,
    columnsMap.amount(costCentersDirectory),
    columnsMap.author,
    columnsMap.createdAt,
  ],
  [TFOperationObject.CAMPAIGN]: [
    columnsMap.campaignName,
    columnsMap.activityName,
    columnsMap.certificateName,
    columnsMap.operationType,
    columnsMap.amount(costCentersDirectory),
    columnsMap.author,
    columnsMap.createdAt,
  ],
  [TFOperationObject.PROMOTION]: [
    columnsMap.campaignName,
    columnsMap.activityName,
    columnsMap.orderNumber,
    columnsMap.orderClient,
    columnsMap.store(storesDirectory),
    columnsMap.orderAction,
    columnsMap.operationType,
    columnsMap.promotionType,
    columnsMap.artifactName,
    columnsMap.amount(costCentersDirectory),
    columnsMap.createdAt,
  ],
  [TFOperationObject.MARKETING]: [
    columnsMap.campaignName,
    columnsMap.activityName,
    columnsMap.operationType,
    columnsMap.marketingName,
    columnsMap.amount(costCentersDirectory),
    columnsMap.author,
    columnsMap.createdAt,
  ],
  [TFOperationObject.CERTIFICATE]: [
    columnsMap.campaignName,
    columnsMap.activityName,
    columnsMap.certificateName,
    columnsMap.operationType,
    columnsMap.amount(costCentersDirectory),
    columnsMap.author,
    columnsMap.createdAt,
  ],
});
