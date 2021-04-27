import * as uuid from 'uuid';
import React, {
  FunctionComponent,
  ReactNode,
  useState,
  cloneElement,
  isValidElement,
} from 'react';
import {
  TransitionablePortal,
  Segment,
  Dimmer,
  Button,
  Icon,
  StrictIconProps,
  Loader,
} from 'semantic-ui-react';
import { atom, useRecoilState } from 'recoil';

export const modalsState = atom({
  key: 'modals',
  default: [{ id: '' }],
});

const Modal: FunctionComponent<{
  trigger: ReactNode;
  buttons(close?: () => void): ReactNode;
  title: string;
  icon: StrictIconProps['name'];
  cornerIcon?: StrictIconProps['name'];
  onOpen?: () => void;
  onClose?: () => void;
  hideCancel?: boolean;
  loading?: string;
}> = ({
  children,
  trigger,
  buttons,
  title,
  icon,
  cornerIcon,
  onOpen,
  onClose,
  hideCancel,
  loading,
}) => {
  const [id] = useState(uuid.v4());
  const [modals, setModals] = useRecoilState(modalsState);
  const modalIdx = modals.findIndex((x) => x.id === id) - 1;
  const close = () => setModals(modals.filter((x) => x.id !== id));
  return (
    <>
      {isValidElement(trigger) &&
        cloneElement(trigger, {
          onClick: () => setModals([...modals, { id }]),
        })}
      <TransitionablePortal
        open={modalIdx >= 0}
        onOpen={onOpen}
        onClose={onClose}
        transition={{ animation: 'fade down', duration: 300 }}
        closeOnDocumentClick={false}
      >
        <Dimmer inverted page active>
          <Segment.Group
            raised
            style={{
              color: 'rgba(0, 0, 0, 0.87)',
              width: 'calc(100vw - 3rem)',
              position: 'fixed',
              top: `${1.5 + modalIdx * 2}rem`,
              left: '1.5rem',
            }}
          >
            <Segment>
              <Icon
                link
                name="close"
                size="large"
                style={{ float: 'right' }}
                onClick={close}
              />
              <h3 style={{ margin: 0 }}>
                <Icon.Group>
                  <Icon name={icon} />
                  {cornerIcon && <Icon corner name={cornerIcon} />}
                </Icon.Group>{' '}
                {title}
              </h3>
            </Segment>
            <Segment
              textAlign="left"
              style={{
                overflowY: loading ? 'hidden' : 'scroll',
                minHeight: `calc(100vh - ${11 + modalIdx * 2}rem)`,
                maxHeight: `calc(100vh - ${11 + modalIdx * 2}rem)`,
              }}
            >
              {children}
              {loading && (
                <Dimmer inverted active>
                  <Loader>{loading}</Loader>
                </Dimmer>
              )}
            </Segment>
            <Segment textAlign="right">
              {!hideCancel && <Button onClick={close}>Cancel</Button>}
              {buttons(close)}
            </Segment>
          </Segment.Group>
        </Dimmer>
      </TransitionablePortal>
    </>
  );
};

export default Modal;
