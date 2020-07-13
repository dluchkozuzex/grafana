import React, { PureComponent } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { NavModel } from '@grafana/data';
import { config } from '@grafana/runtime';
import { LegendSeriesIcon } from '@grafana/ui';
import Page from '../Page/Page';
import { getNavModel } from 'app/core/selectors/navModel';
import { StoreState } from 'app/types';
import { DashboardGrid } from 'app/features/dashboard/dashgrid/DashboardGrid';
import { initDashboard } from 'app/features/dashboard/state/initDashboard';
import { DashboardModel, PanelModel } from 'app/features/dashboard/state';
import { DashboardRouteInfo } from 'app/types';
import { cleanUpDashboardAndVariables } from 'app/features/dashboard/state/actions';
import { hot } from 'react-hot-loader';
interface ConnectedProps {
  navModel: NavModel;
  dashboard: DashboardModel;
  initDashboard: typeof initDashboard;
  cleanUpDashboardAndVariables: typeof cleanUpDashboardAndVariables;
  $scope: any;
  $injector: any;
  urlUid?: string;
  urlSlug?: string;
  urlType?: string;
  urlFolderId?: string;
  isInitSlow: boolean;
  routeInfo: DashboardRouteInfo;
}

type Props = ConnectedProps;
export interface State {
  editPanel: PanelModel | null;
  viewPanel: PanelModel | null;
  scrollTop: number;
}

export class ErrorPage extends PureComponent<Props> {
  state: State = {
    editPanel: null,
    viewPanel: null,
    scrollTop: 0,
  };
  async componentDidMount() {
    this.props.initDashboard({
      $injector: this.props.$injector,
      $scope: this.props.$scope,
      urlSlug: this.props.urlSlug,
      urlUid: this.props.urlUid,
      urlType: this.props.urlType,
      urlFolderId: this.props.urlFolderId,
      routeInfo: DashboardRouteInfo.NotFound,
      fixUrl: true,
    });
  }
  componentWillUnmount() {
    this.props.cleanUpDashboardAndVariables();
  }
  render() {
    const { navModel, dashboard, isInitSlow } = this.props;
    const { editPanel, viewPanel, scrollTop } = this.state;
    const approximateScrollTop = Math.round(scrollTop / 25) * 25;
    if (!dashboard) {
      if (isInitSlow) {
        return null;
      }
      return null;
    }
    return (
      <Page navModel={navModel}>
        <Page.Contents>
          <div className="page-container page-body page-error">
            <div className="panel-container error-container">
              {/* <div className="error-column info-box">
                <div className="error-row" style={{ flex: 1 }}>
                  <div className="error-column error-space-between error-full-width">
                    <div>
                      <h1>Sorry </h1>
                      <h3>for the inconvenience</h3>
                      <p>
                        Please go back to your{' '}
                        <a href={config.appSubUrl} className="error-link">
                          home dashboard
                        </a>{' '}
                        and try again.
                      </p>
                      <p>
                        If the error persists, seek help on the{' '}
                        <a href="https://community.grafana.com" target="_blank" className="error-link">
                          community site
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="error-column graph-box">
                <div className="error-title">
                  <h3>Sorry for the inconvenience</h3>
                  <p>
                    Please go back to your{' '}
                    <a href={config.appSubUrl} className="error-link">
                      home dashboard
                    </a>{' '}
                    and try again. If the error persists, seek help on the{' '}
                    <a href="https://community.grafana.com" target="_blank" className="error-link">
                      community site
                    </a>
                    .
                  </p>
                </div>
                <div className="error-row">
                  <div className="error-column error-space-between graph-percentage">
                    <p>100%</p>
                    <p>80%</p>
                    <p>60%</p>
                    <p>40%</p>
                    <p>20%</p>
                    <p>0%</p>
                  </div>
                  <div className="error-column image-box">
                    <img src="public/img/graph404.png" width="100%" alt="graph" />
                    <div className="error-row error-space-between">
                      <p className="graph-text">Then</p>
                      <p className="graph-text">Now</p>
                    </div>
                  </div>
                </div>
                <div className="error-row error-legend">
                  <LegendSeriesIcon
                    color={'#7eb26d'}
                    disabled={false}
                    onColorChange={color => {
                      console.log(color);
                    }}
                    yAxis={0}
                  />
                  <p>Chances you are on the page you are looking for. Current: 0%</p>
                </div>
              </div>
            </div>
            <div className="dashboard-content">
              <DashboardGrid
                dashboard={dashboard}
                viewPanel={viewPanel}
                editPanel={editPanel}
                scrollTop={approximateScrollTop}
              />
            </div>
          </div>
        </Page.Contents>
      </Page>
    );
  }
}

const mapStateToProps = (state: StoreState) => {
  return {
    navModel: getNavModel(state.navIndex, 'not-found'),
    dashboard: state.dashboard.getModel() as DashboardModel,
    urlUid: state.location.routeParams.uid,
    urlSlug: state.location.routeParams.slug,
    urlType: state.location.routeParams.type,
    urlFolderId: state.location.query.folderId,
    isInitSlow: state.dashboard.isInitSlow,
  };
};
const mapDispatchToProps = {
  cleanUpDashboardAndVariables,
  initDashboard,
};

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(ErrorPage));
