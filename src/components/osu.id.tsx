import React, { FunctionComponent } from 'react';
import { useRecoilValue } from 'recoil';
import {
  cruisesState,
  Cruise,
  coresState,
  Core,
  coreTypes,
  sectionsState,
  Section,
  sectionHalvesState,
  SectionHalf,
  sectionHalfTypes,
  sectionSamplesState,
  SectionSample,
  divesState,
  Dive,
  diveTypes,
  diveSamplesState,
  DiveSample,
  diveSubsamplesState,
  DiveSubsample,
} from '../stores/items';

export function calculatedOSUID({
  cruise,
  core,
  section,
  sectionHalf,
  sectionSample,
  dive,
  diveSample,
  diveSubsample,
}: {
  cruise?: Cruise;
  core?: Core;
  section?: Section;
  sectionHalf?: SectionHalf;
  sectionSample?: SectionSample;
  dive?: Dive;
  diveSample?: DiveSample;
  diveSubsample?: DiveSubsample;
}): string {
  return `${`OSU-${(cruise && cruise.id) || '[?]'}`}${
    core
      ? `-${core.id || '[?]'}${
          (core.method && coreTypes[core.method]) || '[?]'
        }`
      : ''
  }${section ? `-${section.id || '[?]'}` : ''}${
    sectionHalf
      ? `${(sectionHalf.type && sectionHalfTypes[sectionHalf.type]) || '[?]'}`
      : ''
  }${sectionSample ? `-${sectionSample.id || '[?]'}` : ''}${
    dive
      ? `-${(dive.method && diveTypes[dive.method]) || '[?]'}${
          dive.id || '[?]'
        }`
      : ''
  }${diveSample ? `-${diveSample.id || '[?]'}` : ''}${
    diveSubsample ? `.${diveSubsample.id || '[?]'}` : ''
  }`;
}

const OSUID: FunctionComponent<{
  as?: string;
  uuIDs: {
    cruise?: string;
    core?: string;
    section?: string;
    sectionHalf?: string;
    sectionSample?: string;
    dive?: string;
    diveSample?: string;
    diveSubsample?: string;
  };
}> = ({ as, uuIDs, ...props }) => {
  const cruises = useRecoilValue(cruisesState);
  const cores = useRecoilValue(coresState);
  const sections = useRecoilValue(sectionsState);
  const sectionHalves = useRecoilValue(sectionHalvesState);
  const sectionSamples = useRecoilValue(sectionSamplesState);
  const dives = useRecoilValue(divesState);
  const diveSamples = useRecoilValue(diveSamplesState);
  const diveSubsamples = useRecoilValue(diveSubsamplesState);
  const diveSubsample =
    (uuIDs.diveSubsample && diveSubsamples[uuIDs.diveSubsample]) || undefined;
  const diveSample =
    (uuIDs.diveSample && diveSamples[uuIDs.diveSample]) ||
    (diveSubsample &&
      diveSubsample.sample &&
      diveSamples[diveSubsample.sample]) ||
    undefined;
  const dive =
    (uuIDs.dive && dives[uuIDs.dive]) ||
    (diveSample && diveSample.dive && dives[diveSample.dive]) ||
    undefined;
  const sectionSample =
    (uuIDs.sectionSample && sectionSamples[uuIDs.sectionSample]) || undefined;
  const sectionHalf =
    (uuIDs.sectionHalf && sectionHalves[uuIDs.sectionHalf]) ||
    (sectionSample &&
      sectionSample.sectionHalf &&
      sectionHalves[sectionSample.sectionHalf]) ||
    undefined;
  const section =
    (uuIDs.section && sections[uuIDs.section]) ||
    (sectionHalf && sectionHalf.section && sections[sectionHalf.section]) ||
    undefined;
  const core =
    (uuIDs.core && cores[uuIDs.core]) ||
    (section && section.core && cores[section.core]) ||
    undefined;
  const cruise =
    (uuIDs.cruise && cruises[uuIDs.cruise]) ||
    (core && core.cruise && cruises[core.cruise]) ||
    (dive && dive.cruise && cruises[dive.cruise]) ||
    undefined;
  const osuID = calculatedOSUID({
    cruise,
    core,
    section,
    sectionHalf,
    sectionSample,
    dive,
    diveSample,
    diveSubsample,
  });
  const As =
    (as &&
      React.createElement(as, { ...props, readOnly: true, value: osuID })) ||
    undefined;
  return As || <>{osuID}</>;
};

export default OSUID;

export function stringOSUID({
  cruise,
  core,
  section,
  sectionHalf,
  sectionSample,
  dive,
  diveSample,
  diveSubsample,
}: {
  cruise?: string;
  core?: string;
  section?: string;
  sectionHalf?: string;
  sectionSample?: string;
  dive?: string;
  diveSample?: string;
  diveSubsample?: string;
}): string {
  const elem = (
    <OSUID
      uuIDs={{
        cruise,
        core,
        section,
        sectionHalf,
        sectionSample,
        dive,
        diveSample,
        diveSubsample,
      }}
    />
  );
  console.log(elem, elem[0], elem[0] && elem[0].innerHtml);
  return (elem[0] && elem[0].innerHtml) || 'OSU-[ERROR!]';
}
