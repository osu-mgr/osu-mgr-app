/* eslint-disable no-await-in-loop */
import { FunctionComponent } from 'react';
import { useRecoilValue } from 'recoil';
import { List, Grid, Button, Icon, SemanticICONS } from 'semantic-ui-react';
import ListItemHistoryPushLink from './list.item.history-push.link';
import ItemsSearchBar from './items.search-bar';
import ItemFilterLabels from './items.filter-labels';
import ItemsImportModal from './items.import.modal';
import ItemsCount from './items.count';
import { indexDocs, scrollSearch } from '../common/es';
import { loginState } from '../stores/accounts';
import {
  ItemType,
  itemTypes,
  itemTypesIcon,
  itemTypesSingular,
  itemTypesPlural,
} from '../stores/items';
import validateItem from '../common/validateItem';

const ListItemCounts: FunctionComponent<{
  icon: SemanticICONS;
  type: ItemType;
  singular: string;
  plural: string;
  disabled?: boolean;
}> = ({ icon, type, singular, plural, disabled }) => {
  return (
    <ListItemHistoryPushLink
      path={plural}
      title={<ItemsCount type={type} singular={singular} plural={plural} />}
      icon={icon}
      disabled={disabled}
    >
      <ItemFilterLabels type={type} />
    </ListItemHistoryPushLink>
  );
};

let validated = false;
const runValidation = () => {
  console.log('Validate?');
  if (!validated) {
    validated = true;
    (async () => {
      let i = 0;
      console.log('Validating batch of items...');
      const params = {
        size: 10000,
        index: 'osu-mgr-dev',
        body: {
          query: {
            bool: {
              must_not: [
                {
                  term: { '_docType.keyword': 'account' },
                },
              ],
              filter: {
                script: {
                  script:
                    "doc['_validated'].empty || doc['_validated'].value.millis <= doc['_modified'].value.millis",
                },
              },
            },
          },
        },
      };
      let validatedItems = {};
      for await (const hit of scrollSearch(params)) {
        i += 1;
        validatedItems[hit._id] = validateItem(hit._source);
        if (i % 1000 === 0) {
          await indexDocs(Object.values(validatedItems));
          console.log('Validating...', i);
          validatedItems = {};
        }
      }
      if (Object.keys(validatedItems).length > 0)
        await indexDocs(Object.values(validatedItems));
      if (i > 0) {
        console.log(`Validated ${i} items.`);
        validated = false;
        runValidation();
      }
    })();
  }
};

const ItemsPage: FunctionComponent = () => {
  const login = useRecoilValue(loginState);

  runValidation();

  return (
    <List relaxed divided>
      <ItemsSearchBar plural="Items" />
      <Grid style={{ marginBottom: 0 }}>
        <Grid.Column width={8}>
          <ItemsImportModal>
            <Button
              primary
              icon
              fluid
              disabled={!login || !login._permissions?.includes('import_items')}
            >
              <Icon.Group>
                <Icon name="file excel outline" />
                <Icon corner name="chevron circle up" />
              </Icon.Group>{' '}
              Import
            </Button>
          </ItemsImportModal>
        </Grid.Column>
        <Grid.Column width={8}>
          <Button primary icon fluid disabled>
            <Icon.Group>
              <Icon name="file excel outline" />
              <Icon corner name="chevron circle down" />
            </Icon.Group>{' '}
            Export
          </Button>
        </Grid.Column>
      </Grid>
      <List.Item>
        <List.Content floated="left">
          <Icon.Group size="big">
            <Icon
              name="list layout"
              style={{ padding: 0, minWidth: '2.5rem' }}
            />
          </Icon.Group>
        </List.Content>
        <List.Content style={{ marginLeft: '3.75rem' }}>
          <h3 style={{ margin: 0 }}>
            <ItemsCount singular="Item" plural="Items" />
          </h3>
          <List.Description style={{ marginTop: '.5rem' }}>
            <ItemFilterLabels />
          </List.Description>
        </List.Content>
      </List.Item>
      {itemTypes.map((itemType) => (
        <ListItemCounts
          icon={itemTypesIcon[itemType]}
          key={itemType}
          type={itemType}
          singular={itemTypesSingular[itemType]}
          plural={itemTypesPlural[itemType]}
        />
      ))}
    </List>
  );
};

export default ItemsPage;
