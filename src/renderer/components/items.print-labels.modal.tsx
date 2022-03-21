import _ from 'lodash';
import axios from 'axios';
import { DateTime } from 'luxon';
import { FunctionComponent, useState, useEffect } from 'react';
import {
  Button,
  Icon,
  Form,
  ButtonGroup,
  Header,
  List,
  Loader,
} from 'semantic-ui-react';
import useMountedState from '../common/useMountedState';
import Modal from './modal';
import FormGridColumns from './form.grid.columns';
import { searchByType, searchByUUIDs, countByUUIDs } from '../common/es';
import { Account } from '../stores/accounts';
import { Cruise, Core, Section, SectionHalf } from '../stores/items';

function smallLabelZPL(section?: Section, sectionHalf?: SectionHalf) {
  const data = {
    name: sectionHalf?._osuid.substring(4),
    osuid: sectionHalf?._osuid,
    sectionTop:
      section?.depthTop !== undefined ? `${section?.depthTop} cm` : '',
    sectionBottom:
      section?.depthBottom !== undefined ? `${section?.depthBottom} cm` : '',
  };
  return `
CT~~CD,~CC^~CT~
^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR5,5~SD23^JUS^LRN^CI0^XZ
^XA
^MMT
^PW406
^LL0203
^LS0
^FO0,32^GFA,02304,02304,00012,:Z64:eJzt1EFr1EAUB/AXUpyCC1HpYQ/ifIV6U1g79SI9+CFKFzxvCXgqSfScRWhBeqhS/BweIl6zH2FhZEEvHuLJLKZ5vnmZJNPalR7aW+eQ/fE2zCRv/hOA2/HvUBl4lTUWEGDC9LECiZkqVAECa4iRJM3/CIglWyImrRXiG8Sq9VfEmh3/caxxgaJ1vKj9muePM2vJ/rHCq+5Z/Nd2fqQ3bevnnFzqb5g51p01tahzXEI7v1ZVX3ct694B9haYdPZNn6091Odt5wfbf3Zc9lZVb+k4cF33Fk5/RNefVT2/Sv8vt7u/rosmA2Xc5YRipC/aZCkwthkjZ5w9yqGgEmdSIbUOu6x6VOoyTHsDICnL9BtkVzsKA76uNceCrzKFCUDMR0LlxiH7MdfHbye7k+HmYDTRMP5YVsvPT1S0LMiz+bySgxfhJoyPZ7NpGqR3wiH5jOznW2FpPJ2mXv6aHB5/ofq9/FUIxvMP6dP8Oy2khmfVMlXv4mclPBoe/PyVShGOiv5Rm3HS0yvd9zncOTrZH52yj15+evB8vfFhvni4v75tvbdx33pvZ/y+rV/b2Oh5F0+vd25n0H5FtOmCIsP2EAVSN1QCtY+1iYv51BlYe3VgbD4G2q9ltia0sqZ4sQsKKpCpoMqg3nIcsemeSjZWjQ9aRypim7XiiM3rKrKgZ6NvrpJV49KxqQcl+7djnkcUNI8UmhZUvo4iY3XBXhYpY/OcsO0YIpmQA2ttnLHpXHUWxkKzfcd0uIT2G5vGaL+4sb28HTcy/gIQm3HN:D872
^FT259,113^A0N,28,28^FH\\^FD${data.sectionBottom}^FS
^FT259,78^A0N,28,28^FH\\^FD${data.sectionTop}^FS
^FT7,46^A0N,34,33^FH\\^FD${data.name}^FS
^FT110,217^BQN,2,5
^FH\\^FDLA,https://osu-mgr.org/${data.osuid}^FS
^PQ1,0,1,Y^XZ
`;
}

