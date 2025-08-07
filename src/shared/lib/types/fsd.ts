/**
 * Feature-Sliced Design layer types
 */

export type AppLayer = {
  type: 'app';
};

export type WidgetLayer = {
  type: 'widget';
};

export type FeatureLayer = {
  type: 'feature';
};

export type EntityLayer = {
  type: 'entity';
};

export type SharedLayer = {
  type: 'shared';
};

export type FSDLayer = AppLayer | WidgetLayer | FeatureLayer | EntityLayer | SharedLayer;

/**
 * Feature-Sliced Design segment types
 */

export type UISegment = {
  segment: 'ui';
};

export type ModelSegment = {
  segment: 'model';
};

export type APISegment = {
  segment: 'api';
};

export type LibSegment = {
  segment: 'lib';
};

export type FSDSegment = UISegment | ModelSegment | APISegment | LibSegment;
