import { darken, lighten } from 'polished';

const colors = {
  black: '#000',
  white: '#fff',
  lightestGrey: '#eaeaea',
  lightgrey: '#efefef',
  grey: '#ddd',
  darkGrey: '#bcbcbc',
  darkestGrey: '#6e6e6e',
  blueBlack: '#0e0e19',
  blueLightGrey: '#657AAF',
  blueGrey: '#373C60',
  greyPurple: '#262636',
  darkPurple: '#191B2C',
  purple: '#6970B9',
  blue: '#247ba0',
  blueGreen: '#70c1b3',
  green: '#00e676',
  olive: '#b2dbbf',
  pale: '#f3ffbd',
  blush: '#ff1654',
  red: '#ff1654',
  orange: '#ff8a16',

  hack0: '#20212e',
  hack0dark: darken(0.02, '#20212e'),
  hack0light: lighten(0.02, '#20212e'),

  hack1: '#736df8',
  hack2: '#9995fe',
  hack3: '#fefefe',
  hack4: '#8e919f',
  hack5: '#ceccdb',
  hack6: '#c6a88a',

};

export default colors;
