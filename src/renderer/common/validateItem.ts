import { DateTime } from 'luxon';
import { coreTypes } from './vocabularies';
import { Item } from '../stores/items';

const validateItem = (item: Item) => {
  if (item !== undefined) {
    item._errors = [];
    item._warnings = [];
    item._validated = DateTime.now().toISO();
    if (
      item._docType === 'cruise' &&
      (item.pi === undefined || item.pi.trim() === '')
    ) {
      item._errors.push('PI is missing or invalid');
    }
    if (
      item._docType === 'core' &&
      (item.method === undefined || !coreTypes[item.method])
    ) {
      item._errors.push('Collection Method is missing or invalid');
    }
    if (
      item._docType === 'core' &&
      (item.latitudeStart === undefined ||
        Number.isNaN(Number.parseFloat(item.latitudeStart)))
    ) {
      item._errors.push('Latitude Start is missing or invalid');
    }
    if (
      item._docType === 'core' &&
      (item.longitudeStart === undefined ||
        Number.isNaN(Number.parseFloat(item.longitudeStart)))
    ) {
      item._errors.push('Longitude Start is missing or invalid');
    }
    if (
      item._docType === 'core' &&
      (item.waterDepthStart === undefined ||
        Number.isNaN(Number.parseFloat(item.waterDepthStart)))
    ) {
      item._errors.push('Water Depth Start is missing or invalid');
    }
    if (
      item._docType === 'core' &&
      (item.nSections === undefined ||
        Number.isNaN(Number.parseInt(item.nSections, 10)))
    ) {
      item._errors.push('N Sections is missing or invalid');
    }
    if (
      item._docType === 'core' &&
      (item.length === undefined ||
        Number.isNaN(Number.parseFloat(item.length)))
    ) {
      item._errors.push('Length is missing or invalid');
    }
    if (
      item._docType === 'section' &&
      (item.depthTop === undefined ||
        Number.isNaN(Number.parseFloat(item.depthTop)))
    ) {
      item._errors.push('Depth Top is missing or invalid');
    }
    if (
      item._docType === 'section' &&
      (item.depthBottom === undefined ||
        Number.isNaN(Number.parseFloat(item.depthBottom)))
    ) {
      item._errors.push('Depth Bottom is missing or invalid');
    }
    if (
      item._docType === 'sectionHalf' &&
      (item.weight === undefined ||
        Number.isNaN(Number.parseFloat(item.weight)))
    ) {
      item._errors.push('Weight is missing or invalid');
    }
    if (item._docType === 'sectionHalf' && item.storageLocation === undefined) {
      item._warnings.push('Storage Location is missing or invalid');
    }
  }
  return item;
};

export default validateItem;
