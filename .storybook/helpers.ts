import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import { StoryObj } from '@storybook/react';

import {
  STORY_BOOK_DESKTOP_4K_VIEWPORT_ID,
  STORY_BOOK_DESKTOP_VIEWPORT_ID,
  STORY_BOOK_MOBILE_VIEWPORT_ID,
  STORY_BOOK_TABLET_VIEWPORT_ID,
  STORY_BOOK_VIEW_PORTS,
} from 'storybook-dir/consts';

export function buildStoryObj<T>(
  args: StoryObj<T>['args'],
  defaultViewport: string,
  parameters: Partial<StoryObj<T>['parameters']> = {},
): StoryObj<T> {
  return {
    args,
    parameters: {
      layout: 'fullscreen',
      ...parameters,
      viewport: {
        viewports: {
          ...STORY_BOOK_VIEW_PORTS,
          ...INITIAL_VIEWPORTS,
          ...MINIMAL_VIEWPORTS,
        },
        defaultViewport,
      },
    },
  } as unknown as StoryObj<T>;
}

export function buildDesktop4KStoryObj<T>(
  args: StoryObj<T>['args'],
  parameters: Partial<StoryObj<T>['parameters']> = {},
): StoryObj<T> {
  return buildStoryObj(args, STORY_BOOK_DESKTOP_4K_VIEWPORT_ID, parameters);
}

export function buildDesktopStoryObj<T>(
  args: StoryObj<T>['args'],
  parameters: Partial<StoryObj<T>['parameters']> = {},
): StoryObj<T> {
  return buildStoryObj(args, STORY_BOOK_DESKTOP_VIEWPORT_ID, parameters);
}

export function buildTabletStoryObj<T>(
  args: StoryObj<T>['args'],
  parameters: Partial<StoryObj<T>['parameters']> = {},
): StoryObj<T> {
  return buildStoryObj(args, STORY_BOOK_TABLET_VIEWPORT_ID, parameters);
}

export function buildMobileStoryObj<T>(
  args: StoryObj<T>['args'],
  parameters: Partial<StoryObj<T>['parameters']> = {},
): StoryObj<T> {
  return buildStoryObj(args, STORY_BOOK_MOBILE_VIEWPORT_ID, parameters);
}
