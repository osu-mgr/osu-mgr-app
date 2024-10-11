import { SemanticICONS } from 'semantic-ui-react';

export const locationAreas = ['DW', 'DE', 'CW', 'CE', 'SF', 'RE', 'RB'];

export const locationRackConfigurations = {
  DW: [
    {
      name: 'A',
      racks: [
        { type: 'DDH1', name: 'A3' },
        { type: 'DDH1', name: 'A2' },
        { type: 'DDH1', name: 'A1' },
      ],
    },
    {
      name: 'B',
      racks: [
        { type: 'DDH1', name: 'B3' },
        { type: 'DDH1', name: 'B2' },
        { type: 'DDH1', name: 'B1' },
      ],
    },
    { name: '1', labels: [3, 2, 1] },
    {
      name: 'C',
      racks: [
        { type: 'DDH1', name: 'C3' },
        { type: 'DDH1', name: 'C2' },
        { type: 'DDH1', name: 'C1' },
      ],
    },
    {
      name: 'D',
      racks: [
        { type: 'DDH1', name: 'D3' },
        { type: 'DDH1', name: 'D2' },
        { type: 'DDH1', name: 'D1' },
      ],
    },
    { name: '2', labels: [3, 2, 1] },
    {
      name: 'E',
      racks: [
        { type: 'Pallets1', name: 'E3' },
        { type: 'Pallets1', name: 'E2' },
        { type: 'Pallets1', name: 'E1' },
      ],
    },
    {
      name: 'F',
      racks: [
        { type: 'Pallets1', name: 'F3' },
        { type: 'Pallets1', name: 'F2' },
        { type: 'Pallets1', name: 'F1' },
      ],
    },
    { name: '3', labels: [3, 2, 1] },
    {
      name: 'G',
      racks: [
        { type: 'Cages1', name: 'G3' },
        { type: 'Pallets1', name: 'G2' },
        { type: 'Pallets1', name: 'G1' },
      ],
    },
  ],
  DE: [
    {
      name: 'C',
      racks: [
        { type: 'Pallets1', name: 'C1' },
        { type: 'Pallets1', name: 'C2' },
        { type: 'Pallets1', name: 'C3' },
      ],
    },
    {
      name: 'D',
      racks: [
        { type: 'Pallets1', name: 'D1' },
        { type: 'Pallets1', name: 'D2' },
        { type: 'Pallets1', name: 'D3' },
      ],
    },
    { name: '1', labels: [1, 2, 3] },
    {
      name: 'E',
      racks: [
        { type: 'Pallets1', name: 'E1' },
        { type: 'Pallets1', name: 'E2' },
        { type: 'Pallets1', name: 'E3' },
      ],
    },
    {
      name: 'F',
      racks: [
        { type: 'Pallets1', name: 'F1' },
        { type: 'Pallets1', name: 'F2' },
        { type: 'Pallets1', name: 'F3' },
      ],
    },
    { name: '2', labels: ['', 2, 3] },
    {
      name: 'G',
      racks: [
        {},
        { type: 'Pallets1', name: 'G2' },
        { type: 'Pallets1', name: 'G3' },
      ],
    },
  ],
  RB: [
    {
      name: 'AA',
      racks: [
        { type: 'Basement1', name: 'AA1' },
        { type: 'Basement1', name: 'AA2' },
        { type: 'Basement1', name: 'AA3' },
      ],
    },
    { name: '1', labels: [1, 2, 3] },
    {
      name: 'AB',
      racks: [
        { type: 'Basement1', name: 'AB1' },
        { type: 'Basement1', name: 'AB2' },
        { type: 'Basement1', name: 'AB3' },
      ],
    },
    {
      name: 'AC',
      racks: [
        { type: 'Basement1', name: 'AC1' },
        { type: 'Basement1', name: 'AC2' },
        { type: 'Basement1', name: 'AC3' },
      ],
    },
    { name: '2' },
    {
      name: 'AD',
      racks: [
        { type: 'Basement1', name: 'AD1' },
        { type: 'Basement1', name: 'AD2' },
        { type: 'Basement1', name: 'AD3' },
      ],
    },
    {
      name: 'AE',
      racks: [
        { type: 'Basement1', name: 'AE1' },
        { type: 'Basement1', name: 'AE2' },
        { type: 'Basement1', name: 'AE3' },
      ],
    },
    { name: '3' },
    {
      name: 'AF',
      racks: [
        { type: 'Basement1', name: 'AF1' },
        { type: 'Basement1', name: 'AF2' },
        { type: 'Basement1', name: 'AF3' },
      ],
    },
    {
      name: 'AG',
      racks: [
        { type: 'Basement1', name: 'AG1' },
        { type: 'Basement1', name: 'AG2' },
        { type: 'Basement1', name: 'AG3' },
      ],
    },
    { name: '4' },
    {
      name: 'AH',
      racks: [
        { type: 'Basement1', name: 'AH1' },
        { type: 'Basement1', name: 'AH2' },
        { type: 'Basement1', name: 'AH3' },
      ],
    },
    {
      name: 'AI',
      racks: [
        { type: 'Basement1', name: 'AI1' },
        { type: 'Basement1', name: 'AI2' },
        { type: 'Basement1', name: 'AI3' },
      ],
    },
    { name: '5' },
    {
      name: 'AJ',
      racks: [
        { type: 'Basement1', name: 'AJ1' },
        { type: 'Basement1', name: 'AJ2' },
        { type: 'Basement1', name: 'AJ3' },
      ],
    },
    {
      name: 'AK',
      racks: [
        { type: 'Basement1', name: 'AK1' },
        { type: 'Basement1', name: 'AK2' },
        { type: 'Basement1', name: 'AK3' },
      ],
    },
    { name: '6', labels: [1, 2, 3] },
    {
      name: 'AL',
      racks: [
        { type: 'Basement1', name: 'AL1' },
        { type: 'Basement1', name: 'AL2' },
        { type: 'Basement1', name: 'AL3' },
      ],
    },
    {
      name: 'AM',
      racks: [
        { type: 'Basement1', name: 'AM1' },
        { type: 'Basement1', name: 'AM2' },
        { type: 'Basement1', name: 'AM3' },
      ],
    },
    { name: '7', labels: [1, 2, 3] },
    {
      name: 'AN',
      racks: [
        { type: 'Basement1', name: 'AN1' },
        { type: 'Basement1', name: 'AN2' },
        { type: 'Basement1', name: 'AN3' },
      ],
    },
    {
      name: 'AO',
      racks: [
        { type: 'Basement1', name: 'AO1' },
        { type: 'Basement1', name: 'AO2' },
        { type: 'Basement1', name: 'AO3' },
      ],
    },
    { name: '8' },
    {
      name: 'AP',
      racks: [
        { type: 'Basement1', name: 'AP1' },
        { type: 'Basement1', name: 'AP2' },
        { type: 'Basement1', name: 'AP3' },
      ],
    },
    {
      name: 'AQ',
      racks: [
        { type: 'Basement1', name: 'AQ1' },
        { type: 'Basement1', name: 'AQ2' },
        { type: 'Basement1', name: 'AQ3' },
      ],
    },
    { name: '9' },
    {
      name: 'AR',
      racks: [
        { type: 'Basement1', name: 'AR1' },
        { type: 'Basement1', name: 'AR2' },
        { type: 'Basement1', name: 'AR3' },
      ],
    },
    {
      name: 'AS',
      racks: [
        { type: 'Basement1', name: 'AS1' },
        { type: 'Basement1', name: 'AS2' },
        { type: 'Basement1', name: 'AS3' },
      ],
    },
    { name: '10' },
    {
      name: 'AT',
      racks: [
        { type: 'Basement1', name: 'AT1' },
        { type: 'Basement1', name: 'AT2' },
        { type: 'Basement1', name: 'AT3' },
      ],
    },
    {
      name: 'AU',
      racks: [
        { type: 'Basement1', name: 'AU1' },
        { type: 'Basement1', name: 'AU2' },
        { type: 'Basement1', name: 'AU3' },
      ],
    },
    { name: '11' },
    {
      name: 'AV',
      racks: [
        { type: 'Basement1', name: 'AV1' },
        { type: 'Basement1', name: 'AV2' },
        { type: 'Basement1', name: 'AV3' },
      ],
    },
    {
      name: 'AW',
      racks: [
        { type: 'Basement1', name: 'AW1' },
        { type: 'Basement1', name: 'AW2' },
        { type: 'Basement1', name: 'AW3' },
      ],
    },
    { name: '12', labels: [1, 2, 3] },
    {
      name: 'AX',
      racks: [
        { type: 'Basement1', name: 'AX1' },
        { type: 'Basement1', name: 'AX2' },
        { type: 'Basement1', name: 'AX3' },
      ],
    },
    {
      name: 'AY',
      racks: [
        { type: 'Basement1', name: 'AY1' },
        { type: 'Basement1', name: 'AY2' },
        { type: 'Basement1', name: 'AY3' },
      ],
    },
    { name: '13', labels: [1, 2, 3] },
    {
      name: 'AZ',
      racks: [
        { type: 'Basement1', name: 'AZ1' },
        { type: 'Basement1', name: 'AZ2' },
        { type: 'Basement1', name: 'AZ3' },
      ],
    },
    {
      name: 'BA',
      racks: [
        { type: 'Basement1', name: 'BA1' },
        { type: 'Basement1', name: 'BA2' },
        { type: 'Basement1', name: 'BA3' },
      ],
    },
    { name: '14' },
    {
      name: 'BB',
      racks: [
        { type: 'Basement1', name: 'BB1' },
        { type: 'Basement1', name: 'BB2' },
        { type: 'Basement1', name: 'BB3' },
      ],
    },
    {
      name: 'BC',
      racks: [
        { type: 'Basement1', name: 'BC1' },
        { type: 'Basement1', name: 'BC2' },
        { type: 'Basement1', name: 'BC3' },
      ],
    },
    { name: '15' },
    {
      name: 'BD',
      racks: [
        { type: 'Basement1', name: 'BD1' },
        { type: 'Basement1', name: 'BD2' },
        { type: 'Basement1', name: 'BD3' },
      ],
    },
    {
      name: 'BE',
      racks: [
        { type: 'Basement1', name: 'BE1' },
        { type: 'Basement1', name: 'BE2' },
        { type: 'Basement1', name: 'BE3' },
      ],
    },
    { name: '16' },
    {
      name: 'BF',
      racks: [
        { type: 'Basement1', name: 'BF1' },
        { type: 'Basement1', name: 'BF2' },
        { type: 'Basement1', name: 'BF3' },
      ],
    },
    {
      name: 'BG',
      racks: [
        { type: 'Basement1', name: 'BG1' },
        { type: 'Basement1', name: 'BG2' },
        { type: 'Basement1', name: 'BG3' },
      ],
    },
    { name: '17' },
    {
      name: 'BH',
      racks: [
        { type: 'Basement1', name: 'BH1' },
        { type: 'Basement1', name: 'BH2' },
        { type: 'Basement1', name: 'BH3' },
      ],
    },
    {
      name: 'BI',
      racks: [
        { type: 'Basement1', name: 'BI1' },
        { type: 'Basement1', name: 'BI2' },
        { type: 'Basement1', name: 'BI3' },
      ],
    },
    { name: '18', labels: [1, 2, 3] },
    {
      name: 'BJ',
      racks: [
        { type: 'Basement1', name: 'BJ1' },
        { type: 'Basement1', name: 'BJ2' },
        { type: 'Basement1', name: 'BJ3' },
      ],
    },
  ],
  CW: [
    {
      name: 'A',
      racks: [
        { type: 'Pallets2', name: 'A3' },
        { type: 'Pallets2', name: 'A2' },
        { type: 'Pallets2', name: 'A1' },
      ],
    },
    {
      name: 'B',
      racks: [
        { type: 'Pallets2', name: 'B3' },
        { type: 'Pallets2', name: 'B2' },
        { type: 'Pallets2', name: 'B1' },
      ],
    },
    { name: '1', labels: [3, 2, 1] },
    {
      name: 'C',
      racks: [
        { type: 'Pallets2', name: 'C3' },
        { type: 'Pallets2', name: 'C2' },
        { type: 'Pallets2', name: 'C1' },
      ],
    },
    {
      name: 'D',
      racks: [
        { type: 'Pallets2', name: 'D3' },
        { type: 'Pallets2', name: 'D2' },
        { type: 'Pallets2', name: 'D1' },
      ],
    },
    { name: '2', labels: [3, 2, 1] },
    {
      name: 'E',
      racks: [
        { type: 'Pallets2', name: 'E3' },
        { type: 'Pallets2', name: 'E2' },
        { type: 'Pallets2', name: 'E1' },
      ],
    },
    {
      name: 'F',
      racks: [
        { type: 'Pallets2', name: 'F3' },
        { type: 'Pallets2', name: 'F2' },
        { type: 'Pallets2', name: 'F1' },
      ],
    },
    { name: '3', labels: [3, 2, 1] },
    {
      name: 'G',
      racks: [
        { type: 'Cages6', name: 'G3' },
        { type: 'Cages4', name: 'G2' },
        { type: 'Cages4', name: 'G1' },
      ],
    },
    {
      name: 'H',
      racks: [
        { type: 'Cages4', name: 'H3' },
        { type: 'Cages4', name: 'H2' },
        { type: 'Cages4', name: 'H1' },
      ],
    },
    { name: '4', labels: [3, 2, 1] },
    {
      name: 'I',
      racks: [
        { type: 'Cages5', name: 'I3' },
        { type: 'Cages5', name: 'I2' },
        { type: 'Cages5', name: 'I1' },
      ],
    },
    {
      name: 'J',
      racks: [
        { type: 'Cages5', name: 'J3' },
        { type: 'Cages5', name: 'J2' },
        { type: 'Cages5', name: 'J1' },
      ],
    },
    { name: '5', labels: [3, 2, 1] },
    {
      name: 'K',
      racks: [
        { type: 'Cages5', name: 'K3' },
        { type: 'Cages5', name: 'K2' },
        { type: 'Cages4', name: 'K1' },
      ],
    },
    {
      name: 'L',
      racks: [
        { type: 'Cages5', name: 'L3' },
        { type: 'Cages4', name: 'L2' },
        { type: 'Cages5', name: 'L1' },
      ],
    },
    { name: '6', labels: [3, 2, 1] },
    {
      name: 'M',
      racks: [
        { type: 'Cages4', name: 'M3' },
        { type: 'Cages5', name: 'M2' },
        { type: 'Cages5', name: 'M1' },
      ],
    },
    {
      name: 'N',
      racks: [
        { type: 'Pallets2', name: 'N3' },
        { type: 'Pallets2', name: 'N2' },
        { type: 'Pallets2', name: 'N1' },
      ],
    },
    { name: '7' },
    { name: '8', labels: [3, 2, ''] },
    {
      name: 'O',
      racks: [
        { type: 'Pallets2', name: 'O3' },
        { type: 'Pallets2', name: 'O2' },
        {},
      ],
    },
  ],
  CE: [
    {
      name: 'A',
      racks: [
        { type: 'Pallets2', name: 'A1' },
        { type: 'Pallets2', name: 'A2' },
        { type: 'Pallets2', name: 'A3' },
      ],
    },
    {
      name: 'B',
      racks: [
        { type: 'Pallets2', name: 'B1' },
        { type: 'Pallets2', name: 'B2' },
        { type: 'Pallets2', name: 'B3' },
      ],
    },
    { name: '6', labels: [1, 2, 3] },
    {
      name: 'C',
      racks: [
        { type: 'Pallets2', name: 'C1' },
        { type: 'Pallets2', name: 'C2' },
        { type: 'Pallets2', name: 'C3' },
      ],
    },
    {
      name: 'D',
      racks: [
        { type: 'Pallets2', name: 'D1' },
        { type: 'Pallets2', name: 'D2' },
        { type: 'Pallets2', name: 'D3' },
      ],
    },
    { name: '5', labels: [1, 2, 3] },
    {
      name: 'E',
      racks: [
        { type: 'Pallets2', name: 'E1' },
        { type: 'Cages2', name: 'E2' },
        { type: 'Cages2', name: 'E3' },
      ],
    },
    {
      name: 'F',
      racks: [
        { type: 'Cages2', name: 'F1' },
        { type: 'Cages2', name: 'F2' },
        { type: 'Cages2', name: 'F3' },
      ],
    },
    { name: '4', labels: [1, 2, 3] },
    {
      name: 'G',
      racks: [
        { type: 'Cages4', name: 'G1' },
        { type: 'Cages4', name: 'G2' },
        { type: 'Cages2', name: 'G3' },
      ],
    },
    {
      name: 'H',
      racks: [
        { type: 'Cages4', name: 'H1' },
        { type: 'Cages4', name: 'H2' },
        { type: 'Cages7', name: 'H3' },
      ],
    },
    { name: '3', labels: [1, 2, 3] },
    {
      name: 'I',
      racks: [
        { type: 'Cages4', name: 'I1' },
        { type: 'Cages5', name: 'I2' },
        { type: 'Cages5', name: 'I3' },
      ],
    },
    {
      name: 'J',
      racks: [
        { type: 'Cages3', name: 'J1' },
        { type: 'Cages5', name: 'J2' },
        { type: 'Cages4', name: 'J3' },
      ],
    },
    { name: '2', labels: [1, 2, 3] },
    {
      name: 'K',
      racks: [
        { type: 'Cages4', name: 'K1' },
        { type: 'Cages5', name: 'K2' },
        { type: 'Andrill1', name: 'K3' },
      ],
    },
    {
      name: 'L',
      racks: [
        { type: 'Andrill1', name: 'L1' },
        { type: 'Andrill1', name: 'L2' },
        { type: 'Andrill1', name: 'L3' },
      ],
    },
    { name: '1', labels: [1, 2, 3] },
    {
      name: 'M',
      racks: [
        { type: 'Andrill1', name: 'M1' },
        { type: 'Andrill1', name: 'M2' },
        { type: 'Andrill1', name: 'M3' },
      ],
    },
    {
      name: 'N',
      racks: [
        { type: 'Andrill1', name: 'N1' },
        { type: 'Andrill1', name: 'N2' },
        { type: 'Andrill1', name: 'N3' },
      ],
    },
  ],
  RE: [
    {
      name: 'E',
      racks: [
        { type: 'Pallets1', name: 'E1' },
        { type: 'Pallets1', name: 'E2' },
      ],
    },
    { name: '1' },
    { name: '2' },
    { name: '3', labels: [1, 2] },
    {
      name: 'F',
      racks: [
        { type: 'Pallets1', name: 'F1' },
        { type: 'Pallets1', name: 'F2' },
      ],
    },
    {
      name: 'G',
      racks: [
        { type: 'Pallets1', name: 'G1' },
        { type: 'Pallets1', name: 'G2' },
      ],
    },
    { name: '4' },
    { name: '5' },
    { name: '6', labels: [1, 2] },
    {
      name: 'H',
      racks: [
        { type: 'Pallets1', name: 'H1' },
        { type: 'Pallets1', name: 'H2' },
      ],
    },
    {
      name: 'I',
      racks: [
        { type: 'Pallets1', name: 'I1' },
        { type: 'Pallets1', name: 'I2' },
      ],
    },
    { name: '7' },
    { name: '8' },
    { name: '9', labels: [1, 2] },
    {
      name: 'J',
      racks: [
        { type: 'Pallets1', name: 'J1' },
        { type: 'Pallets1', name: 'J2' },
      ],
    },
    {
      name: 'K',
      racks: [
        { type: 'Pallets1', name: 'K1' },
        { type: 'Pallets1', name: 'K2' },
      ],
    },
    { name: '10' },
    { name: '11' },
    { name: '12', labels: [1, 2] },
    {
      name: 'L',
      racks: [
        { type: 'Pallets1', name: 'L1' },
        { type: 'Pallets1', name: 'L2' },
      ],
    },
    {
      name: 'M',
      racks: [
        { type: 'Pallets1', name: 'M1' },
        { type: 'Pallets1', name: 'M2' },
      ],
    },
    { name: '13' },
    { name: '14' },
    { name: '15', labels: [1, 2] },
    {
      name: 'N',
      racks: [
        { type: 'Pallets1', name: 'N1' },
        { type: 'Pallets1', name: 'N2' },
      ],
    },
    {
      name: 'O',
      racks: [
        { type: 'Pallets1', name: 'O1' },
        { type: 'Pallets1', name: 'O2' },
      ],
    },
    { name: '16' },
    { name: '17' },
    { name: '18', labels: [1, 2] },
    {
      name: 'P',
      racks: [
        { type: 'Pallets1', name: 'P1' },
        { type: 'Pallets1', name: 'P2' },
      ],
    },
    {
      name: 'Q',
      racks: [
        { type: 'Pallets1', name: 'Q1' },
        { type: 'Pallets1', name: 'Q2' },
      ],
    },
  ],
  SF: [
    {
      name: 'A',
      racks: [
        {},
        { type: 'Freezer1', name: 'A2' },
        { type: 'Freezer2', name: 'A3' },
      ],
    },
    { name: '1', labels: [1, 2, 3] },
    {
      name: 'B',
      racks: [
        { type: 'Freezer1', name: 'B1' },
        { type: 'Freezer1', name: 'B2' },
        { type: 'Freezer2', name: 'B3' },
      ],
    },
  ],
};

