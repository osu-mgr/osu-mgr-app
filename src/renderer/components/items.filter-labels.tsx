import { FunctionComponent, useState, useEffect } from 'react';
import { useInView } from 'react-hook-inview';
import { useRecoilState } from 'recoil';
import { Icon, Button } from 'semantic-ui-react';
import useMountedState from '../common/useMountedState';
import ItemsCount from './items.count';
import { ItemType, itemsSearchState } from '../stores/items';
import { countByType } from '../common/es';

const ItemFilterLabels: FunctionComponent<{
  type?: ItemType;
}> = ({ type }) => {
  const isMounted = useMountedState();
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
      const update = await countByType(type, search, 'recent');
      if (isMounted()) setRecentCount(update);
    })();
  }, [isMounted, isVisible, search, type]);
  useEffect(() => {
    setValidCount(undefined);
    (async () => {
      const update = await countByType(type, search, 'valid');
      if (isMounted()) setValidCount(update);
    })();
  }, [isMounted, isVisible, search, type]);
  useEffect(() => {
    setWarningCount(undefined);
    (async () => {
      const update = await countByType(type, search, 'warning');
      if (isMounted()) setWarningCount(update);
    })();
  }, [isMounted, isVisible, search, type]);
  useEffect(() => {
    seErrorCount(undefined);
    (async () => {
      const update = await countByType(type, search, 'error');
      if (isMounted()) seErrorCount(update);
    })();
  }, [isMounted, isVisible, search, type]);
  return (
    <>
      <span ref={ref} />
      <Button
        size="mini"
        basic={search.filter !== 'recent'}
        style={{
          color: 'rgba(0, 0, 0, 0.75)',
          margin: '0 0.5rem 0.5rem 0',
          padding: '0.25em 0.5em',
        }}
        disabled={
          search?.filter === undefined &&
          (recentCount === undefined || recentCount === 0)
        }
        onClick={() => {
          setSearch({
            ...search,
            filter: search.filter === 'recent' ? undefined : 'recent',
          });
        }}
      >
        <Icon
          name="edit"
          style={{
            color: 'rgba(0, 0, 0, 0.75)',
          }}
        />
        <ItemsCount type={type} label="Recently Edited" filter="recent" />
      </Button>
      <Button
        size="mini"
        basic={search.filter !== 'valid'}
        style={{
          color: '#2C662D',
          margin: '0 0.5rem 0.5rem 0',
          padding: '0.25em 0.5em',
        }}
        disabled={
          search?.filter === undefined &&
          (validCount === undefined || validCount === 0)
        }
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
        style={{
          color: '#F2711C',
          margin: '0 0.5rem 0.5rem 0',
          padding: '0.25em 0.5em',
        }}
        disabled={
          search?.filter === undefined &&
          (warningCount === undefined || warningCount === 0)
        }
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
        style={{
          color: '#9F3A38',
          margin: '0 0.5rem 0.5rem 0',
          padding: '0.25em 0.5em',
        }}
        disabled={
          search?.filter === undefined &&
          (errorCount === undefined || errorCount === 0)
        }
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
