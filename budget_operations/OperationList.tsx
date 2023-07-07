import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo } from 'react';
import { objectToColumnsMap } from '~/pages/budget/budget_operations/columns';

import { Operation, TFOperationObject } from '~/types/PROMO';

import { ListTransaction } from '~/services/ListTransaction';

import { useDirectory } from '~/hooks/PROMO';

import { Pagination } from '~/components/Pagination';
import { UIDataTable } from '~/components/UI/UIDataTable';
import { UIGrid } from '~/components/UI/UIGrid';

interface IProps {
  object?: TFOperationObject;
  transaction: ListTransaction<any, Operation, any>;
}

export const OperationList: React.FC<IProps> = observer(
  ({ object = TFOperationObject.CAMPAIGN, transaction }) => {
    const { costcenters, stores } = useDirectory();

    useEffect(() => {
      stores.fetch();
      costcenters.fetch();
    }, []);

    useEffect(() => {
      transaction.store.paginationStore.dropState();
      transaction.store.setParams({ object });
      transaction.run();
    }, [object]);

    const columns = useMemo(
      () =>
        objectToColumnsMap(costcenters.store.asMap, stores.store.asMap)[
          object
        ] as any,
      [costcenters.store.asMap, stores.store.asMap, object]
    );

    const operations = transaction.store.items;
    const fetchStatus = transaction.store.fetchStatusStore.status;

    return (
      <UIGrid gap={2}>
        <UIDataTable<Operation>
          fetchStatus={fetchStatus}
          dataSource={operations}
          columns={columns}
        />
        <Pagination
          onChange={transaction.run}
          pagination={transaction.store.paginationStore}
        />
      </UIGrid>
    );
  }
);