export const locationPositionConfigurations = {
  Pallets1: [
    {
      name: '1',
      maxPounds: 3200,
      positions: [
        { name: '1L', totes: [4, 5, 18] },
        { name: '1R', totes: [4, 5, 18] },
      ],
    },
    {
      name: '2',
      maxPounds: 3200,
      positions: [
        { name: '2L', totes: [4, 5, 18] },
        { name: '2R', totes: [4, 5, 18] },
      ],
    },
    {
      name: '3',
      maxPounds: 3200,
      positions: [
        { name: '3L', totes: [4, 5, 18] },
        { name: '3R', totes: [4, 5, 18] },
      ],
    },
    {
      name: '4',
      maxPounds: 3200,
      positions: [
        { name: '4L', totes: [4, 5, 18] },
        { name: '4R', totes: [4, 5, 18] },
      ],
    },
    {
      name: '5',
      maxPounds: 3200,
      positions: [
        { name: '5L', totes: [4, 5, 18] },
        { name: '5R', totes: [4, 5, 18] },
      ],
      noShelf: true,
    },
  ],
  Pallets2: [
    {
      name: '1',
      maxPounds: 3200,
      positions: [
        { name: '1L', totes: [5, 7, 32] },
        { name: '1R', totes: [5, 7, 32] },
      ],
    },
    {
      name: '2',
      maxPounds: 3200,
      positions: [
        { name: '2L', totes: [5, 7, 32] },
        { name: '2R', totes: [5, 7, 32] },
      ],
    },
    {
      name: '3',
      maxPounds: 3200,
      positions: [
        { name: '3L', totes: [5, 7, 32] },
        { name: '3R', totes: [5, 7, 32] },
      ],
      noShelf: true,
    },
    {
      name: '4',
      maxPounds: 3200,
      positions: [
        { name: '4L', totes: [5, 7, 32] },
        { name: '4R', totes: [5, 7, 32] },
      ],
      noShelf: true,
    },
  ],
  Freezer1: [
    {
      name: '1',
      maxPounds: 3200,
      positions: [
        { name: '1L', totes: [4, 5, 18] },
        { name: '1R', totes: [4, 5, 18] },
      ],
    },
    {
      name: '2',
      maxPounds: 3200,
      positions: [
        { name: '2L', totes: [4, 5, 18] },
        { name: '2R', totes: [4, 5, 18] },
      ],
    },
    {
      name: '3',
      maxPounds: 3200,
      positions: [
        { name: '3L', totes: [4, 5, 18] },
        { name: '3R', totes: [4, 5, 18] },
      ],
    },
    {
      name: '4',
      maxPounds: 3200,
      positions: [
        { name: '4L', totes: [4, 5, 18] },
        { name: '4R', totes: [4, 5, 18] },
      ],
    },
    {
      name: '5',
      maxPounds: 3200,
      positions: [
        { name: '5L', totes: [4, 5, 18] },
        { name: '5R', totes: [4, 5, 18] },
      ],
      noShelf: true,
    },
  ],
  Freezer2: [
    {
      name: '1',
      maxPounds: 3200,
      positions: [
        { name: '1L', totes: [4, 5, 18] },
        { name: '1C', totes: [4, 5, 18] },
        { name: '1R', totes: [4, 5, 18] },
      ],
    },
    {
      name: '2',
      maxPounds: 3200,
      positions: [
        { name: '2L', totes: [4, 5, 18] },
        { name: '2C', totes: [4, 5, 18] },
        { name: '2R', totes: [4, 5, 18] },
      ],
    },
    {
      name: '3',
      maxPounds: 3200,
      positions: [
        { name: '3L', totes: [4, 5, 18] },
        { name: '3C', totes: [4, 5, 18] },
        { name: '3R', totes: [4, 5, 18] },
      ],
    },
    {
      name: '4',
      maxPounds: 3200,
      positions: [
        { name: '4L', totes: [4, 5, 18] },
        { name: '4C', totes: [4, 5, 18] },
        { name: '4R', totes: [4, 5, 18] },
      ],
    },
    {
      name: '5',
      maxPounds: 3200,
      positions: [
        { name: '5L', totes: [4, 5, 18] },
        { name: '5C', totes: [4, 5, 18] },
        { name: '5R', totes: [4, 5, 18] },
      ],
      noShelf: true,
    },
  ],
  Cages1: [
    {
      name: '1',
      maxPounds: 6000,
      positions: [
        {
          name: '1L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
        {
          name: '1R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
      ],
    },
    {
      name: '2',
      maxPounds: 6000,
      positions: [
        {
          name: '2L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
        {
          name: '2R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
      ],
    },
    {
      name: '3',
      maxPounds: 6000,
      positions: [
        {
          name: '3L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
        {
          name: '3R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
      ],
      noShelf: true,
    },
  ],
  Cages2: [
    {
      name: '1',
      maxPounds: 6000,
      positions: [
        {
          name: '1L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
              '19',
            ],
            h: [
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
              'N',
            ],
          },
        },
        {
          name: '1R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
              '19',
            ],
            h: [
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
              'N',
            ],
          },
        },
      ],
    },
    {
      name: '2',
      positions: [
        { name: '2L', totes: [5, 7, 32] },
        { name: '2R', totes: [5, 7, 32] },
      ],
    },
    {
      name: '3',
      positions: [
        { name: '3L', totes: [5, 7, 32] },
        { name: '3R', totes: [5, 7, 32] },
      ],
      noShelf: true,
    },
    {
      name: '4',
      positions: [
        { name: '4L', totes: [5, 7, 32] },
        { name: '4R', totes: [5, 7, 32] },
      ],
      noShelf: true,
    },
  ],
  Cages3: [
    {
      name: '1',
      maxPounds: 6000,
      positions: [
        {
          name: '1L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
              '19',
            ],
            h: [
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
              'N',
            ],
          },
        },
        {
          name: '1R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
              '19',
            ],
            h: [
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
              'N',
            ],
          },
        },
      ],
    },
    {
      name: '2',
      maxPounds: 6000,
      positions: [
        {
          name: '2L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
        {
          name: '2R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
      ],
    },
    {
      name: '3',
      maxPounds: 6000,
      positions: [
        {
          name: '3L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
        {
          name: '3R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
      ],
      noShelf: true,
    },
    {
      name: '4',
      maxPounds: 6000,
      positions: [
        {
          name: '4L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
        {
          name: '4R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
      ],
      noShelf: true,
    },
  ],
  Cages4: [
    {
      name: '1',
      maxPounds: 6000,
      positions: [
        {
          name: '1L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
            ],
            h: [
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
            ],
          },
        },
        {
          name: '1R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
            ],
            h: [
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
            ],
          },
        },
      ],
    },
    {
      name: '2',
      maxPounds: 6000,
      positions: [
        {
          name: '2L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
        {
          name: '2R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
      ],
    },
    {
      name: '3',
      maxPounds: 6000,
      positions: [
        {
          name: '3L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
        {
          name: '3R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
      ],
      noShelf: true,
    },
    {
      name: '4',
      maxPounds: 6000,
      positions: [
        {
          name: '4L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
        {
          name: '4R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
      ],
      noShelf: true,
    },
  ],
  Cages5: [
    {
      name: '1',
      maxPounds: 6000,
      positions: [
        {
          name: '1L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
            ],
            h: [
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
            ],
          },
        },
        {
          name: '1R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
            ],
            h: [
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
            ],
          },
        },
      ],
    },
    {
      name: '2',
      maxPounds: 6000,
      positions: [
        {
          name: '2L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
        {
          name: '2R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
      ],
    },
    {
      name: '3',
      maxPounds: 6000,
      positions: [
        {
          name: '3L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
        {
          name: '3R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
      ],
      noShelf: true,
    },
    {
      name: '4',
      maxPounds: 6000,
      positions: [
        {
          name: '4L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
        {
          name: '4R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
      ],
      noShelf: true,
    },
  ],
  Cages6: [
    {
      name: '1',
      maxPounds: 6000,
      positions: [
        {
          name: '1L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
              '19',
            ],
            h: [
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
              'N',
            ],
          },
        },
        {
          name: '1R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
              '19',
            ],
            h: [
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
              'N',
            ],
          },
        },
      ],
    },
    {
      name: '2',
      maxPounds: 6000,
      positions: [
        {
          name: '2L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
        { name: '2R', totes: [5, 7, 32] },
      ],
    },
    {
      name: '3',
      maxPounds: 6000,
      positions: [
        {
          name: '3L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
        { name: '3R', totes: [5, 7, 32] },
      ],
      noShelf: true,
    },
    {
      name: '4',
      maxPounds: 6000,
      positions: [
        {
          name: '4L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
        { name: '4R', totes: [5, 7, 32] },
      ],
      noShelf: true,
    },
  ],
  Cages7: [
    {
      name: '1',
      maxPounds: 6000,
      positions: [
        {
          name: '1L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
              '19',
            ],
            h: [
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
              'N',
            ],
          },
        },
        {
          name: '1R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
              '19',
            ],
            h: [
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
              'N',
            ],
          },
        },
      ],
    },
    {
      name: '2',
      maxPounds: 6000,
      positions: [
        {
          name: '2L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
        {
          name: '2R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
      ],
    },
    {
      name: '3',
      maxPounds: 6000,
      positions: [
        {
          name: '3L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
        {
          name: '3R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
      ],
      noShelf: true,
    },
    {
      name: '4',
      maxPounds: 6000,
      positions: [
        {
          name: '4L',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
        {
          name: '4R',
          slots: {
            v: [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
            h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          },
        },
      ],
      noShelf: true,
    },
  ],
  DDH1: [
    {
      name: '01',
      maxPounds: 1450,
      boxes: { v: [1, 2, 3, 4], h: ['A', 'B', 'C', 'D', 'E', 'F'] },
    },
    {
      name: '02',
      maxPounds: 1450,
      boxes: { v: [1, 2, 3, 4], h: ['A', 'B', 'C', 'D', 'E', 'F'] },
    },
    {
      name: '03',
      maxPounds: 1450,
      boxes: { v: [1, 2, 3, 4], h: ['A', 'B', 'C', 'D', 'E', 'F'] },
    },
    {
      name: '04',
      maxPounds: 1450,
      boxes: { v: [1, 2, 3, 4], h: ['A', 'B', 'C', 'D', 'E', 'F'] },
    },
    {
      name: '05',
      maxPounds: 1450,
      boxes: { v: [1, 2, 3, 4], h: ['A', 'B', 'C', 'D', 'E', 'F'] },
    },
    {
      name: '06',
      maxPounds: 1450,
      boxes: { v: [1, 2, 3, 4], h: ['A', 'B', 'C', 'D', 'E', 'F'] },
    },
    {
      name: '07',
      maxPounds: 1450,
      boxes: { v: [1, 2, 3, 4], h: ['A', 'B', 'C', 'D', 'E', 'F'] },
    },
    {
      name: '08',
      maxPounds: 1450,
      boxes: { v: [1, 2, 3, 4], h: ['A', 'B', 'C', 'D', 'E', 'F'] },
    },
    {
      name: '09',
      maxPounds: 1450,
      boxes: { v: [1, 2, 3, 4], h: ['A', 'B', 'C', 'D', 'E', 'F'] },
    },
    {
      name: '10',
      maxPounds: 1450,
      boxes: { v: [1, 2, 3, 4], h: ['A', 'B', 'C', 'D', 'E', 'F'] },
    },
    {
      name: '11',
      maxPounds: 1450,
      boxes: { v: [1, 2, 3, 4], h: ['A', 'B', 'C', 'D', 'E', 'F'] },
    },
    {
      name: '12',
      maxPounds: 1450,
      boxes: { v: [1, 2, 3, 4], h: ['A', 'B', 'C', 'D', 'E', 'F'] },
    },
    { name: '', noShelf: true },
  ],
  Andrill1: [
    {
      name: '01',
      maxPounds: 1450,
      boxes: {
        v: [1, 2, 3, 4],
        h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      },
    },
    {
      name: '02',
      maxPounds: 1450,
      boxes: {
        v: [1, 2, 3, 4],
        h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      },
    },
    {
      name: '03',
      maxPounds: 1450,
      boxes: {
        v: [1, 2, 3, 4],
        h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      },
    },
    {
      name: '04',
      maxPounds: 1450,
      boxes: {
        v: [1, 2, 3, 4],
        h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      },
    },
    {
      name: '05',
      maxPounds: 1450,
      boxes: {
        v: [1, 2, 3, 4],
        h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      },
    },
    {
      name: '06',
      maxPounds: 1450,
      boxes: {
        v: [1, 2, 3, 4],
        h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      },
    },
    {
      name: '07',
      maxPounds: 1450,
      boxes: {
        v: [1, 2, 3, 4],
        h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      },
    },
    {
      name: '08',
      maxPounds: 1450,
      boxes: {
        v: [1, 2, 3, 4],
        h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      },
    },
    {
      name: '09',
      maxPounds: 1450,
      boxes: {
        v: [1, 2, 3, 4],
        h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      },
    },
    {
      name: '10',
      maxPounds: 1450,
      boxes: {
        v: [1, 2, 3, 4],
        h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      },
    },
    {
      name: '11',
      maxPounds: 1450,
      boxes: {
        v: [1, 2, 3, 4],
        h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      },
    },
    {
      name: '12',
      maxPounds: 1450,
      boxes: {
        v: [1, 2, 3, 4],
        h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      },
    },
    {
      name: '13',
      maxPounds: 1450,
      boxes: {
        v: [1, 2, 3, 4],
        h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      },
    },
    {
      name: '14',
      maxPounds: 1450,
      boxes: {
        v: [1, 2, 3, 4],
        h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      },
    },
    {
      name: '15',
      maxPounds: 1450,
      boxes: {
        v: [1, 2, 3, 4],
        h: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      },
    },
    { name: '', noShelf: true },
  ],
  Basement1: [
    {
      name: '01',
      maxPounds: 1450,
      boxes: { v: [1], h: ['A', 'B'] },
      topShelf: true,
    },
    { name: '02', maxPounds: 1450, boxes: { v: [1, 2], h: ['A', 'B'] } },
    { name: '03', maxPounds: 1450, boxes: { v: [1, 2], h: ['A', 'B'] } },
    { name: '04', maxPounds: 1450, boxes: { v: [1, 2], h: ['A', 'B'] } },
    { name: '05', maxPounds: 1450, boxes: { v: [1, 2], h: ['A', 'B'] } },
    { name: '06', maxPounds: 1450, boxes: { v: [1, 2], h: ['A', 'B'] } },
    { name: '', noShelf: true },
  ],
};

export const locationRacks = {};
export const locationRackNames = {};
export const locationRacksMaxPounds = {};
export const locationPositionNames = {};
export const locationPositionsMaxPounds = {};
export const locationPositionSlots = {};
export const locationSlotNames = {};
locationAreas.forEach((zone) => {
  locationRacks[zone] = {};
  locationRackNames[zone] = [];
  locationRacksMaxPounds[zone] = {};
  locationPositionsMaxPounds[zone] = {};
  locationPositionNames[zone] = {};
  locationPositionSlots[zone] = {};
  locationSlotNames[zone] = {};
  locationRackConfigurations[zone].forEach((racks) => {
    racks.racks?.forEach((rack) => {
      if (rack?.name !== undefined) locationRackNames[zone].push(rack.name);
      if (rack?.name !== undefined) locationRacks[zone][rack.name] = rack;
      if (rack?.name !== undefined && rack?.type !== undefined) {
        locationPositionsMaxPounds[zone][rack.name] = {};
        locationPositionNames[zone][rack.name] = [];
        locationPositionSlots[zone][rack.name] = {};
        locationSlotNames[zone][rack.name] = {};
        locationPositionConfigurations[rack.type].forEach((shelf) => {
          if (shelf?.maxPounds !== undefined) {
            if (shelf?.name !== undefined) {
              locationRacksMaxPounds[zone][rack.name] =
                locationRacksMaxPounds[zone][rack.name] || {};
              locationRacksMaxPounds[zone][rack.name][shelf.name] =
                shelf.maxPounds;
            } else {
              locationRacksMaxPounds[zone][rack.name] =
                locationRacksMaxPounds[zone][rack.name] || 0;
              locationRacksMaxPounds[zone][rack.name] += shelf.maxPounds;
            }
          }
          if (shelf?.positions) {
            shelf.positions.forEach((position) => {
              locationPositionNames[zone][rack.name].push(position.name);
              locationPositionsMaxPounds[zone][rack.name][position.name] =
                shelf.maxPounds / shelf.positions.length;
              locationPositionSlots[zone][rack.name][position.name] = {
                v: position.slots?.v || [],
                h: position.slots?.h || [],
              };
              locationSlotNames[zone][rack.name][position.name] = [];
              if (position.slots?.h && position.slots?.v) {
                position.slots.h.forEach((h) => {
                  position.slots.v.forEach((v) => {
                    locationSlotNames[zone][rack.name][position.name].push(
                      `${h}${v}`
                    );
                  });
                });
              }
              if (position.totes) {
                locationSlotNames[zone][rack.name][position.name] = [
                  ...Array(position.totes[2]).keys(),
                ].map((x) => `${x + 1}`.padStart(2, '0'));
              }
            });
          } else if (shelf?.boxes) {
            locationPositionNames[zone][rack.name].push(shelf.name);
            locationPositionSlots[zone][rack.name][shelf.name] = {
              v: shelf.boxes?.v || [],
              h: shelf.boxes?.h || [],
            };
            locationSlotNames[zone][rack.name][shelf.name] = [];
            shelf.boxes.h.forEach((h) => {
              shelf.boxes.v.forEach((v) => {
                locationSlotNames[zone][rack.name][shelf.name].push(`${h}${v}`);
              });
            });
          }
        });
      }
    });
  });
  locationRackNames[zone] = locationRackNames[zone].sort();
});

console.log('locationRacks:', locationRacks);
console.log('locationRackNames:', locationRackNames);
console.log('locationRacksMaxPounds', locationRacksMaxPounds);
console.log('locationPositionNames', locationPositionNames);
console.log('locationSlotNames', locationSlotNames);

export const locationPrefixesName: Record<
  (typeof locationAreas)[number],
  string
> = {
  DW: 'Dry West',
  DE: 'Dry East',
  CW: 'Cold West',
  CE: 'Cold East',
  SF: 'Sediment Freezer',
  RE: 'Rock East',
  RB: 'Rock Basement',
};

export const locationPrefixesIcon: Record<
  (typeof locationAreas)[number],
  SemanticICONS
> = {
  DW: 'thermometer half',
  DE: 'thermometer half',
  CW: 'sun',
  CE: 'sun',
  SF: 'snowflake',
  RE: 'archive',
  RB: 'align justify',
};

export const locationPrefixesCornerIcon: Record<
  (typeof locationAreas)[number],
  SemanticICONS
> = {
  DW: 'chevron circle left',
  DE: 'chevron circle right',
  CW: 'chevron circle left',
  CE: 'chevron circle right',
  SF: 'chevron circle right',
  RE: 'chevron circle right',
  RB: 'chevron circle down',
};
