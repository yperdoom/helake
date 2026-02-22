import styles from './Dashboard.module.css';
import kpi from '../../components/kpi.module.css';
import main from '../../components/main.module.css';
import actions from '../../components/actions.module.css';
import deadlines from '../../components/deadlines.module.css';

export default {
  name: 'Dashboard',
  computed: {
    $main() {
      return main;
    },
    $kpi() {
      return kpi;
    },
    $actions() {
      return actions;
    },
    $deadlines() {
      return deadlines;
    },
    $style() {
      return styles;
    }
  }
};