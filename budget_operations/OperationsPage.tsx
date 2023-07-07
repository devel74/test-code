import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { TFFetchStatus } from '~/types/store';
import { TFOperationObject, TFOperationsFilter } from '~/types/PROMO';

import { UIGrid } from '~/components/UI/UIGrid';
import { useTransactions } from '~/hooks/useTransactions';
import { useValuesInQuery } from '~/hooks/useParamsInQuery';

import { operationsConfig } from '~/constants/PROMO';

import { UIFieldset } from '~/components/UI/UIFieldset';
import { UIDataTemplate } from '~/components/UI/UIDataTemplate';

import loadImagePath from '~/assets/images/transfer.svg';

import { UIImage } from '~/components/UI/UIImage';
import { AppPageHero } from '~/components/App/AppPageHero';

import { OperationList } from './OperationList';
import { OperationsTabs } from './OperationsTabs';
import { initialOperationsFilter, OperationsFilter } from './OperationsFilter';

interface IProps {}

export const OperationsPage: React.FC<IProps> = observer(() => {
  const { fetchOperationsSummaryTrn, fetchOperationsTrn } = useTransactions();

  const filterInQuery = useValuesInQuery(initialOperationsFilter);

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const initialLoad = async () => {
    await fetchOperationsSummaryTrn.run();

    if (fetchOperationsSummaryTrn.store.fetchStatusStore.isFulfilled) {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationsTrn.store.setFilter(filterInQuery.values);
    fetchOperationsSummaryTrn.store.setFilter(filterInQuery.values);

    initialLoad();

    return () => {
      fetchOperationsTrn.store.dropState();
      fetchOperationsSummaryTrn.store.dropState();
    };
  }, []);

  const handleFilterSubmit = (filter: TFOperationsFilter) => {
    fetchOperationsTrn.search(filter);
    fetchOperationsSummaryTrn.search(filter);
  };

  const summaryItems = fetchOperationsSummaryTrn.store.items;
  const summaryFetchStatus =
    fetchOperationsSummaryTrn.store.fetchStatusStore.status;
  const summaryLoading =
    fetchOperationsSummaryTrn.store.searchStatusStore.isPending;

  const paramsInQuery = useValuesInQuery({
    tabKey: TFOperationObject.CAMPAIGN,
  });

  const [activeTabKey, setActiveTabKey] = useState(
    paramsInQuery.values.tabKey as TFOperationObject
  );

  useEffect(() => {
    paramsInQuery.set({ tabKey: activeTabKey });
  }, [activeTabKey]);

  return (
    <UIGrid padding="var(--space-3)">
      <UIDataTemplate
        status={isInitialLoading ? summaryFetchStatus : TFFetchStatus.FULFILLED}
        loadingContent={
          <AppPageHero
            image={<UIImage width={340} url={loadImagePath} />}
            text={operationsConfig.loadingOperations}
          />
        }
      >
        <UIFieldset title="Операции">
          <UIGrid margin="0 0 var(--space-2)">
            <OperationsFilter
              filter={fetchOperationsSummaryTrn.store.filter}
              onSubmit={handleFilterSubmit}
              searching={fetchOperationsTrn.store.searchStatusStore.isPending}
            />
          </UIGrid>
          <OperationsTabs
            items={summaryItems}
            loading={summaryLoading}
            onChange={setActiveTabKey}
            activeKey={activeTabKey}
          />
          <OperationList
            object={activeTabKey}
            transaction={fetchOperationsTrn}
          />
        </UIFieldset>
      </UIDataTemplate>
    </UIGrid>
  );
});