function largeLabelZPL(
  cruise?: Cruise,
  core?: Core,
  section?: Section,
  sectionHalf?: SectionHalf
) {
  const data = {
    date: new Date().toISOString().slice(0, 10),
    name: sectionHalf?._osuid.substring(4),
    osuid: sectionHalf?._osuid,
    latStart: core?.latitudeStart !== undefined ? core?.latitudeStart : '',
    latEnd:
      core?.latitudeStart !== undefined && core?.latitudeEnd !== undefined
        ? ` - ${core?.latitudeEnd}`
        : '',
    lonStart: core?.longitudeStart !== undefined ? core?.longitudeStart : '',
    lonEnd:
      core?.longitudeStart !== undefined && core?.longitudeEnd !== undefined
        ? ` - ${core?.longitudeEnd}`
        : '',
    depthStart:
      core?.waterDepthStart !== undefined ? core?.waterDepthStart : '',
    depthEnd:
      core?.waterDepthStart !== undefined && core?.waterDepthEnd !== undefined
        ? ` - ${core?.waterDepthEnd} m`
        : ' m',
    nSections: core?.nSections !== undefined ? core?.nSections : '',
    coreLength: core?.length !== undefined ? `${core?.length} cm` : '',
    sectionLength:
      section?.depthTop !== undefined && section?.depthBottom !== undefined
        ? `${Number.parseFloat(section?.depthTop)} -
           ${Number.parseFloat(section?.depthBottom)} cm`
        : '',
    sectionTop:
      section?.depthTop !== undefined ? `${section?.depthTop} cm` : '',
    sectionBottom:
      section?.depthBottom !== undefined ? `${section?.depthBottom} cm` : '',
    sectionInterval:
      section?.depthTop !== undefined && section?.depthBottom !== undefined
        ? `${section?.depthTop} - ${section?.depthBottom} cm`
        : '',
    pi: cruise?.pi,
    alternateName:
      section?.alternateName !== undefined ? section?.alternateName : '',
  };
  return `
CT~~CD,~CC^~CT~
^XA
~TA000
~JSN
^LT0
^MNW
^MTT
^PON
^PMN
^LH0,0
^JMA
^PR4,4
~SD15
^JUS
^LRN
^CI27
^PA0,1,1,0
^XZ
^XA
^MMT
^PW609
^LL406
^LS0
^FO226,164^GFA,1089,1920,12,:Z64:eJy1lMFLFFEcx3/jaK8WchQ22EJ64kkMciOCRWFHwW4dCvRvqFsbBF3MmehQLLFeDRZa6CL7F1iCjqStRHTu0OHhHpSC3TkYDTXM6/veOM89mtjAl/363Y/v93tvfvso1yDK+aQffgiFqZeJ1kQj17SkJCU3dGJbSgEFbuQkDB4KPOSOlKESmITjk6c+dqWMtCKVezHyWPHubzcVeDfkcSoWKy6T4jKlnFFsBG7zSCfle9d3w4F5w0dEGa+OwfAx/BHP4Q2fZDzDvpRP+3ekb3gmA8PbUpj1LRma9S0ZUdY/wWc8eYnhCU1kPKFwtj6hsOFR2PAobHgUNjwKGx7Fsv7VrrL+dZ7xxONj3o3M+sR7zz8+7fmfmo94YoS3gs9UmC83Qf8QZs3I6fGY2ZAdzSskMqlZzoQZ9zORh5ebSQ/JkayZY/3jM5n+5MpEo8QD7b0RGqJpof2POpWokuYzI1Sg4vda7nm1IcpTU6VKi/OdnbDiPll8HHXX333uiGTj7Vqn8vHG6293KnyEFbaLnem1lU7RWZlEvn1r+OtcxarfLByWOqXSbueBXW+v7T7aHroMfrZ+vxBMf5lar3WKf2oPN/Z4P+etuYrnPL26OFgdrH2qNq7nVmtN9GIFx1u45h973rO13PnqWO7leHVc/TEwRHP52X79xYXc2Lkro35J53mrPz/cP6T8xeporb76qqBz9dXdND+zx/dNq7cXFuZNPjY2eqZ1eh5cqX0Net/oazaI+8QCS81cqN61g2HDHZFoH3CJO0ISx9UgXKnuV58rzLu3yH56Po+QJ/4aE5sBvLeFXx4TjvKyjRG0hSNwJ8mtUOUs4LhNVO6oHP6DygNVxpZtofmAu+xXSyieB3xzubuv/MGmz9+0Wq0AXvWDeF9MNG3VJ5MvWliZSVw3y3K5K9y0fyZZmsM/l2wfub2H/7US1hKXlphwiT9LHNTdgPe5HzP0s6Tr+hFrh1TW/VCFof+y7t8fd9B/WfePc8N+l1jAtBeJ4m3B1ZY8tY4dIneE7CbwkT5nLuGtUPOTMrGFFWkeh4881nyfPHAExembyv+vETjR8xfCWePG:7351
^FT25,72^A0N,56,58^FH\\^CI28^FD${data.name}^FS^CI27
^FT25,132^A0N,39,41^FH\\^CI28^FDCore Interval: ${data.sectionInterval}^FS^CI27
^FO25,155^BQN,2,6
^FH^FDLA,https://osu-mgr.org/${data.osuid}^FS
^FO357,155^BQN,2,4
^FH^FDLA,IGSN: ${data.osuid}_0D
Lat: ${data.latStart}${data.latEnd}_0D
Long: ${data.lonStart}${data.lonEnd}_0D
Depth: ${data.depthStart}${data.depthEnd}_0D
Total Sections in Core: ${data.nSections}_0D
Total Length: ${data.coreLength}_0D
Section Length: ${data.sectionLength}_0D
Top: ${data.sectionTop}_0D
Bottom: ${data.sectionBottom}_0D
PI: ${data.pi}^FS
^FT25,373^A0N,31,33^FH\\^CI28^FD${data.alternateName}^FS^CI27
^PQ1,0,1,Y
^XZ
`;
}

