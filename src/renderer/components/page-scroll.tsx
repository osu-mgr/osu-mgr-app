import { FunctionComponent, useState, useEffect } from 'react';
import { useInView } from 'react-hook-inview';
import useMountedState from '../common/useMountedState';

const PageScroll: FunctionComponent<{
  pageSize: number;
  rows: React.ReactElement[];
}> = ({ pageSize, rows }) => {
  const isMounted = useMountedState();
  const [maxPages, setMaxPages] = useState<number>(1);
  const [ref, isVisible] = useInView({
    threshold: 0,
  });
  useEffect(() => {
    if (isMounted() && isVisible && rows.length / pageSize > maxPages)
      setMaxPages(maxPages + 1);
  }, [isMounted, isVisible, maxPages]);
  return (
    <>
      {rows.slice(0, maxPages * pageSize)}
      <div ref={ref} />
    </>
  );
};

export default PageScroll;
