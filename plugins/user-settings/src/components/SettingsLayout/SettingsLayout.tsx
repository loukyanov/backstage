/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { TabProps } from '@material-ui/core';
import {
  Header,
  Page,
  RoutedTabs,
  useSidebarPinState,
} from '@backstage/core-components';
import {
  attachComponentData,
  useElementFilter,
} from '@backstage/core-plugin-api';

/** @public */
export type SubRoute = {
  path: string;
  title: string;
  children: JSX.Element;
  tabProps?: TabProps<React.ElementType, { component?: React.ElementType }>;
};

const dataKey = 'plugin.explore.settingsLayoutRoute';

const Route: (props: SubRoute) => null = () => null;
attachComponentData(Route, dataKey, true);

// This causes all mount points that are discovered within this route to use the path of the route itself
attachComponentData(Route, 'core.gatherMountPoints', true);

/** @public */
export type SettingsLayoutProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
};

/**
 * @public
 */
export const SettingsLayout = (props: SettingsLayoutProps) => {
  const { title, children } = props;
  const { isMobile } = useSidebarPinState();

  const routes = useElementFilter(children, elements =>
    elements
      .selectByComponentData({
        key: dataKey,
        withStrictError:
          'Child of SettingsLayout must be an SettingsLayout.Route',
      })
      .getElements<SubRoute>()
      .map(child => child.props),
  );

  return (
    <Page themeId="home">
      {!isMobile && <Header title={title ?? 'Settings'} />}
      <RoutedTabs routes={routes} />
    </Page>
  );
};

SettingsLayout.Route = Route;
