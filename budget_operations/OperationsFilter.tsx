import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

import { TFFormActions } from '~/types';
import { TFOperationsFilter } from '~/types/PROMO';

import { useDirectory } from '~/hooks/PROMO';
import { useFlag } from '~/hooks/useFlag';
import { useFormControl } from '~/hooks/useFormControl';

import {
  operationsConfig,
  budgetTypeOptions,
  operationTypeOptions,
  artifactTypeOptions,
  promoActionTypeOptions,
} from '~/constants/PROMO';
import { fullDateFormat } from '~/constants/dateFormats';

import { countObjectsDiff } from '~/utils/countObjectsDiff';

import { toDate } from '~/helpers/date';

import { ExtendedFilter } from '~/components/ExtendedFilter';
import { Filter } from '~/components/Filter';
import { FetchDirectoryDropdown } from '~/components/Form/FetchDirectoryDropdown';
import { UIDatepicker } from '~/components/UI/UIDatepicker';
import { UIDropdown } from '~/components/UI/UIDropdown';
import { UIGrid } from '~/components/UI/UIGrid';
import { UIIcon } from '~/components/UI/UIIcon';
import { UIInput } from '~/components/UI/UIInput';
import { UISelectDropdown } from '~/components/UI/UISelectDropdown';
import config from '~/components/UI/helpers/constants';

interface IProps {
  filter: TFOperationsFilter;
  onSubmit: (
    data: TFOperationsFilter,
    helpers: TFFormActions<TFOperationsFilter>
  ) => void;
  searching?: boolean;
}

const initialValues: TFOperationsFilter = {
  budgetId: '',
  campaignId: undefined,
  activityId: undefined,
};

const initialExtendedValues: TFOperationsFilter = {
  author: '',
  createAtFrom: undefined,
  createAtTo: undefined,
  budgetType: undefined,
  artifactName: '',
  orderNumber: '',
  storeIds: undefined,
  marketingId: undefined,
  artifactType: undefined,
  promotionType: undefined,
  operationType: undefined,
};

export const initialOperationsFilter = {
  ...initialValues,
  ...initialExtendedValues,
};

export const OperationsFilter: React.FC<IProps> = observer(
  ({ onSubmit, searching = false, filter }) => {
    const { campaigns, activities, marketing, stores } = useDirectory();

    const extendedFlag = useFlag();

    const formControl = useFormControl<TFOperationsFilter>({
      onSubmit,
      initialValues: { ...initialOperationsFilter, ...filter },
    });

    const {
      values,
      setValues,
      handleChange,
      handleChangeDate,
      handleClearValue,
      handleChangeValue,
    } = formControl;

    const handleExtendedReset = () => {
      formControl.setValues({
        ...values,
        ...initialExtendedValues,
      });
    };

    useEffect(() => {
      stores.fetch();
      marketing.fetch();
      campaigns.fetch({ id: values.campaignId });
      activities.fetch({ id: values.activityId });
    }, []);

    return (
      <>
        <Filter<TFOperationsFilter>
          onReset={() => setValues(initialOperationsFilter)}
          formControl={formControl}
          isSearching={searching}
        >
          <UIGrid gap={2} colsWidth="repeat(4, max-content)">
            <FetchDirectoryDropdown
              value={values.campaignId}
              onChange={handleChangeValue('campaignId')}
              multiple
              controller={campaigns}
              allowClear
              showSearch
              placeholder={operationsConfig.campaignName}
            />
            <FetchDirectoryDropdown
              value={values.activityId}
              onChange={handleChangeValue('activityId')}
              multiple
              controller={activities}
              allowClear
              showSearch
              placeholder={operationsConfig.activityName}
            />

            <UIInput
              name="budgetId"
              value={values.budgetId}
              onChange={handleChange}
              onClear={handleClearValue('budgetId')}
              placeholder={operationsConfig.budgetId}
            />
            <UISelectDropdown
              icon="filterList"
              placeholder="Другие фильтры"
              selectedCount={countObjectsDiff(initialExtendedValues, values)}
              onClick={extendedFlag.activate}
              onClear={handleExtendedReset}
            />
          </UIGrid>
        </Filter>

        <ExtendedFilter<TFOperationsFilter>
          visible={extendedFlag.isActive}
          onClose={extendedFlag.deactivate}
          onReset={formControl.handleReset as any}
          formControl={formControl}
        >
          <UIGrid gap={2}>
            <UIInput
              fluid
              name="author"
              value={values.author}
              onChange={handleChange}
              onClear={handleClearValue('author')}
              placeholder={operationsConfig.author}
            />
            <UIInput
              fluid
              name="orderNumber"
              value={values.orderNumber}
              onChange={handleChange}
              onClear={handleClearValue('orderNumber')}
              placeholder={operationsConfig.orderNumber}
            />
            <UIInput
              fluid
              name="artifactName"
              value={values.artifactName}
              onChange={handleChange}
              onClear={handleClearValue('artifactName')}
              placeholder={operationsConfig.artefact}
            />
            <UIDropdown
              fluid
              name="artifactType"
              value={values.artifactType}
              options={artifactTypeOptions}
              onChange={handleChange}
              placeholder={operationsConfig.artefactType}
            />
            <UIDropdown
              fluid
              name="promotionType"
              value={values.promotionType}
              search
              options={promoActionTypeOptions}
              onChange={handleChange}
              placeholder={operationsConfig.promotionType}
            />
            <UIDropdown
              fluid
              name="marketingId"
              value={values.marketingId}
              search
              loading={marketing.store.fetchStatusStore.isPending}
              options={marketing.store.asOptions}
              onChange={handleChange}
              placeholder={operationsConfig.marketingName}
            />
            <UIDropdown
              fluid
              name="budgetType"
              value={values.budgetType}
              options={budgetTypeOptions}
              onChange={handleChange}
              placeholder={operationsConfig.budgetType}
            />
            <UIDropdown
              fluid
              name="operationType"
              value={values.operationType}
              options={operationTypeOptions}
              onChange={handleChange}
              placeholder={operationsConfig.operationType}
            />
            <UIDropdown
              fluid
              name="storeIds"
              multiple
              value={values.storeIds}
              options={stores.store.asOptions}
              onChange={handleChange}
              placeholder={operationsConfig.stores}
            />
            <UIGrid gap={2} colsWidth="1fr 1fr">
              <UIDatepicker
                name="createAtFrom"
                fluid
                postfix={<UIIcon icon="calendar" />}
                endDate={toDate(values.createAtTo)}
                selected={toDate(values.createAtFrom)}
                onChange={handleChangeDate('createAtFrom')}
                startDate={toDate(values.createAtFrom)}
                dateFormat={fullDateFormat}
                placeholder="от"
                selectsStart
                popperPlacement="bottom-end"
                timeCaption={config.time}
                isClearable
              />
              <UIDatepicker
                name="createAtTo"
                fluid
                postfix={<UIIcon icon="calendar" />}
                endDate={toDate(values.createAtTo)}
                selected={toDate(values.createAtTo)}
                onChange={handleChangeDate('createAtTo')}
                startDate={toDate(values.createAtFrom)}
                minDate={toDate(values.createAtFrom)}
                dateFormat={fullDateFormat}
                placeholder="до"
                selectsStart
                popperPlacement="bottom-end"
                timeCaption={config.time}
                isClearable
              />
            </UIGrid>
          </UIGrid>
        </ExtendedFilter>
      </>
    );
  }
);