const ItemsPrintLabelsModal: FunctionComponent<{
  uuids: string[];
}> = ({ children, uuids }) => {
  const isMounted = useMountedState();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [printerIndex, setPrinterIndex] = useState<number | undefined>(
    undefined
  );
  const [printers, setPrinters] = useState<any[] | undefined>(undefined);
  const [labelSize, setLabelSize] = useState<string>('large');
  const [cruises, setCruises] = useState<
    { [uuid: string]: Cruise } | undefined
  >(undefined);
  const [cores, setCores] = useState<{ [uuid: string]: Core } | undefined>(
    undefined
  );
  const [sections, setSections] = useState<
    { [uuid: string]: Section } | undefined
  >(undefined);
  const [sectionHalves, setSectionHalves] = useState<SectionHalf[] | undefined>(
    undefined
  );
  const [sectionHalvesReady, setSectionHalvesReady] = useState<
    SectionHalf[] | undefined
  >(undefined);
  const [sectionHalvesCount, setSectionHalvesCount] = useState<
    number | undefined
  >(undefined);
  const [accounts, setAccounts] = useState<Account[] | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      setAccounts(undefined);
      (async () => {
        const update = (await searchByType('account')).map((x) => x._source);
        if (isMounted()) setAccounts(update as unknown as Account[]);
      })();
    }
  }, [isMounted, isOpen]);
  useEffect(() => {
    if (isOpen && printers === undefined)
      (async () => {
        const update = (
          await axios.get('http://127.0.0.1:9100/available')
        ).data.printer.filter((x) => x.deviceType === 'printer');
        if (isMounted()) setPrinters(update);
      })();
  }, [isMounted, isOpen, printers]);
  useEffect(() => {
    setSectionHalvesCount(undefined);
    setSectionHalvesReady(undefined);
    setSectionHalves(undefined);
    setSections(undefined);
    setCores(undefined);
    setCruises(undefined);
  }, [uuids]);
  useEffect(() => {
    if (
      sectionHalves === undefined &&
      isOpen &&
      sectionHalvesCount !== undefined &&
      sectionHalvesCount <= 10000
    )
      (async () => {
        const update = await searchByUUIDs(uuids, 0, 10000, 'sectionHalf');
        if (isMounted()) setSectionHalves(update as SectionHalf[]);
      })();
  }, [isMounted, uuids, sectionHalves, sectionHalvesCount, isOpen]);
  const [nLabels, setNLabels] = useState<number>(1);
  useEffect(() => {
    if (isOpen && uuids !== undefined)
      (async () => {
        const update = await countByUUIDs(uuids, 'sectionHalf');
        if (isMounted()) setSectionHalvesCount(update);
      })();
  }, [isMounted, uuids, isOpen]);
  useEffect(() => {
    if (isOpen && cruises === undefined && sectionHalves !== undefined)
      (async () => {
        const cruisesByUUID: { [uuid: string]: Cruise } = {};
        (
          await searchByUUIDs(
            _.uniq(sectionHalves.map((x) => x._cruiseUUID || '')),
            0,
            10000,
            'cruise'
          )
        ).forEach((x) => {
          if (x) cruisesByUUID[x._uuid] = x as Cruise;
        });
        if (isMounted()) setCruises(cruisesByUUID);
      })();
  }, [isMounted, uuids, sectionHalves, isOpen, cruises]);
  useEffect(() => {
    if (isOpen && cores === undefined && sectionHalves !== undefined)
      (async () => {
        const coresByUUID: { [uuid: string]: Core } = {};
        (
          await searchByUUIDs(
            _.uniq(sectionHalves.map((x) => x._coreUUID || '')),
            0,
            10000,
            'core'
          )
        ).forEach((x) => {
          if (x) coresByUUID[x._uuid] = x as Core;
        });
        if (isMounted()) setCores(coresByUUID);
      })();
  }, [isMounted, uuids, sectionHalves, isOpen, cores]);
  useEffect(() => {
    if (isOpen && sections === undefined && sectionHalves !== undefined)
      (async () => {
        const sectionsByUUID: { [uuid: string]: Section } = {};
        (
          await searchByUUIDs(
            _.uniq(sectionHalves.map((x) => x._sectionUUID || '')),
            0,
            10000,
            'section'
          )
        ).forEach((x) => {
          if (x) sectionsByUUID[x._uuid] = x as Section;
        });
        if (isMounted()) setSections(sectionsByUUID);
      })();
  }, [isMounted, uuids, sectionHalves, isOpen, sections]);
  useEffect(() => {
    if (
      isOpen &&
      sectionHalvesReady === undefined &&
      cruises !== undefined &&
      cores !== undefined &&
      sections !== undefined &&
      sectionHalves !== undefined
    ) {
      const ready: SectionHalf[] = [];
      sectionHalves.forEach((sectionHalf) => {
        const cruise = cruises[sectionHalf?._cruiseUUID || ''];
        const core = cores[sectionHalf?._coreUUID || ''];
        const section = sections[sectionHalf?._sectionUUID || ''];
        if (
          cruise &&
          (!cruise._errors || cruise._errors.length === 0) &&
          core &&
          (!core._errors || core._errors.length === 0) &&
          section &&
          (!section._errors || section._errors.length === 0) &&
          (!sectionHalf._errors || sectionHalf._errors.length === 0)
        )
          ready.push(sectionHalf);
      });
      setSectionHalvesReady(ready);
    }
  }, [
    uuids,
    sectionHalvesReady,
    isOpen,
    cruises,
    cores,
    sections,
    sectionHalves,
  ]);
  return (
    <Modal
      trigger={children}
      icon="print"
      title="Print Section-Half Labels"
      buttons={(close) => (
        <>
          <Button
            primary
            disabled={
              sectionHalvesCount === undefined ||
              sectionHalvesCount > 10000 ||
              sectionHalvesReady === undefined ||
              sectionHalves === undefined ||
              sections === undefined ||
              cores === undefined ||
              cruises === undefined ||
              printerIndex === undefined
            }
            icon
            onClick={() => {
              sectionHalvesReady?.forEach((sectionHalf) =>
                axios.post('http://127.0.0.1:9100/write', {
                  device: printers && printers[printerIndex || 0],
                  data:
                    labelSize === 'small'
                      ? smallLabelZPL(
                          (sections &&
                            sections[sectionHalf?._sectionUUID || '']) ||
                            undefined,
                          sectionHalf
                        )
                      : largeLabelZPL(
                          (cruises &&
                            cruises[sectionHalf?._cruiseUUID || '']) ||
                            undefined,
                          (cores && cores[sectionHalf?._coreUUID || '']) ||
                            undefined,
                          (sections &&
                            sections[sectionHalf?._sectionUUID || '']) ||
                            undefined,
                          sectionHalf
                        ),
                })
              );
              close();
            }}
          >
            <Icon name="print" /> Print Labels
          </Button>
        </>
      )}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
    >
      <>
        <Header style={{ textAlign: 'center' }}>
          {sectionHalvesCount === undefined ? (
            <Loader inline active className="inline-loader" />
          ) : (
            sectionHalvesCount
          )}{' '}
          Label{sectionHalvesCount !== 1 ? 's' : ''}
          <br />
          {sectionHalvesReady === undefined ? (
            <Loader inline active className="inline-loader" />
          ) : (
            sectionHalvesReady.length
          )}{' '}
          Label{sectionHalvesReady?.length !== 1 ? 's' : ''} Ready to Print
        </Header>
        <Form.Select
          label="Printer"
          error={printerIndex === undefined}
          placeholder="Select a Printer"
          loading={printers === undefined}
          options={
            printers?.map((x, i) => ({ key: i, text: x.name, value: i })) || []
          }
          value={printerIndex}
          onChange={(_e, data) => setPrinterIndex(data.value as number)}
        />
        <Form.Field
          label="Label Size"
          control={() => (
            <ButtonGroup fluid>
              <Button
                primary={labelSize === 'large'}
                onClick={() => setLabelSize('large')}
              >
                Large Label{sectionHalvesCount !== 1 ? 's' : ''}
              </Button>
              <Button
                primary={labelSize === 'small'}
                onClick={() => setLabelSize('small')}
              >
                Small Label{sectionHalvesCount !== 1 ? 's' : ''}
              </Button>
            </ButtonGroup>
          )}
        />
        <FormGridColumns widths={[3, 10, 3]} label="Labels per Section-Half">
          <Button
            fluid
            primary
            disabled={nLabels === 1}
            onClick={() => setNLabels(nLabels - 1)}
            icon="minus"
          />
          <Form.Input
            value={nLabels}
            onChange={(_e, data) => {
              setNLabels(Number.parseInt(data.value.replace(/\D/g, ''), 10));
            }}
          />
          <Button
            fluid
            primary
            onClick={() => setNLabels(nLabels + 1)}
            icon="plus"
          />
        </FormGridColumns>
        <Form.Field
          label={`Label${(sectionHalves || []).length > 1 ? 's' : ''} Order`}
          style={{ marginBottom: 0 }}
        />
        <List relaxed divided style={{ marginTop: 0 }}>
          <div />
          {sectionHalvesReady === undefined && (
            <div style={{ textAlign: 'center' }}>
              <Loader inline active />
            </div>
          )}
          {sectionHalvesReady?.map((sectionHalf, i) => {
            const section =
              (sections && sections[sectionHalf?._sectionUUID || '']) ||
              undefined;
            return (
              <List.Item
                as="a"
                style={{ minHeight: 50 }}
                key={sectionHalf._uuid}
              >
                <List.Content floated="left" align="right">
                  <List.Header>
                    {i + 1}.<br />
                    &nbsp;
                  </List.Header>
                </List.Content>
                <List.Content>
                  <List.Header style={{ float: 'right' }} align="right">
                    <Icon name="edit outline" />
                    {DateTime.fromISO(
                      sectionHalf._history[0].datetime
                    ).toISODate()}{' '}
                    by
                    <br />
                    {accounts ? (
                      accounts.filter(
                        (x) => x._uuid === sectionHalf._history[0].login
                      )[0].name
                    ) : (
                      <Loader active inline size="mini" />
                    )}
                  </List.Header>
                  <List.Header as="header">{sectionHalf._osuid}</List.Header>
                  <List.Header>
                    Core Interval:{' '}
                    {section?.depthTop !== undefined &&
                    section?.depthBottom !== undefined
                      ? `${Number.parseFloat(section?.depthTop)} -
                         ${Number.parseFloat(section?.depthBottom)} cm`
                      : ''}
                  </List.Header>
                </List.Content>
              </List.Item>
            );
          })}
        </List>
      </>
    </Modal>
  );
};

export default ItemsPrintLabelsModal;
