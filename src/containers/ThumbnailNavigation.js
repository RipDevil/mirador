import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { withPlugins } from '../extend';
import CanvasGroupings from '../lib/CanvasGroupings';
import * as actions from '../state/actions';
import { ThumbnailNavigation } from '../components/ThumbnailNavigation';
import { getWindow } from '../state/selectors/windows';
import { getManifestCanvases } from '../state/selectors/manifests';

/**
 * mapStateToProps - used to hook up state to props
 * @memberof ThumbnailNavigation
 * @private
 */
const mapStateToProps = (state, { windowId }) => ({
  canvasGroupings: new CanvasGroupings(
    getManifestCanvases(state, { windowId }),
    state.windows[windowId].view,
  ),
  config: state.config,
  position: state.companionWindows[state.windows[windowId].thumbnailNavigationId].position,
  window: getWindow(state, { windowId }),
});

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof ThumbnailNavigation
 * @private
 */
const mapDispatchToProps = {
  setCanvas: actions.setCanvas,
};

/**
 * Styles for withStyles HOC
 */
const styles = theme => ({
  thumbNavigation: {
    '&:focus': {
      boxShadow: 0,
      outline: 0,
    },
  },
});


const enhance = compose(
  withStyles(styles),
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('ThumbnailNavigation'),
);

export default enhance(ThumbnailNavigation);
