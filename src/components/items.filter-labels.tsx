import React, { FunctionComponent, useState, useEffect } from 'react';
import { useInView } from 'react-hook-inview';
import { Icon, Button } from 'semantic-ui-react';
import { useRecoilState } from 'recoil';
import ItemsCount from './items.count';
import { DocType, itemsSearchState } from '../stores/items';
import { countByType } from '../es';

const ItemFilterLabels: FunctionComponent<{
  type?: DocType;
}> = ({ type }) => {
  const [search, setSearch] = useRecoilState(itemsSearchState);
  const [recentCount, setRecentCount] = useState<number | undefined>(undefined);
  const [validCount, setValidCount] = useState<number | undefined>(undefined);
  const [warningCount, setWarningCount] = useState<number | undefined>(
    undefined
  );
  const [errorCount, seErrorCount] = useState<number | undefined>(undefined);
  const [ref, isVisible] = useInView({
    threshold: 0,
  });
  useEffect(() => {
    setRecentCount(undefined);
    (async () => {
      setRecentCount(await countByType(type, search, 'recent'));
    })();
  }, [isVisible, search, type]);
  useEffect(() => {
    setValidCount(undefined);
    (async () => {
      setValidCount(await countByType(type, search, 'valid'));
    })();
  }, [isVisible, search, type]);
  useEffect(() => {
    setWarningCount(undefined);
    (async () => {
      setWarningCount(await countByType(type, search, 'warning'));
    })();
  }, [isVisible, search, type]);
  useEffect(() => {
    seErrorCount(undefined);
    (async () => {
      seErrorCount(await countByType(type, search, 'error'));
    })();
  }, [isVisible, search, type]);
  return (
    <>
      <span ref={ref} />
      <Button
        size="mini"
        basic={search.filter !== 'recent'}
        style={{ color: 'rgba(0, 0, 0, 0.75)' }}
        disabled={recentCount === undefined || recentCount === 0}
        onClick={() => {
          setSearch({
            ...search,
            filter: search.filter === 'recent' ? undefined : 'recent',
          });
        }}
      >
        <Icon name="edit" style={{ color: 'rgba(0, 0, 0, 0.75)' }} />
        <ItemsCount type={type} label="Recently Edited" filter="recent" />
      </Button>
      <Button
        size="mini"
        basic={search.filter !== 'valid'}
        style={{ color: '#2C662D', margin: '0 .5rem .5rem 0' }}
        disabled={validCount === undefined || validCount === 0}
        onClick={() => {
          setSearch({
            ...search,
            filter: search.filter === 'valid' ? undefined : 'valid',
          });
        }}
      >
        <Icon name="check circle" style={{ color: '#2C662D' }} />
        <ItemsCount type={type} label="Valid" filter="valid" />
      </Button>
      <Button
        size="mini"
        basic={search.filter !== 'warning'}
        style={{ color: '#F2711C', margin: '0 .5rem .5rem 0' }}
        disabled={warningCount === undefined || warningCount === 0}
        onClick={() => {
          setSearch({
            ...search,
            filter: search.filter === 'warning' ? undefined : 'warning',
          });
        }}
      >
        <Icon name="exclamation circle" style={{ color: '#F2711C' }} />
        <ItemsCount type={type} label="With Warnings" filter="warning" />
      </Button>
      <Button
        size="mini"
        basic={search.filter !== 'error'}
        style={{ color: '#9F3A38', margin: '0 .5rem .5rem 0' }}
        disabled={errorCount === undefined || errorCount === 0}
        onClick={() => {
          setSearch({
            ...search,
            filter: search.filter === 'error' ? undefined : 'error',
          });
        }}
      >
        <Icon name="times circle" style={{ color: '#9F3A38' }} />
        <ItemsCount type={type} label="With Errors" filter="error" />
      </Button>
    </>
  );
};

export default ItemFilterLabels;
