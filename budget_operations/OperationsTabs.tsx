import React from 'react';
import { observer } from 'mobx-react-lite';

import { TFOperationObject, TFOperationSummaryItem } from '~/types/PROMO';

import {
  operationObjectToIconMap,
  operationObjectToNameMap,
} from '~/constants/PROMO';

import { UITag } from '~/components/UI/UITag';
import { TFTabsProps, UITabs } from '~/components/UI/UITabs';
import { UIGrid } from '~/components/UI/UIGrid';
import { UIIcon } from '~/components/UI/UIIcon';
import { UIPendingContainer } from '~/components/UI/UIPendingContainer';

interface IProps {
  items: TFOperationSummaryItem[];
  onChange: (key: TFOperationObject) => void;
  loading?: boolean;
  activeKey: TFOperationObject;
}

export const OperationsTabs: React.FC<IProps> = observer(
  ({ items, activeKey, loading = false, onChange }) => {
    const renderTab = (item: TFOperationSummaryItem) => (
      <UITabs.TabPane
        disabled={!(item.count > 0)}
        tab={
          <UIGrid gap={2} colsWidth="autoRow" alignItems="center">
            <UIIcon
              style={{ fontSize: '0.8em' }}
              icon={operationObjectToIconMap[item.object]}
            />
            {operationObjectToNameMap[item.object]}{' '}
            <UITag size="small">{item.count}</UITag>
          </UIGrid>
        }
        key={item.object}
      />
    );

    return (
      <UIPendingContainer when={loading}>
        <UITabs
          activeKey={activeKey}
          size="small"
          animated={false}
          onChange={onChange as TFTabsProps['onChange']}
        >
          {items.map(renderTab)}
        </UITabs>
      </UIPendingContainer>
    );
  }
);
